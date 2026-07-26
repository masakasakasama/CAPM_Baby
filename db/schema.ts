import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const progressDocuments = sqliteTable("progress_documents", {
  syncId: text("sync_id").primaryKey(),
  document: text("document").notNull(),
  revision: integer("revision").notNull().default(1),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
