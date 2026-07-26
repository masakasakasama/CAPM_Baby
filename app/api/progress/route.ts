import { eq, sql } from "drizzle-orm";
import { ensureProgressSchema, getDb } from "../../../db";
import { progressDocuments } from "../../../db/schema";

const SYNC_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DEFAULT_SYNC_ID = "capm-default-v1";
const MAX_DOCUMENT_BYTES = 500_000;

function syncIdFrom(request: Request) {
  return new URL(request.url).searchParams.get("sync")?.trim() || DEFAULT_SYNC_ID;
}

function validSyncId(syncId: string) {
  return syncId === DEFAULT_SYNC_ID || SYNC_ID.test(syncId);
}

function validDocument(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const document = value as Record<string, unknown>;
  return (
    document.schema === 1 &&
    typeof document.savedAt === "string" &&
    typeof document.progress === "object" &&
    document.progress !== null &&
    (document.activeExam === null || typeof document.activeExam === "object")
  );
}

export async function GET(request: Request) {
  const syncId = syncIdFrom(request);
  if (!validSyncId(syncId)) {
    return Response.json({ error: "A valid sync link is required." }, { status: 400 });
  }

  try {
    await ensureProgressSchema();
    const db = getDb();
    const [row] = await db
      .select()
      .from(progressDocuments)
      .where(eq(progressDocuments.syncId, syncId))
      .limit(1);

    if (!row) return Response.json({ exists: false, revision: 0 });
    return Response.json({
      exists: true,
      revision: row.revision,
      updatedAt: row.updatedAt,
      document: JSON.parse(row.document),
    });
  } catch {
    return Response.json(
      { error: "Cloud progress is temporarily unavailable." },
      { status: 503 },
    );
  }
}

export async function PUT(request: Request) {
  const syncId = syncIdFrom(request);
  if (!validSyncId(syncId)) {
    return Response.json({ error: "A valid sync link is required." }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!validDocument(payload)) {
    return Response.json({ error: "Invalid progress document." }, { status: 400 });
  }

  const document = JSON.stringify(payload);
  if (new TextEncoder().encode(document).byteLength > MAX_DOCUMENT_BYTES) {
    return Response.json({ error: "Progress document is too large." }, { status: 413 });
  }

  try {
    await ensureProgressSchema();
    const db = getDb();
    const [row] = await db
      .insert(progressDocuments)
      .values({ syncId, document })
      .onConflictDoUpdate({
        target: progressDocuments.syncId,
        set: {
          document,
          revision: sql`${progressDocuments.revision} + 1`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        },
      })
      .returning({
        revision: progressDocuments.revision,
        updatedAt: progressDocuments.updatedAt,
      });

    return Response.json({ saved: true, revision: row.revision, updatedAt: row.updatedAt });
  } catch {
    return Response.json(
      { error: "Cloud progress is temporarily unavailable." },
      { status: 503 },
    );
  }
}
