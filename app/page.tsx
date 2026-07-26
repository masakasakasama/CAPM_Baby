"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { questions, sources, units, type Question } from "./data";
import {
  MOCK_DURATION_MINUTES,
  MOCK_EXAM_SIZE,
  selectMockExamQuestions,
} from "./exam";
import {
  calculateNextReview,
  calculateReadiness,
  calculateSchedule,
  getAnswerStats,
  initialProgress,
  makeSyncDocument,
  parseActiveExam,
  parseProgress,
  parseSyncDocument,
  selectNextQuestionId,
  upsertAnswerAttempt,
  type ActiveExam,
  type Confidence,
  type MockResult,
  type Progress,
} from "./progress";
import { agencyCourse as overviewCourse, studyGuides } from "./study";

type View = "home" | "learn" | "practice" | "exam" | "review" | "sources";
type SyncStatus = "loading" | "synced" | "saving" | "offline";

const APP_VERSION = "1.4.0";
const DEFAULT_SYNC_ID = "capm-default-v1";
const LEGACY_SYNC_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const STORAGE_PREFIX = "capm:progress:v2:";
const EXAM_PREFIX = "capm:exam:v2:";

const navItems: { id: View; label: string; de: string; icon: string }[] = [
  { id: "home", label: "Overview", de: "Übersicht", icon: "⌂" },
  { id: "learn", label: "Study", de: "Lernen", icon: "◫" },
  { id: "practice", label: "Practice", de: "Üben", icon: "✦" },
  { id: "exam", label: "Mock exam", de: "Probeprüfung", icon: "◎" },
  { id: "review", label: "Review", de: "Wiederholen", icon: "↻" },
];

function sameAnswer(left: number[], right: number[]) {
  if (left.length !== right.length) return false;
  const a = [...left].sort((x, y) => x - y);
  const b = [...right].sort((x, y) => x - y);
  return a.every((value, index) => value === b[index]);
}

function formatTimer(seconds: number) {
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function formatDate(value?: string | null) {
  if (!value) return "Not yet";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function localDateInput(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/*
function JourneyIcon({ kind }: { kind: number }) {
  const common = {
    viewBox: "0 0 96 72",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (kind === 0) {
    return (
      <svg {...common}>
        <circle cx="39" cy="31" r="18" />
        <path d="m52 44 18 17" />
        <path d="M32 31h14M39 24v14" />
        <path d="M67 16c5-7 15-2 11 5-2 4-7 7-11 11-4-4-9-7-11-11-4-7 6-12 11-5Z" />
      </svg>
    );
  }
  if (kind === 1) {
    return (
      <svg {...common}>
        <circle cx="47" cy="36" r="25" />
        <circle cx="47" cy="36" r="15" />
        <circle cx="47" cy="36" r="5" />
        <path d="M68 15 84 7l-5 16-12 12M78 14l-8 8" />
      </svg>
    );
  }
  if (kind === 2) {
    return (
      <svg {...common}>
        <circle cx="17" cy="36" r="6" />
        <circle cx="77" cy="14" r="6" />
        <circle cx="77" cy="58" r="6" />
        <path d="M23 36h18c13 0 12-22 25-22h5M41 36h8c12 0 7 22 22 22" />
        <path d="m64 9 7 5-7 5M64 53l7 5-7 5" />
      </svg>
    );
  }
  if (kind === 3) {
    return (
      <svg {...common}>
        <rect x="13" y="10" width="70" height="52" rx="9" />
        <path d="M25 22h10M25 35h10M25 48h10M43 22h25M43 35h14M43 48h32" />
        <path d="M43 17v10M57 30v10M67 43v10" />
      </svg>
    );
  }
  if (kind === 4) {
    return (
      <svg {...common}>
        <rect x="35" y="23" width="26" height="26" rx="6" />
        <path d="M21 39a28 28 0 0 1 44-22M65 17h-9M65 17v-9" />
        <path d="M75 33a28 28 0 0 1-44 22M31 55h9M31 55v9" />
        <path d="m43 36 4 4 8-9" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M16 60h65" />
      <rect x="23" y="39" width="10" height="21" rx="3" />
      <rect x="43" y="28" width="10" height="32" rx="3" />
      <rect x="63" y="16" width="10" height="44" rx="3" />
      <path d="m20 27 12 10 15-16 11 8 20-21" />
      <path d="m70 8 8 0 0 8" />
    </svg>
  );
}
*/

/*
function CaseIcon({ kind }: { kind: string }) {
  const common = {
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (kind === "people") return <svg {...common}><circle cx="24" cy="21" r="7" /><circle cx="43" cy="24" r="6" /><path d="M10 49c1-11 7-17 14-17s13 6 14 17M36 37c2-4 5-6 9-6 6 0 10 5 11 14" /><path d="M14 10c5-4 11-6 18-5M48 11c3 2 5 5 6 8" /></svg>;
  if (kind === "signal") return <svg {...common}><path d="M12 49h40M18 43V31M31 43V22M44 43V14" /><circle cx="18" cy="27" r="3" /><circle cx="31" cy="18" r="3" /><circle cx="44" cy="10" r="3" /><path d="M11 15c5-5 11-8 18-9M9 24c4-3 8-5 13-6" /></svg>;
  if (kind === "handshake") return <svg {...common}><path d="m8 23 10-7 10 5 8-3 19 11-9 17-9-1-8 5-15-12Z" /><path d="m23 25 8-5 7 5 9 5M21 37l11 7M27 33l12 8M34 29l10 7" /><path d="m8 23 8 15M55 29l-9 17" /></svg>;
  if (kind === "school") return <svg {...common}><path d="m8 25 24-14 24 14M13 27h38v27H13zM8 55h48" /><path d="M22 32v14M32 32v14M42 32v14M28 54V43h8v11" /></svg>;
  return <svg {...common}><path d="M8 24 32 13l24 11-24 11Z" /><path d="M18 30v11c7 7 21 7 28 0V30M54 25v16" /><path d="M20 51h24M27 47v8M37 47v8" /></svg>;
}
*/

function ChoiceList({
  question,
  selected,
  onChange,
  disabled,
  reveal,
}: {
  question: Question;
  selected: number[];
  onChange: (value: number[]) => void;
  disabled?: boolean;
  reveal?: boolean;
}) {
  const multi = question.kind === "multiple";
  return (
    <div className="choices" role={multi ? "group" : "radiogroup"} aria-label="Answer choices">
      {question.options.map((option, index) => {
        const checked = selected.includes(index);
        const correct = reveal && question.correct.includes(index);
        const wrong = reveal && checked && !question.correct.includes(index);
        return (
          <label
            className={`choice ${checked ? "selected" : ""} ${correct ? "correct-choice" : ""} ${wrong ? "wrong-choice" : ""}`}
            key={option}
          >
            <input
              type={multi ? "checkbox" : "radio"}
              name={question.id}
              checked={checked}
              disabled={disabled}
              onChange={() => {
                if (multi) {
                  onChange(
                    checked
                      ? selected.filter((item) => item !== index)
                      : [...selected, index],
                  );
                } else {
                  onChange([index]);
                }
              }}
            />
            <span className="choice-key">{String.fromCharCode(65 + index)}</span>
            <span>{option}</span>
          </label>
        );
      })}
    </div>
  );
}

function BeginnerQuestions({ question }: { question: Question }) {
  return (
    <section className="beginner-faqs" lang="de" aria-label="Fragen für Einsteiger">
      <header>
        <span>ANFÄNGERFRAGEN</span>
        <strong>Was bedeutet das eigentlich?</strong>
        <p>Tippe auf eine Frage. Die Erklärung beginnt ohne Fachsprache und nutzt ein konkretes Beispiel.</p>
      </header>
      <div>
        {question.beginnerFaqs.map((faq) => (
          <details key={faq.questionDe}>
            <summary>{faq.questionDe}</summary>
            <p>{faq.answerDe}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [hydrated, setHydrated] = useState(false);
  const [remoteReady, setRemoteReady] = useState(false);
  const [syncId, setSyncId] = useState("");
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("loading");
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [selectedStudyUnit, setSelectedStudyUnit] = useState<number | null>(null);
  const [practiceUnit, setPracticeUnit] = useState<number | "all">("all");
  const [practiceQuestionId, setPracticeQuestionId] = useState(questions[0].id);
  const [practiceSelected, setPracticeSelected] = useState<number[]>([]);
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [practiceConfidence, setPracticeConfidence] = useState<Confidence | null>(null);
  const [practiceAttemptAt, setPracticeAttemptAt] = useState<string | null>(null);
  const [exam, setExam] = useState<ActiveExam | null>(null);
  const [examResult, setExamResult] = useState<MockResult | null>(null);
  const [now, setNow] = useState(Date.now());
  const lastSynced = useRef("");
  const lastRemoteSavedAt = useRef("");

  const readiness = useMemo(
    () => calculateReadiness(progress, questions.length, units.length),
    [progress],
  );
  const schedule = useMemo(
    () => calculateSchedule(progress, readiness.total, new Date(), questions.length),
    [progress, readiness.total],
  );
  const dueCount = useMemo(
    () =>
      questions.filter((question) => {
        const record = progress.answered[question.id];
        return record && getAnswerStats(record).due;
      }).length,
    [progress],
  );
  const masteredCount = useMemo(
    () =>
      questions.filter(
        (question) => getAnswerStats(progress.answered[question.id]).consecutiveCorrect >= 2,
      ).length,
    [progress],
  );
  const practicePool = useMemo(
    () =>
      practiceUnit === "all"
        ? questions
        : questions.filter((question) => question.unit === practiceUnit),
    [practiceUnit],
  );
  const practiceQuestion =
    practicePool.find((question) => question.id === practiceQuestionId) ?? null;
  const examQuestions = exam
    ? exam.order
        .map((id) => questions.find((question) => question.id === id))
        .filter((question): question is Question => Boolean(question))
    : [];
  const currentExamQuestion = exam ? examQuestions[exam.index] : null;
  const secondsLeft = exam
    ? Math.max(0, Math.ceil((exam.endsAt - now) / 1000))
    : MOCK_DURATION_MINUTES * 60;

  async function saveCloud(
    nextProgress: Progress,
    nextExam: ActiveExam | null,
    id = syncId,
  ) {
    if (!id) return false;
    const document = makeSyncDocument(nextProgress, nextExam);
    const comparable = JSON.stringify({
      progress: document.progress,
      activeExam: document.activeExam,
    });
    if (comparable === lastSynced.current) return true;
    setSyncStatus("saving");
    try {
      const response = await fetch(
        id === DEFAULT_SYNC_ID
          ? "/api/progress"
          : `/api/progress?sync=${encodeURIComponent(id)}`,
        {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(document),
        },
      );
      if (!response.ok) throw new Error("save_failed");
      const payload = (await response.json()) as { updatedAt?: string };
      lastSynced.current = comparable;
      lastRemoteSavedAt.current = document.savedAt;
      setLastSyncAt(payload.updatedAt || document.savedAt);
      setSyncStatus("synced");
      return true;
    } catch {
      setSyncStatus("offline");
      return false;
    }
  }

  async function pullCloud(silent = false, id = syncId) {
    if (!id) return false;
    if (!silent) setSyncStatus("loading");
    try {
      const response = await fetch(
        id === DEFAULT_SYNC_ID
          ? "/api/progress"
          : `/api/progress?sync=${encodeURIComponent(id)}`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error("load_failed");
      const payload = (await response.json()) as {
        exists?: boolean;
        document?: unknown;
        updatedAt?: string;
      };
      const remote = parseSyncDocument(payload.document);
      if (
        payload.exists &&
        remote &&
        (!silent || remote.savedAt > lastRemoteSavedAt.current)
      ) {
        setProgress(remote.progress);
        setExam(
          remote.activeExam && remote.activeExam.endsAt > Date.now()
            ? remote.activeExam
            : null,
        );
        lastSynced.current = JSON.stringify({
          progress: remote.progress,
          activeExam: remote.activeExam,
        });
        lastRemoteSavedAt.current = remote.savedAt;
      }
      setLastSyncAt(payload.updatedAt || remote?.savedAt || null);
      setSyncStatus("synced");
      return Boolean(payload.exists && remote);
    } catch {
      setSyncStatus("offline");
      return false;
    }
  }

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      const params = new URLSearchParams(window.location.search);
      const legacyId = params.get("sync");
      const id = DEFAULT_SYNC_ID;
      if (legacyId) {
        params.delete("sync");
        const query = params.toString();
        window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
      }
      setSyncId(id);

      let cachedProgress = initialProgress;
      let cachedExam: ActiveExam | null = null;
      try {
        const stored = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
        cachedProgress = stored ? parseProgress(JSON.parse(stored)) || initialProgress : initialProgress;
        const storedExam = localStorage.getItem(`${EXAM_PREFIX}${id}`);
        const parsedExam = storedExam ? parseActiveExam(JSON.parse(storedExam)) : null;
        cachedExam = parsedExam && parsedExam.endsAt > Date.now() ? parsedExam : null;
      } catch {
        cachedProgress = initialProgress;
      }

      if (legacyId && LEGACY_SYNC_ID.test(legacyId)) {
        try {
          const response = await fetch(`/api/progress?sync=${encodeURIComponent(legacyId)}`, {
            cache: "no-store",
          });
          const payload = response.ok
            ? ((await response.json()) as { exists?: boolean; document?: unknown })
            : null;
          const legacy = parseSyncDocument(payload?.document);
          if (payload?.exists && legacy) {
            cachedProgress = legacy.progress;
            cachedExam =
              legacy.activeExam && legacy.activeExam.endsAt > Date.now()
                ? legacy.activeExam
                : null;
          }
        } catch {
          // Continue with the shared default record or the device fallback.
        }
      }

      setProgress(cachedProgress);
      if (cachedExam) setExam(cachedExam);
      setHydrated(true);

      const exists = await pullCloud(false, id);
      if (!exists && !cancelled) {
        await saveCloud(cachedProgress, cachedExam, id);
      }
      if (!cancelled) setRemoteReady(true);
    };
    void boot();
    return () => {
      cancelled = true;
    };
    // The first load migrates an old private-link record, then uses one shared key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated || !syncId) return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${syncId}`, JSON.stringify(progress));
      if (exam) localStorage.setItem(`${EXAM_PREFIX}${syncId}`, JSON.stringify(exam));
      else localStorage.removeItem(`${EXAM_PREFIX}${syncId}`);
    } catch {
      // The cloud document remains authoritative when browser storage is unavailable.
    }
  }, [progress, exam, hydrated, syncId]);

  useEffect(() => {
    if (!hydrated || !remoteReady || !syncId) return;
    const timeout = window.setTimeout(() => {
      void saveCloud(progress, exam);
    }, 900);
    return () => window.clearTimeout(timeout);
    // Save the combined document after local interactions settle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, exam, hydrated, remoteReady, syncId]);

  useEffect(() => {
    if (!remoteReady || !syncId) return;
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void pullCloud(true);
    }, 20_000);
    return () => window.clearInterval(interval);
    // Poll the shared document so another phone's changes appear.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteReady, syncId]);

  useEffect(() => {
    if (!exam) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [exam]);

  useEffect(() => {
    if (exam && exam.endsAt <= now) submitExam(exam);
    // Timer-driven submission is intentionally tied to the deadline.
  }, [now, exam]);

  function openStudy(unit: number) {
    setSelectedStudyUnit(unit);
    setView("learn");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function markUnitComplete(unit: number) {
    setProgress((current) => ({
      ...current,
      completedUnits: current.completedUnits.includes(unit)
        ? current.completedUnits.filter((id) => id !== unit)
        : [...current.completedUnits, unit],
      ...(unit === 0
        ? {}
        : { lastActivity: { type: "study" as const, unit, at: new Date().toISOString() } }),
    }));
  }

  function setTargetExamDate(value: string) {
    setProgress((current) => {
      if (!value) {
        const next = { ...current };
        delete next.targetExamDate;
        delete next.planStartedAt;
        return next;
      }
      return {
        ...current,
        targetExamDate: value,
        planStartedAt: current.planStartedAt || new Date().toISOString(),
      };
    });
  }

  function chooseNextQuestion(unit: number | "all", currentId: string | null = null) {
    const pool =
      unit === "all" ? questions : questions.filter((question) => question.unit === unit);
    return selectNextQuestionId(
      pool.map((question) => question.id),
      currentId,
      progress,
    );
  }

  function beginPractice(unit: number | "all" = "all") {
    setPracticeUnit(unit);
    setPracticeQuestionId(chooseNextQuestion(unit) || "");
    setPracticeSelected([]);
    setPracticeChecked(false);
    setPracticeConfidence(null);
    setPracticeAttemptAt(null);
    setView("practice");
  }

  function nextPractice() {
    setPracticeQuestionId(chooseNextQuestion(practiceUnit, practiceQuestion?.id || null) || "");
    setPracticeSelected([]);
    setPracticeChecked(false);
    setPracticeConfidence(null);
    setPracticeAttemptAt(null);
  }

  function recordAnswer(confidence: Confidence) {
    if (!practiceQuestion) return;
    const correct = sameAnswer(practiceSelected, practiceQuestion.correct);
    const at = practiceAttemptAt || new Date().toISOString();
    setProgress((current) => {
      const previous = current.answered[practiceQuestion.id];
      const record = upsertAnswerAttempt(
        previous,
        practiceSelected,
        correct,
        confidence,
        at,
        practiceAttemptAt,
      );
      const mastered = getAnswerStats(record).consecutiveCorrect >= 2;
      return {
        ...current,
        answered: { ...current.answered, [practiceQuestion.id]: record },
        review: correct && mastered
          ? current.review.filter((id) => id !== practiceQuestion.id)
          : correct
            ? current.review
            : Array.from(new Set([...current.review, practiceQuestion.id])),
        lastActivity: {
          type: "practice",
          unit: practiceUnit,
          questionId: practiceQuestion.id,
          at,
        },
      };
    });
    setPracticeAttemptAt(at);
    setPracticeConfidence(confidence);
  }

  function startExam() {
    const next: ActiveExam = {
      order: selectMockExamQuestions(questions).map((question) => question.id),
      answers: {},
      index: 0,
      endsAt: Date.now() + MOCK_DURATION_MINUTES * 60 * 1000,
    };
    setExam(next);
    setExamResult(null);
    setNow(Date.now());
    setView("exam");
  }

  function submitExam(target: ActiveExam) {
    const at = new Date().toISOString();
    let correct = 0;
    const wrong: string[] = [];
    setProgress((current) => {
      const answered = { ...current.answered };
      for (const id of target.order) {
        const question = questions.find((candidate) => candidate.id === id);
        if (!question) continue;
        const selected = target.answers[id] || [];
        const exact = sameAnswer(selected, question.correct);
        if (exact) correct += 1;
        else wrong.push(id);
        answered[id] = upsertAnswerAttempt(
          answered[id],
          selected,
          exact,
          "medium",
          at,
        );
      }
      const result: MockResult = {
        at,
        percent: Math.round((correct / target.order.length) * 100),
        correct,
        points: correct,
        total: target.order.length,
      };
      setExamResult(result);
      return {
        ...current,
        answered,
        review: Array.from(new Set([...current.review, ...wrong])),
        mockHistory: [result, ...current.mockHistory].slice(0, 20),
      };
    });
    setExam(null);
  }

  function syncLabel() {
    if (syncStatus === "saving") return "Saving… · Speichern…";
    if (syncStatus === "loading") return "Updating… · Aktualisieren…";
    if (syncStatus === "offline") return `Offline cache · Zwischenspeicher · ${formatDate(lastSyncAt)}`;
    return `Synced · Synchronisiert · ${formatDate(lastSyncAt)}`;
  }

  function renderHome() {
    const answeredCount = Object.keys(progress.answered).length;
    const nextUnit =
      units.find((unit) => !progress.completedUnits.includes(unit.id)) || units[0];
    const nextStudyUnit = progress.completedUnits.includes(0) ? nextUnit.id : 0;
    return (
      <>
        <section className="hero panel">
          <div className="hero-copy">
            <div className="brand-kicker"><span>CAPM</span> English-first · mit Deutsch</div>
            <h1>
              Make project thinking
              <em> feel simple.</em>
            </h1>
            <p>
              A visual CAPM learning space for concepts, practice, spaced review,
              and a focused mock exam.
            </p>
            <p className="de-copy" lang="de">
              Visuell lernen, auf Englisch entscheiden und Schlüsselkonzepte auf
              Deutsch festigen.
            </p>
            <div className="hero-actions">
              <button className="button primary" onClick={() => openStudy(nextStudyUnit)}>
                Continue learning <span>→</span>
              </button>
              <button className="button secondary" onClick={() => beginPractice("all")}>
                Practice due items
              </button>
            </div>
          </div>
          <div className="readiness-card">
            <div
              className="readiness-ring"
              style={{ "--score": `${readiness.total * 3.6}deg` } as React.CSSProperties}
            >
              <div><strong>{readiness.total}</strong><span>/ 100</span></div>
            </div>
            <span>Memory readiness</span>
            <small>Gedächtnisbasierter Lernindikator, keine Bestehensgarantie.</small>
          </div>
          <div className="hero-bubble bubble-one">plan</div>
          <div className="hero-bubble bubble-two">learn</div>
        </section>

        <section className={`sync-strip ${syncStatus}`}>
          <div><i /><span>{syncLabel()}</span></div>
          <div>
            <button onClick={() => void pullCloud(false)}>Refresh now</button>
          </div>
        </section>

        <div className="stat-grid">
          <article className="stat-card pink"><span>Question bank</span><strong>{questions.length}</strong><small>original practice items</small></article>
          <article className="stat-card blue"><span>Covered</span><strong>{answeredCount}<em> / {questions.length}</em></strong><small>{readiness.coverage}% of the full bank</small></article>
          <article className="stat-card mint"><span>Due now</span><strong>{dueCount}</strong><small>spaced-review items</small></article>
          <article className="stat-card lilac"><span>Mastered</span><strong>{masteredCount}</strong><small>2+ consecutive correct</small></article>
        </div>

        <div className="dashboard-grid">
          <section className="panel domain-overview">
            <div className="section-heading">
              <div><span className="eyebrow">EXAM MAP</span><h2>Four domains, one picture</h2></div>
              <span>Official ECO weights</span>
            </div>
            <div className="weight-visual" aria-label="CAPM exam domain weights">
              {units.map((unit) => (
                <button
                  key={unit.id}
                  style={{ flex: unit.weight }}
                  className={`weight-segment domain-${unit.id}`}
                  onClick={() => openStudy(unit.id)}
                >
                  <strong>{unit.weight}%</strong>
                  <span>D{unit.id}</span>
                </button>
              ))}
            </div>
            <div className="domain-list">
              {units.map((unit) => {
                const bank = questions.filter((question) => question.unit === unit.id);
                const attempted = bank.filter((question) => progress.answered[question.id]).length;
                return (
                  <button key={unit.id} onClick={() => openStudy(unit.id)}>
                    <i className={`domain-dot domain-${unit.id}`} />
                    <div><strong>{unit.title}</strong><small lang="de">{unit.titleDe}</small></div>
                    <span>{attempted}/{bank.length}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="panel plan-card">
            <span className="eyebrow">YOUR PLAN · DEIN PLAN</span>
            <h2>{schedule ? `${schedule.daysLeft} days to go` : "Choose an exam date"}</h2>
            <p lang="de">
              {schedule
                ? schedule.status === "ahead"
                  ? "Du liegst vor deinem Lernpfad."
                  : schedule.status === "behind"
                    ? "Ein kleiner Fokusblock bringt dich zurück."
                    : "Du liegst auf deinem Lernpfad."
                : "Der Tagesplan passt sich an deine verbleibenden Fragen an."}
            </p>
            <label>
              Target date
              <input
                type="date"
                min={localDateInput()}
                value={progress.targetExamDate || ""}
                onChange={(event) => setTargetExamDate(event.target.value)}
              />
            </label>
            {schedule && (
              <div className="plan-metrics">
                <span><strong>{schedule.questionsPerDay}</strong><small>questions / day</small></span>
                <span><strong>{schedule.difference > 0 ? "+" : ""}{schedule.difference}</strong><small>vs plan</small></span>
              </div>
            )}
          </aside>
        </div>

        <section className="panel formula-panel">
          <div className="section-heading">
            <div><span className="eyebrow">TRANSPARENT READINESS</span><h2>How the score is built</h2></div>
            <span>Not an official PMI score</span>
          </div>
          <div className="readiness-parts">
            {[
              ["Coverage", readiness.coverage, "25%"],
              ["Correct across bank", readiness.accuracy, "30%"],
              ["Study completion", readiness.study, "15%"],
              ["Repeated mastery", readiness.review, "10%"],
              ["Latest mock", readiness.mock, "20%"],
            ].map(([label, value, weight]) => (
              <div key={String(label)}>
                <span>{label}<em>{weight}</em></span>
                <div><i style={{ width: `${value}%` }} /></div>
                <strong>{value}%</strong>
              </div>
            ))}
          </div>
          <details>
            <summary>Open formula · Formel anzeigen</summary>
            <p>
              Readiness = coverage × 0.25 + correct questions across the entire bank ×
              0.30 + completed study guides × 0.15 + questions answered correctly at
              least twice in a row × 0.10 + latest mock result × 0.20.
            </p>
            <p lang="de">
              Unbeantwortete Fragen zählen nicht als richtig. Wenige richtige Antworten
              können den Gesamtwert daher nicht künstlich auf 100 erhöhen.
            </p>
          </details>
        </section>
      </>
    );
  }

  /*
  function renderOverviewCourseLegacy() {
    const completed = progress.completedUnits.includes(0);
    return (
      <>
        <button className="back-button" onClick={() => setSelectedStudyUnit(null)}>← Both courses</button>
        <header className="study-hero overview-course-hero panel">
          <div>
            <span className="eyebrow">COURSE 1 · START HERE</span>
            <h1>{overviewCourse.title}</h1>
            <h2 lang="de">{overviewCourse.titleDe}</h2>
            <p>{overviewCourse.lead}</p>
            <p className="de-copy" lang="de">{overviewCourse.leadDe}</p>
          </div>
          <div className="study-stamp overview-stamp"><strong>4×</strong><span>connected domains</span></div>
        </header>

        <section className="panel visual-board">
          <div className="section-heading">
            <div><span className="eyebrow">THE WHOLE STORY</span><h2>Need → value → outcome</h2></div>
            <span>One end-to-end project</span>
          </div>
          <div className="node-flow nodes-6 overview-journey">
            {overviewCourse.journey.map((node, index) => (
              <div className="flow-node" key={node.label}>
                <div className={`journey-icon journey-icon-${index + 1}`}>
                  <JourneyIcon kind={index} />
                </div>
                <span>{node.label}</span><strong>{node.title}</strong>
                <em lang="de">{node.de}</em><small>{node.note}</small>
                {index < overviewCourse.journey.length - 1 && <i>→</i>}
              </div>
            ))}
          </div>
        </section>

        <section className="panel lens-board">
          <div className="section-heading">
            <div><span className="eyebrow">FOUR LENSES</span><h2>The same project, four questions</h2></div>
            <span>Domain-crossing mental model</span>
          </div>
          <div className="lens-grid">
            {overviewCourse.lenses.map((lens, index) => (
              <article className={`domain-card-${index + 1}`} key={lens.domain}>
                <span>{lens.domain}</span><strong>{lens.title}</strong>
                <em lang="de">{lens.de}</em><p>{lens.body}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="overview-columns">
          <section className="panel scenario-board">
            <div className="section-heading">
              <div><span className="eyebrow">ONE WORKED EXAMPLE</span><h2>Clinic booking, end to end</h2></div>
            </div>
            <div className="scenario-timeline">
              {overviewCourse.scenario.map((item) => (
                <article key={item.step}>
                  <span>{item.step}</span>
                  <div><strong>{item.event}</strong><p>{item.move}</p></div>
                  <em>{item.domain}</em>
                </article>
              ))}
            </div>
          </section>
          <section className="panel approach-board">
            <div className="section-heading">
              <div><span className="eyebrow">CHOOSE THE APPROACH</span><h2>Read the uncertainty</h2></div>
            </div>
            <div>
              {overviewCourse.decisions.map((decision) => (
                <article key={decision.choice}>
                  <span>{decision.signal}</span><strong>{decision.choice}</strong>
                  <em lang="de">{decision.de}</em><p>{decision.why}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="panel anchor-board">
          <div className="section-heading">
            <div><span className="eyebrow">VOCABULARY BRIDGE</span><h2>Six anchors before the details</h2></div>
            <span>English first · Deutsch daneben</span>
          </div>
          <div>
            {overviewCourse.anchors.map(([en, de, note]) => (
              <article key={en}><strong>{en}</strong><em lang="de">{de}</em><p>{note}</p></article>
            ))}
          </div>
        </section>

        <section className="study-finish panel">
          <div><span className="eyebrow">COURSE 1 CHECKPOINT</span><h2>Now zoom into the four domains.</h2><p lang="de">Wenn die Gesamtgeschichte klar ist, beginnt Course 2 mit den Details.</p><small>{overviewCourse.source}</small></div>
          <div>
            <button className={`button ${completed ? "secondary" : "primary"}`} onClick={() => markUnitComplete(0)}>
              {completed ? "✓ Course 1 complete" : "Mark Course 1 complete"}
            </button>
            <button className="button secondary" onClick={() => { setSelectedStudyUnit(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Open Course 2</button>
          </div>
        </section>
      </>
    );
  }

  */
  /*
  function renderOverviewCourse() {
    const completed = progress.completedUnits.includes(0);
    return (
      <>
        <button className="back-button" onClick={() => setSelectedStudyUnit(null)}>← Both courses</button>
        <header className="study-hero overview-course-hero panel">
          <div>
            <span className="eyebrow">COURSE 1 · START HERE</span>
            <h1>{overviewCourse.title}</h1>
            <h2 lang="de">{overviewCourse.titleDe}</h2>
            <p>{overviewCourse.lead}</p>
            <p className="de-copy" lang="de">{overviewCourse.leadDe}</p>
          </div>
          <div className="case-snapshot" aria-label="Case starting point">
            {overviewCourse.caseFacts.map((fact) => (
              <article className={`case-fact case-fact-${fact.tone}`} key={fact.label}>
                <span>{fact.label}</span>
                <strong>{fact.value}</strong>
                <em lang="de">{fact.de}</em>
              </article>
            ))}
          </div>
        </header>

        <section className="panel ecosystem-board">
          <div className="section-heading">
            <div><span className="eyebrow">THE CASE IN ONE PICTURE</span><h2>How a student reaches the right school</h2></div>
            <span lang="de">Vom ersten Kontakt bis zum Schulstart</span>
          </div>
          <div className="ecosystem-flow">
            {overviewCourse.ecosystem.map((node, index) => (
              <article key={node.title}>
                <div><CaseIcon kind={node.icon} /></div>
                <strong>{node.title}</strong>
                <em lang="de">{node.de}</em>
                <p>{node.note}</p>
                {index < overviewCourse.ecosystem.length - 1 && <i aria-hidden="true">→</i>}
              </article>
            ))}
          </div>
          <p className="diagram-note">
            The agency is the bridge, not the decision-maker. The student chooses, the school decides admission,
            and immigration authorities decide immigration status.
          </p>
        </section>

        <section className="panel visual-board official-domain-board">
          <div className="section-heading">
            <div><span className="eyebrow">THE OFFICIAL CAPM MAP</span><h2>Definition first. Then the same case inside it.</h2></div>
            <span>Four official exam domains · 100%</span>
          </div>
          <div className="official-domain-grid">
            {overviewCourse.officialDomains.map((item, index) => (
              <article className={`official-domain domain-card-${index + 1}`} key={item.domain}>
                <header>
                  <span>{item.domain}</span>
                  <strong>{item.weight}</strong>
                </header>
                <h3>{item.title}</h3>
                <h4 lang="de">{item.de}</h4>
                <section className="domain-definition">
                  <span>OFFICIAL TASK SCOPE · PLAIN-LANGUAGE SUMMARY</span>
                  <p>{item.definition}</p>
                  <p lang="de">{item.definitionDe}</p>
                </section>
                <section className="domain-case">
                  <span>IN THIS CASE · IM BEISPIEL</span>
                  <p>{item.example}</p>
                  <p lang="de">{item.exampleDe}</p>
                </section>
                <footer><span>EVIDENCE</span><strong>{item.evidence}</strong></footer>
              </article>
            ))}
          </div>
          <p className="official-note">
            PMI defines a domain as a high-level knowledge area, then specifies tasks and illustrative
            enablers. The summaries above paraphrase those task scopes. They are exam-content domains,
            not chronological project phases.
          </p>
          <a
            className="official-source"
            href="https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/capm-exam-content-outline-english.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Source: PMI CAPM Examination Content Outline (2023 Exam Update) ↗
          </a>
        </section>

        <div className="overview-columns channel-funnel-layout">
          <section className="panel channel-board">
            <div className="section-heading">
              <div><span className="eyebrow">WHERE TO LOOK</span><h2>Test four paths to suitable students</h2></div>
            </div>
            <div className="channel-grid">
              {overviewCourse.channels.map((channel, index) => (
                <article key={channel.title}>
                  <span>0{index + 1}</span>
                  <strong>{channel.title}</strong>
                  <em lang="de">{channel.de}</em>
                  <b>{channel.strength}</b>
                  <p><small>SMALL TEST</small>{channel.test}</p>
                  <p><small>USEFUL SIGNAL</small>{channel.signal}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="panel funnel-board">
            <div className="section-heading">
              <div><span className="eyebrow">QUALITY FUNNEL</span><h2>Do not count every click as success</h2></div>
            </div>
            <p className="diagram-intro">Example from one small pilot. These numbers explain the logic; they are not a promise or forecast.</p>
            <div className="recruitment-funnel">
              {overviewCourse.funnel.map((stage, index) => (
                <article key={stage.label} style={{ width: `${100 - index * 9}%` }}>
                  <strong>{stage.value}</strong>
                  <span>{stage.label}</span>
                  <em lang="de">{stage.de}</em>
                  <p>{stage.note}</p>
                </article>
              ))}
            </div>
            <div className="funnel-result"><strong>4 ÷ 120 = 3.3%</strong><span>reached → enrolled</span></div>
          </section>
        </div>

        <section className="panel lens-board">
          <div className="section-heading">
            <div><span className="eyebrow">CAPM CONNECTION</span><h2>The same case seen through four questions</h2></div>
            <span>The domains work together</span>
          </div>
          <div className="lens-grid">
            {overviewCourse.lenses.map((lens, index) => (
              <article className={`domain-card-${index + 1}`} key={lens.domain}>
                <span>{lens.domain}</span><strong>{lens.title}</strong>
                <em lang="de">{lens.de}</em><p>{lens.body}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="overview-columns hybrid-layout">
          <section className="panel hybrid-board">
            <div className="section-heading">
              <div><span className="eyebrow">WHY HYBRID?</span><h2>Keep rules stable. Learn where evidence is missing.</h2></div>
            </div>
            <div className="hybrid-diagram">
              <article className="fixed-rail">
                <span>FIXED PATH · FESTER WEG</span><strong>Plan and control</strong>
                <ul>{overviewCourse.fixedAndLearning.fixed.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
              <div className="hybrid-bridge"><span>+</span><strong>HYBRID</strong></div>
              <article className="learning-loop">
                <span>LEARNING LOOP · LERNSCHLEIFE</span><strong>Test and adapt</strong>
                <ul>{overviewCourse.fixedAndLearning.learning.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            </div>
            <p className="hybrid-summary">{overviewCourse.fixedAndLearning.bridge}</p>
          </section>
          <section className="panel pilot-board">
            <div className="section-heading">
              <div><span className="eyebrow">8-WEEK PILOT</span><h2>What happens when</h2></div>
            </div>
            <div className="pilot-timeline">
              {overviewCourse.pilot.map((week) => (
                <article key={week.week}>
                  <span>{week.week}</span>
                  <div><strong>{week.title}</strong><em lang="de">{week.de}</em><p>{week.result}</p></div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="panel value-chain-board">
          <div className="section-heading">
            <div><span className="eyebrow">VALUE, NOT JUST ACTIVITY</span><h2>Follow the result all the way to the benefit</h2></div>
          </div>
          <div className="value-chain">
            {overviewCourse.valueChain.map((item, index) => (
              <article key={item.label}>
                <span>{item.label}</span><strong>{item.title}</strong><em lang="de">{item.de}</em>
                {index < overviewCourse.valueChain.length - 1 && <i>→</i>}
              </article>
            ))}
          </div>
          <p className="diagram-note">
            A webinar is an activity. A checklist is an output. A complete, informed application is an outcome.
            A better-fit enrollment is the benefit.
          </p>
        </section>

        <section className="panel anchor-board">
          <div className="section-heading">
            <div><span className="eyebrow">VOCABULARY BRIDGE</span><h2>Six words used in this case</h2></div>
            <span>English first · Deutsch daneben</span>
          </div>
          <div>
            {overviewCourse.anchors.map(([en, de, note]) => (
              <article key={en}><strong>{en}</strong><em lang="de">{de}</em><p>{note}</p></article>
            ))}
          </div>
        </section>

        <section className="study-finish panel">
          <div><span className="eyebrow">COURSE 1 CHECKPOINT</span><h2>Can you explain the whole path without CAPM jargon?</h2><p lang="de">Wenn du den gesamten Weg in einfachen Worten erklären kannst, bist du bereit für die vier Detailbereiche in Course 2.</p><small>{overviewCourse.source}</small></div>
          <div>
            <button className={`button ${completed ? "secondary" : "primary"}`} onClick={() => markUnitComplete(0)}>
              {completed ? "✓ Course 1 complete" : "Mark Course 1 complete"}
            </button>
            <button className="button secondary" onClick={() => { setSelectedStudyUnit(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Open Course 2</button>
          </div>
        </section>
      </>
    );
  }

  */
  function renderOverviewCourse() {
    const completed = progress.completedUnits.includes(0);
    const roadmap = [
      ["01", "⌂", "Understand school fit", "Schulpassung verstehen", "Learn the school, requirements, and goals."],
      ["02", "♙", "Define ideal students", "Ideale Lernende definieren", "Agree on fit criteria before recruiting."],
      ["03", "⌁", "Find channels", "Kontaktkanäle finden", "Identify where suitable students already are."],
      ["04", "⚗", "Test outreach", "Ansprache testen", "Run small tests and measure useful results."],
      ["05", "☑", "Support application", "Bewerbung begleiten", "Help students submit complete documents."],
      ["06", "◇", "Enroll and review", "Einschreiben und auswerten", "Review outcomes and improve the path."],
    ];
    const domainCards = [
      {
        id: "D1", weight: "36%", title: "Fundamentals", de: "Grundlagen",
        subtitle: "Understand the project and set it up for success.",
        subtitleDe: "Projektzweck, Beteiligte, Rollen und Risiken verstehen.",
        steps: [["◎", "Define purpose", "Zweck definieren"], ["♙", "Identify stakeholders", "Beteiligte bestimmen"], ["!", "Assess risks", "Risiken bewerten"], ["☑", "Set success criteria", "Erfolgskriterien setzen"]],
        caseEn: "Define the purpose, stakeholders, roles, benefits, and risks of recruiting suitable students for one partner school.",
        caseDe: "Zweck, Beteiligte, Rollen, Nutzen und Risiken der Vermittlung passender Lernender für eine Partnerschule klären.",
        evidence: ["Project charter", "Stakeholder register", "Risk register", "Benefit measures"],
      },
      {
        id: "D2", weight: "17%", title: "Plan-based work", de: "Planbasierte Arbeit",
        subtitle: "Plan stable work, dates, dependencies, and resources.",
        subtitleDe: "Stabile Arbeit, Termine, Abhängigkeiten und Ressourcen planen.",
        steps: [["▣", "Create intake schedule", "Aufnahmeplan erstellen"], ["☷", "List key tasks", "Aufgaben auflisten"], ["⚑", "Set milestones", "Meilensteine setzen"], ["♙", "Assign roles", "Rollen zuweisen"]],
        caseEn: "Plan the fixed school intake, document checks, application hand-offs, deadlines, and owners.",
        caseDe: "Aufnahmetermin, Dokumentenprüfung, Übergaben, Fristen und Verantwortliche planen.",
        evidence: ["WBS", "Schedule", "Milestone list", "RACI / resources"],
      },
      {
        id: "D3", weight: "20%", title: "Agile testing", de: "Agiles Testen",
        subtitle: "Adapt quickly, learn from evidence, and improve.",
        subtitleDe: "Schnell anpassen, aus Daten lernen und verbessern.",
        steps: [["⚗", "Choose 2 channels", "2 Kanäle wählen"], ["▶", "Run a 2-week test", "2 Wochen testen"], ["▥", "Review results", "Ergebnisse prüfen"], ["↻", "Adjust and continue", "Anpassen und fortsetzen"]],
        caseEn: "Test two student-acquisition channels for two weeks and compare qualified conversations rather than clicks.",
        caseDe: "Zwei Kanäle zur Studierendengewinnung zwei Wochen testen und passende Gespräche statt Klicks vergleichen.",
        evidence: ["Experiment backlog", "Test plan", "Results review", "Decision log"],
      },
      {
        id: "D4", weight: "27%", title: "Business analysis", de: "Business-Analyse",
        subtitle: "Understand needs and confirm the right solution.",
        subtitleDe: "Bedarf verstehen und die passende Lösung bestätigen.",
        steps: [["♙", "Define student profile", "Lernprofil definieren"], ["⌕", "Gather requirements", "Anforderungen erheben"], ["☷", "Validate school fit", "Schulpassung prüfen"], ["✓", "Recommend solution", "Lösung empfehlen"]],
        caseEn: "Define ideal-student criteria, trace them through consultation, and validate fit with the school.",
        caseDe: "Kriterien für passende Lernende definieren, in der Beratung nachverfolgen und mit der Schule validieren.",
        evidence: ["Requirement list", "Traceability matrix", "Fit analysis", "Outcome review"],
      },
    ];
    const journey = [
      {
        no: "01", phase: "Awareness", de: "Aufmerksamkeit",
        student: "Sees useful school information or hears a referral.",
        agency: "Runs channels and attracts relevant inquiries.",
        school: "Provides accurate public school information.",
      },
      {
        no: "02", phase: "Discovery", de: "Orientierung",
        student: "Explores the school, course, costs, and timing.",
        agency: "Explains options and screens basic needs.",
        school: "Shares programs, requirements, and capacity.",
      },
      {
        no: "03", phase: "Consultation", de: "Beratung",
        student: "Asks questions and explains study goals.",
        agency: "Checks fit and explains limits honestly.",
        school: "Answers admissions and course questions.",
      },
      {
        no: "04", phase: "Application", de: "Bewerbung",
        student: "Prepares and submits required documents.",
        agency: "Guides the checklist and hand-off.",
        school: "Reviews the application under its own rules.",
      },
      {
        no: "05", phase: "Decision & immigration", de: "Entscheidung und Einreiseverfahren",
        student: "Receives results and completes required procedures.",
        agency: "Shares status without promising approval.",
        school: "Makes its admission decision and may support COE procedures.",
      },
      {
        no: "06", phase: "Enrollment", de: "Einschreibung",
        student: "Pays applicable fees and prepares to start.",
        agency: "Provides agreed pre-departure support.",
        school: "Welcomes and orients the enrolled learner.",
      },
    ];
    const channels = [
      ["♙", "Alumni referrals", "Empfehlungen", "$", "★★★", "★★★★★"],
      ["◇", "Local partners", "Lokale Partner", "$$", "★★", "★★★★"],
      ["▣", "Webinars", "Webinare", "$", "★★★", "★★★★"],
      ["♡", "Social media ads", "Social-Media-Anzeigen", "$$$", "★★★★", "★★"],
    ];
    const actionPlan = [
      ["01", "♙", "Discover and align", "Verstehen und abstimmen", ["School information", "Past inquiries"], "Shared goals", "Stakeholder map"],
      ["02", "◎", "Define ideal students", "Passende Lernende definieren", ["School goals", "Interview findings"], "Student-fit criteria", "Fit profile"],
      ["03", "⌁", "Test channels", "Kanäle testen", ["Channel list", "Small budget"], "Two test channels", "Channel test plan"],
      ["04", "☏", "Qualify and consult", "Prüfen und beraten", ["Consultation guide", "School fact pack"], "Qualified conversations", "Consultation record"],
      ["05", "☑", "Guide the application", "Bewerbung begleiten", ["Document checklist", "Application steps"], "Complete applications", "Application tracker"],
      ["06", "▥", "Review and improve", "Auswerten und verbessern", ["Results data", "Stakeholder feedback"], "Next-channel decision", "Review log"],
    ];

    return (
      <>
        <button className="back-button" onClick={() => setSelectedStudyUnit(null)}>← Back to courses</button>

        <header className="panel ref-course-hero">
          <div className="ref-hero-copy">
            <span className="eyebrow">COURSE 1 · START HERE</span>
            <h1>How an agency finds the right international students for one Japanese language school</h1>
            <h2 lang="de">Wie eine Agentur passende internationale Lernende für eine japanische Sprachschule findet</h2>
            <p>One real case, shown step by step—from first contact to enrollment and review.</p>
            <p lang="de">Ein durchgängiges Beispiel, Schritt für Schritt: vom ersten Kontakt bis zur Einschreibung und Auswertung.</p>
            <div className="ref-hero-chips">
              {[["♙", "1 school partner", "Eine Partnerschule"], ["⊙", "International students", "Internationale Lernende"], ["⌁", "Data-informed", "Datengestützt"], ["✓", "Repeatable path", "Wiederholbarer Weg"]].map(([icon, en, de]) => (
                <article key={en}><span>{icon}</span><div><strong>{en}</strong><em lang="de">{de}</em></div></article>
              ))}
            </div>
          </div>
          <div className="ref-status-stack">
            <article className="status-pink"><span>⌂</span><div><small>ALREADY HAVE</small><strong>1 Japanese language school partner</strong><em lang="de">Eine bestehende Partnerschule</em></div></article>
            <article className="status-blue"><span>?</span><div><small>UNKNOWN</small><strong>Which students and channels fit</strong><em lang="de">Welche Lernenden und Kanäle passen</em></div></article>
            <article className="status-green"><span>◎</span><div><small>GOAL</small><strong>A repeatable student recruitment path</strong><em lang="de">Ein wiederholbarer Vermittlungsweg</em></div></article>
          </div>
        </header>

        <section className="panel ref-roadmap-board">
          <span className="eyebrow">6-PHASE CASE ROADMAP</span>
          <div className="ref-roadmap">
            {roadmap.map(([no, icon, title, de, note], index) => (
              <article key={no}>
                <b>{no}</b><span>{icon}</span><strong>{title}</strong><em lang="de">{de}</em><p>{note}</p>
                {index < roadmap.length - 1 && <i>→</i>}
              </article>
            ))}
          </div>
          <p className="ref-disclaimer"><strong>Case roadmap:</strong> These six steps organize this example. They are not official CAPM domains or a universal project life cycle.</p>
        </section>

        <section className="panel ref-domain-board">
          <div className="ref-section-head">
            <div><span className="eyebrow">WHAT YOU LEARN IN THIS COURSE</span><h2>4 CAPM domains, one easy case</h2><p lang="de">Vier CAPM-Domänen, verbunden in einem leicht verständlichen Beispiel.</p></div>
            <aside><strong>i</strong><span>Percentages are exam weights, not a phase order.<em lang="de">Die Prozentwerte sind Prüfungsanteile, keine Reihenfolge.</em></span></aside>
          </div>
          <div className="ref-domain-grid">
            {domainCards.map((domain, domainIndex) => (
              <article className={`ref-domain ref-domain-${domainIndex + 1}`} key={domain.id}>
                <header><b>{domain.id}</b><div><h3>{domain.title}</h3><h4 lang="de">{domain.de}</h4><p>{domain.subtitle}</p><p lang="de">{domain.subtitleDe}</p></div><strong>{domain.weight}<small>exam weight</small></strong></header>
                <div className="ref-domain-flow">
                  {domain.steps.map(([icon, en, de], index) => (
                    <div key={en}><span>{icon}</span><strong>{en}</strong><em lang="de">{de}</em>{index < domain.steps.length - 1 && <i>→</i>}</div>
                  ))}
                </div>
                <p className="ref-case"><strong>In this case:</strong> {domain.caseEn}<em lang="de">{domain.caseDe}</em></p>
                <footer><span>Evidence</span>{domain.evidence.map((item) => <strong key={item}>{item}</strong>)}</footer>
              </article>
            ))}
          </div>
          <p className="ref-domain-note">These are CAPM exam-content knowledge domains, not chronological project phases. <span lang="de">Dies sind Wissensbereiche der Prüfung, keine zeitliche Projektabfolge.</span></p>
        </section>

        <section className="panel ref-journey-board">
          <div className="ref-section-title"><b>1</b><div><span className="eyebrow">ONE CASE, STEP BY STEP</span><h2>From first contact to school enrollment</h2><p lang="de">Vom ersten Kontakt bis zur Einschreibung an der Sprachschule</p></div></div>
          <div className="ref-journey-scroll">
            <div className="ref-journey-grid">
              <div className="ref-journey-head-label">6 phases</div>
              {journey.map((item) => <header key={item.no}><b>{item.no}</b><strong>{item.phase}</strong><em lang="de">{item.de}</em></header>)}
              {[
                ["♙", "Student", "Lernende Person", "student"],
                ["♙", "Agency", "Agentur", "agency"],
                ["⌂", "Language school", "Sprachschule", "school"],
              ].map(([icon, title, de, field]) => (
                <div className="ref-journey-row" key={field}>
                  <aside><span>{icon}</span><strong>{title}</strong><em lang="de">{de}</em></aside>
                  {journey.map((item) => <article key={item.no}><p>{item[field as "student" | "agency" | "school"]}</p></article>)}
                </div>
              ))}
            </div>
          </div>
          <p className="ref-legal-note">The school decides admission. Japan’s immigration authority issues a Certificate of Eligibility (COE); a school or another eligible proxy in Japan may support the application. A COE does not guarantee a visa.</p>
        </section>

        <div className="ref-two-column">
          <section className="panel ref-funnel-board">
            <div className="ref-section-title"><b>2</b><div><span className="eyebrow">HOW INQUIRIES NARROW DOWN</span><h2>A quality funnel</h2></div></div>
            <div className="ref-funnel">
              {[["♙", "Many inquiries", "Viele Anfragen", "100%"], ["☏", "Qualified consultations", "Passende Beratungen", "30–40%"], ["▣", "Complete applications", "Vollständige Bewerbungen", "10–15%"], ["✓", "Accepted students", "Aufgenommene Lernende", "6–10%"], ["◇", "Enrolled learners", "Eingeschriebene Lernende", "5–8%"]].map(([icon, en, de, rate]) => (
                <article key={en}><span>{icon}</span><strong>{en}</strong><em lang="de">{de}</em><b>{rate}</b></article>
              ))}
            </div>
            <p className="ref-disclaimer">Illustrative conversion ranges only. Actual results vary by school, country, channel, intake, and applicant requirements.</p>
          </section>
          <section className="panel ref-channel-board">
            <div className="ref-section-title"><b>3</b><div><span className="eyebrow">CHANNEL COMPARISON</span><h2>Compare before scaling</h2></div></div>
            <div className="ref-channel-grid">
              {channels.map(([icon, en, de, cost, speed, fit]) => (
                <article key={en}><span>{icon}</span><strong>{en}</strong><em lang="de">{de}</em><dl><div><dt>Cost</dt><dd>{cost}</dd></div><div><dt>Speed</dt><dd>{speed}</dd></div><div><dt>Fit quality</dt><dd>{fit}</dd></div></dl></article>
              ))}
            </div>
            <p className="ref-disclaimer">Ratings are hypotheses for the pilot—not general facts. Validate them with your own data.</p>
          </section>
        </div>

        <section className="panel ref-experiment-board">
          <div className="ref-section-title"><b>4</b><div><span className="eyebrow">TWO-WEEK EXPERIMENT BOARD</span><h2>Measure conversations that move students forward</h2><p lang="de">Beratungsgespräche messen, die Lernende wirklich weiterbringen</p></div></div>
          <div className="ref-experiment-layout">
            <div className="ref-experiment-table">
              <div className="table-head"><span>Channel</span><span>Week 1</span><span>Week 2</span><span>Qualified conversations</span><span>Decision</span></div>
              <div><strong>A · Webinars</strong><span>150 attendees</span><span>160 attendees</span><b>28</b><em>Continue</em></div>
              <div><strong>B · Social media ads</strong><span>12,000 reach</span><span>13,500 reach</span><b>14</b><em>Improve or stop</em></div>
            </div>
            <div className="ref-principles">
              <article><span>◇</span><strong>Agency is the bridge, not the final decision-maker.</strong><em lang="de">Die Agentur begleitet; Schule und Behörden treffen ihre eigenen Entscheidungen.</em></article>
              <article><span>↗</span><strong>Start small, learn fast, and improve every week.</strong><em lang="de">Klein beginnen, schnell lernen und wöchentlich verbessern.</em></article>
            </div>
          </div>
          <p className="ref-disclaimer">All experiment numbers are fictional teaching data.</p>
        </section>

        <section className="panel ref-situation-board">
          <div className="ref-section-title"><b>5</b><div><span className="eyebrow">CURRENT SITUATION</span><h2>Know what is fixed and what is still unknown</h2><p lang="de">Feststehende Informationen und offene Fragen trennen</p></div></div>
          <div className="ref-situation-grid">
            <article className="known-card"><strong>✓ We already know</strong><ul><li>One partner school exists.</li><li>School courses, fees, dates, and requirements can be confirmed.</li><li>The goal is a reliable path from inquiry to enrollment.</li></ul></article>
            <article className="unknown-card"><strong>? We do not know yet</strong><ul><li>Which countries and channels bring suitable students.</li><li>Which student profile best fits the school.</li><li>Where suitable students leave the process.</li></ul></article>
            <article className="persona-card"><strong>Student persona example</strong><b>Vietnam · age 22</b><p>Wants an affordable course, a clear application process, and a schedule that fits the stated study goal.</p><small>Example only—not a rule for nationality or age.</small></article>
            <article className="checklist-card"><strong>School-fit checklist</strong><ul><li>Course and level fit</li><li>Start-date fit</li><li>Tuition and budget understood</li><li>Application requirements understood</li><li>Location and support needs</li></ul></article>
            <article className="matrix-card"><strong>Channel test matrix</strong><div><b>Channel</b><b>Reach</b><b>Fit</b><b>Cost</b></div>{[["Webinar","●●●○","●●●●","●○○○"],["Partners","●●○○","●●●●","●●○○"],["Social ads","●●●●","●●○○","●●●○"]].map((row)=><div key={row[0]}>{row.map((cell)=><span key={cell}>{cell}</span>)}</div>)}</article>
          </div>
        </section>

        <section className="panel ref-action-board">
          <div className="ref-section-title"><b>6</b><div><span className="eyebrow">PHASE-BY-PHASE ACTION PLAN</span><h2>Inputs become outputs and reusable deliverables</h2><p lang="de">Aus Eingaben werden Ergebnisse und wiederverwendbare Liefergegenstände</p></div></div>
          <div className="ref-action-grid">
            {actionPlan.map(([no, icon, title, de, inputs, output, deliverable]) => (
              <article key={String(no)}><header><b>{no}</b><span>{icon as string}</span><strong>{title as string}</strong><em lang="de">{de as string}</em></header><small>INPUTS</small><ul>{(inputs as string[]).map((item)=><li key={item}>{item}</li>)}</ul><small>OUTPUT</small><p>{output as string}</p><footer><span>DELIVERABLE</span><strong>{deliverable as string}</strong></footer></article>
            ))}
          </div>
        </section>

        <div className="ref-two-column ref-metrics-layout">
          <section className="panel ref-metrics-board">
            <div className="ref-section-title"><b>7</b><div><span className="eyebrow">METRICS THAT MATTER</span><h2>Measure movement, not noise</h2></div></div>
            <div className="ref-metrics-grid">
              {[["☏","Inquiries","Anfragen","320"],["♙","Qualified consultations","Passende Beratungen","96"],["☑","Application completion","Vollständige Bewerbungen","68%"],["✓","Acceptance rate","Aufnahmequote","82%"],["◇","Enrollment rate","Einschreibequote","41%"]].map(([icon,en,de,value])=><article key={en}><span>{icon}</span><strong>{en}</strong><em lang="de">{de}</em><b>{value}</b></article>)}
            </div>
            <p className="ref-disclaimer">Fictional example metrics. Define the denominator and reporting period before comparing rates.</p>
          </section>
          <section className="panel ref-next-board">
            <div className="ref-section-title"><b>8</b><div><span className="eyebrow">NEXT EXPERIMENT</span><h2>Decide with evidence</h2></div></div>
            <div className="ref-kanban">
              <article><strong>TO TEST</strong><span>YouTube information session · Vietnamese</span><span>Partner webinar co-host</span></article>
              <article><strong>RUNNING</strong><span>Student testimonial video</span><span>School-life webinar</span></article>
              <article><strong>LEARNED</strong><span>Broad ads were too costly</span><span>The first brochure was too long</span></article>
            </div>
          </section>
        </div>

        <section className="study-finish panel">
          <div><span className="eyebrow">COURSE 1 CHECKPOINT</span><h2>Explain the case and the four domains separately.</h2><p lang="de">Erkläre zuerst den Fallablauf und danach die vier CAPM-Domänen als getrennte Wissensbereiche.</p><small>CAPM domain content: PMI ECO 2023 · Agency and conversion data: illustrative teaching case</small></div>
          <div>
            <button className={`button ${completed ? "secondary" : "primary"}`} onClick={() => markUnitComplete(0)}>{completed ? "✓ Course 1 complete" : "Mark Course 1 complete"}</button>
            <button className="button secondary" onClick={() => { setSelectedStudyUnit(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Open Course 2</button>
          </div>
        </section>
      </>
    );
  }

  function renderLearn() {
    if (selectedStudyUnit === 0) return renderOverviewCourse();
    if (selectedStudyUnit) {
      const guide = studyGuides.find((item) => item.unit === selectedStudyUnit);
      const unit = units.find((item) => item.id === selectedStudyUnit);
      if (!guide || !unit) return null;
      const completed = progress.completedUnits.includes(unit.id);
      return (
        <>
          <button className="back-button" onClick={() => setSelectedStudyUnit(null)}>← All domains</button>
          <header className={`study-hero panel domain-bg-${unit.id}`}>
            <div>
              <span className="eyebrow">DOMAIN {unit.id} · {unit.weight}%</span>
              <h1>{guide.title}</h1>
              <h2 lang="de">{guide.titleDe}</h2>
              <p>{guide.lead}</p>
              <p className="de-copy" lang="de">{guide.leadDe}</p>
            </div>
            <div className="study-stamp"><strong>{unit.weight}%</strong><span>exam weight</span></div>
          </header>

          <section className="panel visual-board">
            <div className="section-heading">
              <div><span className="eyebrow">VISUAL 01</span><h2>{guide.primaryTitle}</h2></div>
              <span>Read left to right</span>
            </div>
            <div className={`node-flow nodes-${guide.primaryNodes.length}`}>
              {guide.primaryNodes.map((node, index) => (
                <div className="flow-node" key={node.title}>
                  <span>{node.label}</span><strong>{node.title}</strong>
                  <em lang="de">{node.de}</em><small>{node.note}</small>
                  {index < guide.primaryNodes.length - 1 && <i>→</i>}
                </div>
              ))}
            </div>
          </section>

          <div className="study-two-column">
            <section className="panel visual-board secondary-visual">
              <div className="section-heading">
                <div><span className="eyebrow">VISUAL 02</span><h2>{guide.secondaryTitle}</h2></div>
              </div>
              <div className={`node-flow compact-flow nodes-${guide.secondaryNodes.length}`}>
                {guide.secondaryNodes.map((node, index) => (
                  <div className="flow-node" key={node.title}>
                    <span>{node.label}</span><strong>{node.title}</strong>
                    <em lang="de">{node.de}</em><small>{node.note}</small>
                    {index < guide.secondaryNodes.length - 1 && <i>→</i>}
                  </div>
                ))}
              </div>
            </section>
            <section className="insight-stack">
              {guide.insights.map((insight, index) => (
                <article className="panel insight-card" key={insight.title}>
                  <span>0{index + 1}</span>
                  <div><h3>{insight.title}</h3><h4 lang="de">{insight.de}</h4><p>{insight.body}</p></div>
                </article>
              ))}
            </section>
          </div>

          {guide.formulas && (
            <section className="panel formula-lab">
              <div className="section-heading">
                <div><span className="eyebrow">VISUAL 03</span><h2>Earned value mini-lab</h2></div>
                <span>EV = earned · AC = actual · PV = planned</span>
              </div>
              <div className="formula-cards">
                {guide.formulas.map((formula) => (
                  <article key={formula.label}><span>{formula.label}</span><strong>{formula.formula}</strong><p>{formula.meaning}</p></article>
                ))}
              </div>
            </section>
          )}

          <section className="panel term-wall">
            <div className="section-heading">
              <div><span className="eyebrow">BILINGUAL MEMORY WALL</span><h2>English terms · deutsche Anker</h2></div>
              <span>{guide.source}</span>
            </div>
            <div>
              {guide.terms.map((term) => (
                <article key={term.en}><strong>{term.en}</strong><em lang="de">{term.de}</em><p>{term.note}</p></article>
              ))}
            </div>
          </section>

          <section className="study-finish panel">
            <div><span className="eyebrow">LOCK IT IN</span><h2>Use the picture, then test the decision.</h2><p lang="de">Markiere den Lernblock und übe danach nur Fragen aus diesem Bereich.</p></div>
            <div>
              <button className={`button ${completed ? "secondary" : "primary"}`} onClick={() => markUnitComplete(unit.id)}>
                {completed ? "✓ Marked complete" : "Mark guide complete"}
              </button>
              <button className="button secondary" onClick={() => beginPractice(unit.id)}>Practice Domain {unit.id}</button>
            </div>
          </section>
        </>
      );
    }

    return (
      <>
        <header className="page-head">
          <span className="eyebrow">STUDY GUIDES · LERNKARTEN</span>
          <h1>First connect it. Then zoom in.</h1>
          <p>Course 1 builds one domain-crossing mental model. Course 2 turns each CAPM domain into detailed diagrams, decision cues, formulas, and exam-ready terms.</p>
        </header>
        <section className="course-one-card panel">
          <div className="course-number"><span>COURSE</span><strong>01</strong></div>
          <div className="course-one-copy">
            <span className="eyebrow">START WITH THE WHOLE</span>
            <h2>{overviewCourse.title}</h2>
            <h3 lang="de">{overviewCourse.titleDe}</h3>
            <p>{overviewCourse.lead}</p>
            <div className="course-route">{overviewCourse.officialDomains.map((item) => <span key={item.domain}>{item.domain} · {item.weight}</span>)}</div>
          </div>
          <div className="course-one-action">
            <strong>{progress.completedUnits.includes(0) ? "✓ Complete" : "35 min"}</strong>
            <button className="button primary" onClick={() => openStudy(0)}>Open Course 1</button>
          </div>
        </section>
        <div className="course-two-head">
          <div><span>COURSE 02</span><h2>Detailed domain course</h2><p lang="de">Vier Module für Begriffe, Zusammenhänge, Formeln und Anwendung.</p></div>
          <strong>4 modules · 48 practice questions</strong>
        </div>
        <div className="study-grid">
          {units.map((unit) => {
            const complete = progress.completedUnits.includes(unit.id);
            return (
              <button className={`study-card panel domain-card-${unit.id}`} key={unit.id} onClick={() => openStudy(unit.id)}>
                <div className="study-card-top"><span>DOMAIN {unit.id}</span><strong>{unit.weight}%</strong></div>
                <div className="mini-diagram"><i /><i /><i /><i /></div>
                <h2>{unit.title}</h2>
                <h3 lang="de">{unit.titleDe}</h3>
                <div className="chips">{unit.keywords.slice(0, 4).map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
                <footer><span>{unit.duration} visual study</span><strong>{complete ? "✓ Complete" : "Open guide →"}</strong></footer>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  function renderPractice() {
    const changeUnit = (value: number | "all") => beginPractice(value);
    if (!practiceQuestion) {
      const nextDue = practicePool
        .map((question) => getAnswerStats(progress.answered[question.id]).nextReviewAt)
        .filter((value): value is string => Boolean(value))
        .sort()[0];
      return (
        <>
          <header className="page-head"><span className="eyebrow">PRACTICE</span><h1>Nothing is due right now.</h1><p>Next scheduled review: {formatDate(nextDue)}</p></header>
          <section className="empty panel"><span>♡</span><h2>Spacing is part of learning.</h2><p lang="de">Bereits richtige Fragen erscheinen erst wieder, wenn ihr Wiederholungsdatum erreicht ist.</p><button className="button primary" onClick={() => setView("learn")}>Study a visual guide</button></section>
        </>
      );
    }
    const answerCorrect = sameAnswer(practiceSelected, practiceQuestion.correct);
    const previous = progress.answered[practiceQuestion.id];
    const stats = getAnswerStats(previous);
    const history = previous?.attempts?.slice(-8).reverse() || [];
    const baseRecord =
      previous && practiceAttemptAt
        ? { ...previous, attempts: previous.attempts.filter((attempt) => attempt.at !== practiceAttemptAt) }
        : previous;
    const confidenceOptions: { value: Confidence; en: string; de: string }[] = [
      { value: "low", en: "Unsure", de: "Sehr unsicher" },
      { value: "medium", en: "Thought it through", de: "Kurz überlegt" },
      { value: "high", en: "Instant answer", de: "Sofort gewusst" },
    ];
    return (
      <>
        <header className="page-head practice-head">
          <div><span className="eyebrow">PRACTICE · ÜBEN</span><h1>Decide in English.</h1><p lang="de">Die Erklärung erscheint nach der Antwort auf Deutsch.</p></div>
          <label className="select-label">Domain
            <select value={practiceUnit} onChange={(event) => changeUnit(event.target.value === "all" ? "all" : Number(event.target.value))}>
              <option value="all">All domains</option>
              {units.map((unit) => <option value={unit.id} key={unit.id}>Domain {unit.id}</option>)}
            </select>
          </label>
        </header>
        <section className="question-card panel">
          <div className="question-meta">
            <div><span className={`kind ${practiceQuestion.kind}`}>{practiceQuestion.kind}</span><span>{practiceQuestion.id}</span><span>{practiceQuestion.eo}</span></div>
            <button
              className={progress.bookmarks.includes(practiceQuestion.id) ? "bookmarked" : ""}
              aria-label="Bookmark question"
              onClick={() => setProgress((current) => ({
                ...current,
                bookmarks: current.bookmarks.includes(practiceQuestion.id)
                  ? current.bookmarks.filter((id) => id !== practiceQuestion.id)
                  : [...current.bookmarks, practiceQuestion.id],
              }))}
            >♡</button>
          </div>
          <h2>{practiceQuestion.prompt}</h2>
          {practiceQuestion.kind === "multiple" && <p className="instruction">Select {practiceQuestion.correct.length} answers.</p>}
          <ChoiceList question={practiceQuestion} selected={practiceSelected} onChange={setPracticeSelected} disabled={practiceChecked} reveal={practiceChecked} />
          {!practiceChecked ? (
            <button className="button primary full" disabled={!practiceSelected.length} onClick={() => setPracticeChecked(true)}>Check answer</button>
          ) : (
            <div className={`feedback ${answerCorrect ? "correct" : "incorrect"}`}>
              <div className="feedback-title"><span>{answerCorrect ? "✓" : "↻"}</span><div><strong>{answerCorrect ? "Correct" : "Not quite"}</strong><em lang="de">{answerCorrect ? "Richtig" : "Noch nicht"}</em></div></div>
              <p lang="de">{practiceQuestion.explanationDe}</p>
              <div className="feedback-meta"><span>{practiceQuestion.keyword}</span><span>{practiceQuestion.source}</span></div>
              <BeginnerQuestions question={practiceQuestion} />
              <div className="confidence-box">
                <div><strong>How sure were you?</strong><span lang="de">Wie sicher warst du?</span></div>
                <div className="confidence-options">
                  {confidenceOptions.map((option) => {
                    const schedule = calculateNextReview(baseRecord, answerCorrect, option.value);
                    return (
                      <button
                        key={option.value}
                        className={practiceConfidence === option.value ? "selected" : ""}
                        onClick={() => recordAnswer(option.value)}
                      >
                        <strong>{option.en}</strong><span lang="de">{option.de}</span><em>review in {schedule.intervalDays}d</em>
                      </button>
                    );
                  })}
                </div>
              </div>
              <details className="schedule-details">
                <summary>Why this review date? · Warum dieses Datum?</summary>
                <p>First correct: unsure 1d · thought it through 2d · instant 5d.</p>
                <p>Later correct: max(previous + 1d, rounded previous × 1.2 / 2.5 / 3.25). Incorrect answers use 0.25 / 0.15 / 0.05 with a 1-day minimum.</p>
              </details>
              {practiceConfidence && <button className="button primary" onClick={nextPractice}>Next question →</button>}
            </div>
          )}
          <div className="history-strip">
            <span><small>Attempts</small><strong>{stats.attempts}</strong></span>
            <span><small>Correct</small><strong>{stats.correctCount}</strong></span>
            <span><small>Streak</small><strong>{stats.consecutiveCorrect}</strong></span>
            <span><small>Next review</small><strong>{stats.nextReviewAt ? formatDate(stats.nextReviewAt) : "—"}</strong></span>
          </div>
          {history.length > 0 && (
            <details className="answer-history">
              <summary>Answer history · Antwortverlauf</summary>
              {history.map((attempt) => (
                <div key={attempt.at}><strong className={attempt.correct ? "history-correct" : "history-wrong"}>{attempt.correct ? "Correct" : "Incorrect"}</strong><span>{attempt.confidence || "mock"}</span><time>{formatDate(attempt.at)}</time><em>{attempt.intervalDays ? `${attempt.intervalDays}d` : "—"}</em></div>
              ))}
            </details>
          )}
        </section>
      </>
    );
  }

  function renderExam() {
    if (examResult) {
      return (
        <section className="result-card panel">
          <span className="eyebrow">FOCUSED MOCK COMPLETE</span>
          <div className="result-score">{examResult.percent}%</div>
          <h1>{examResult.percent >= 70 ? "Strong practice signal." : "Your review queue is ready."}</h1>
          <p>{examResult.correct} / {examResult.total} exact answers</p>
          <p lang="de">70% ist nur ein interner Lernzielwert. PMI veröffentlicht keine feste CAPM-Bestehensgrenze.</p>
          <div><button className="button primary" onClick={() => { setExamResult(null); setView("review"); }}>Review mistakes</button><button className="button secondary" onClick={startExam}>New mock</button></div>
        </section>
      );
    }
    if (!exam || !currentExamQuestion) {
      return (
        <>
          <header className="page-head"><span className="eyebrow">MOCK EXAM · PROBEPRÜFUNG</span><h1>A focused, weighted rehearsal.</h1><p>English questions, no hints, domain mix based on the official ECO proportions.</p></header>
          <section className="exam-intro panel">
            <div className="exam-visual">
              <div><span>official exam</span><strong>150</strong><small>questions · 180 minutes</small></div>
              <i>→</i>
              <div><span>this focused mock</span><strong>{MOCK_EXAM_SIZE}</strong><small>questions · {MOCK_DURATION_MINUTES} minutes</small></div>
            </div>
            <div className="exam-copy"><h2>Practice the pace without copying the exam.</h2><p>Questions are independently written. Explanations stay hidden until submission. The mock uses 11 / 5 / 6 / 8 questions across Domains 1–4.</p><p lang="de">Die echte CAPM-Prüfung enthält zusätzlich verschiedene interaktive Fragetypen. Diese Übung konzentriert sich auf Wissensentscheidungen.</p><button className="button primary" onClick={startExam}>Begin focused mock</button></div>
          </section>
        </>
      );
    }
    const selected = exam.answers[currentExamQuestion.id] || [];
    return (
      <>
        <header className="exam-bar panel">
          <div><span>FOCUSED MOCK</span><strong>Question {exam.index + 1} / {MOCK_EXAM_SIZE}</strong></div>
          <div className={secondsLeft < 180 ? "urgent" : ""}><span>Time remaining</span><strong>{formatTimer(secondsLeft)}</strong></div>
        </header>
        <div className="exam-layout">
          <section className="question-card panel">
            <div className="question-meta"><div><span className={`kind ${currentExamQuestion.kind}`}>{currentExamQuestion.kind}</span><span>Domain {currentExamQuestion.unit}</span></div></div>
            <h2>{currentExamQuestion.prompt}</h2>
            {currentExamQuestion.kind === "multiple" && <p className="instruction">Select {currentExamQuestion.correct.length} answers.</p>}
            <ChoiceList question={currentExamQuestion} selected={selected} onChange={(value) => setExam((current) => current ? { ...current, answers: { ...current.answers, [currentExamQuestion.id]: value } } : current)} />
            <div className="exam-actions">
              <button className="button secondary" disabled={exam.index === 0} onClick={() => setExam((current) => current ? { ...current, index: current.index - 1 } : current)}>← Previous</button>
              {exam.index < MOCK_EXAM_SIZE - 1 ? (
                <button className="button primary" onClick={() => setExam((current) => current ? { ...current, index: current.index + 1 } : current)}>Next →</button>
              ) : (
                <button className="button danger" onClick={() => submitExam(exam)}>Submit mock</button>
              )}
            </div>
          </section>
          <aside className="panel question-map">
            <div><strong>Question map</strong><span>{Object.values(exam.answers).filter((answer) => answer.length).length} answered</span></div>
            <div>{examQuestions.map((question, index) => <button key={question.id} className={`${index === exam.index ? "current" : ""} ${exam.answers[question.id]?.length ? "answered" : ""}`} onClick={() => setExam((current) => current ? { ...current, index } : current)}>{index + 1}</button>)}</div>
            <button className="button danger full" onClick={() => submitExam(exam)}>Submit mock</button>
          </aside>
        </div>
      </>
    );
  }

  function renderReview() {
    const reviewQuestions = progress.review
      .map((id) => questions.find((question) => question.id === id))
      .filter((question): question is Question => Boolean(question));
    return (
      <>
        <header className="page-head"><span className="eyebrow">REVIEW · WIEDERHOLEN</span><h1>Turn misses into memory.</h1><p>Questions leave this queue after two consecutive correct answers or when you mark them mastered.</p></header>
        {!reviewQuestions.length ? (
          <section className="empty panel"><span>♡</span><h2>Your review queue is clear.</h2><p lang="de">Falsche Antworten aus Übung und Probeprüfung erscheinen hier.</p><button className="button primary" onClick={() => beginPractice("all")}>Practice now</button></section>
        ) : (
          <div className="review-list">
            {reviewQuestions.map((question) => {
              const record = progress.answered[question.id];
              const stats = getAnswerStats(record);
              return (
                <article className="review-card panel" key={question.id}>
                  <div><span>DOMAIN {question.unit}</span><span>{question.id}</span><span>{stats.consecutiveCorrect}/2 streak</span></div>
                  <h2>{question.prompt}</h2>
                  <p className="correct-line"><strong>Correct:</strong> {question.correct.map((index) => question.options[index]).join(" · ")}</p>
                  <p lang="de">{question.explanationDe}</p>
                  <BeginnerQuestions question={question} />
                  <footer><span>{question.keyword} · next {formatDate(stats.nextReviewAt)}</span><div><button className="button compact secondary" onClick={() => beginPractice(question.unit)}>Practice domain</button><button className="text-button" onClick={() => setProgress((current) => ({ ...current, review: current.review.filter((id) => id !== question.id) }))}>Mark mastered</button></div></footer>
                </article>
              );
            })}
          </div>
        )}
      </>
    );
  }

  function renderSources() {
    return (
      <>
        <header className="page-head"><span className="eyebrow">SOURCES & DATA · QUELLEN & DATEN</span><h1>Traceable, original, easy to share.</h1><p>Official PMI pages define the scope. All diagrams, questions, and explanations here are independently authored.</p></header>
        <section className="source-coverage panel">
          <article><span>01 · FREE OFFICIAL</span><strong>Exam structure</strong><p>Current CAPM page, public ECO, domain weights, tasks, enablers, exam format, and PMI ethics.</p></article>
          <article><span>02 · FREE SUPPORTING</span><strong>Open foundations</strong><p>Official Scrum Guide, Agile Manifesto, and public PMI standards overviews support the learning explanations.</p></article>
          <article><span>03 · CLOSED / NOT COPIED</span><strong>Licensed depth</strong><p>PMBOK full text, paid courses, Study Hall, and official questions are not reproduced or claimed as sources.</p></article>
        </section>
        <section className="source-grid">
          {sources.map((source) => (
            <a className="source-card panel" href={source.url} target="_blank" rel="noreferrer" key={source.id}>
              <span>{source.publisher}</span><h2>{source.title}</h2><p>{source.version}</p><small>{source.chapter}</small><strong>↗</strong>
            </a>
          ))}
        </section>
        <div className="policy-grid">
          <section className="panel policy-card">
            <span className="eyebrow">CONTENT & COPYRIGHT</span>
            <h2>Original learning graphics</h2>
            <p>Visuals use original SVG icons plus HTML and CSS shapes created for this site. No official questions, book pages, tables, stock illustrations, or proprietary figures are reproduced.</p>
            <p lang="de">Die Lernbilder sind eigens erstellt. Offizielle Prüfungsfragen und geschützte Abbildungen werden nicht kopiert.</p>
          </section>
          <section className="panel policy-card sync-data-card">
            <span className="eyebrow">SHARED PROGRESS</span>
            <h2>No ChatGPT login</h2>
            <p>The default CAPM URL loads and updates one shared cloud record on every device. No special query link is required. The device cache is only a fast offline fallback.</p>
            <p lang="de">Der Standardlink verbindet alle Geräte automatisch mit demselben Lernstand. Kein ChatGPT-Konto erforderlich.</p>
            <div className={`sync-state ${syncStatus}`}><i />{syncLabel()}</div>
            <div><button className="button secondary" onClick={() => void pullCloud(false)}>Refresh now</button></div>
          </section>
        </div>
        <section className="panel disclaimer">
          <strong>Unofficial study tool</strong>
          <p>CAPM®, PMI®, and PMBOK® are marks of Project Management Institute, Inc. This site is not endorsed by PMI and does not predict an official exam result. Always confirm current exam details on PMI.org.</p>
        </section>
      </>
    );
  }

  if (!hydrated) {
    return <main className="loading"><span>CAPM</span><strong>English × Deutsch</strong><div /></main>;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setView("home")}>
          <span>CP</span><div><strong>CAPM</strong><small>English × Deutsch</small></div>
        </button>
        <nav aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={view === item.id ? "active" : ""}
              onClick={() => item.id === "practice" ? beginPractice("all") : setView(item.id)}
            >
              <i>{item.icon}</i><span><strong>{item.label}</strong><small>{item.de}</small></span>
              {item.id === "review" && progress.review.length > 0 && <em>{progress.review.length}</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <button onClick={() => setView("sources")}>Sources, data & copyright</button>
          <small>v{APP_VERSION} · cloud sync + offline fallback</small>
        </div>
      </aside>
      <main className="main-content">
        {view === "home" && renderHome()}
        {view === "learn" && renderLearn()}
        {view === "practice" && renderPractice()}
        {view === "exam" && renderExam()}
        {view === "review" && renderReview()}
        {view === "sources" && renderSources()}
        <footer className="site-footer"><span>CAPM · unofficial bilingual study tool</span><button onClick={() => setView("sources")}>Sources & copyright</button></footer>
      </main>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => item.id === "practice" ? beginPractice("all") : setView(item.id)}>
            <i>{item.icon}</i><span>{item.label}</span>
            {item.id === "review" && progress.review.length > 0 && <em>{progress.review.length}</em>}
          </button>
        ))}
      </nav>
    </div>
  );
}
