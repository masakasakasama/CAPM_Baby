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
import { overviewCourse, studyGuides } from "./study";

type View = "home" | "learn" | "practice" | "exam" | "review" | "sources";
type SyncStatus = "loading" | "synced" | "saving" | "offline";

const APP_VERSION = "1.1.0";
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
            <div className="course-route">{overviewCourse.journey.map((item) => <span key={item.label}>{item.label}</span>)}</div>
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
