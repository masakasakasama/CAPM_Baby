export type StudyTerm = {
  en: string;
  de: string;
  note: string;
};

export type StudyNode = {
  label: string;
  title: string;
  de: string;
  note: string;
};

export type StudyGuide = {
  unit: number;
  title: string;
  titleDe: string;
  lead: string;
  leadDe: string;
  primaryTitle: string;
  primaryNodes: StudyNode[];
  secondaryTitle: string;
  secondaryNodes: StudyNode[];
  insights: { title: string; de: string; body: string }[];
  terms: StudyTerm[];
  formulas?: { label: string; formula: string; meaning: string }[];
  source: string;
};

export const overviewCourse = {
  title: "One project, four lenses",
  titleDe: "Ein Projekt, vier Perspektiven",
  lead:
    "Follow one clinic-booking project from an unmet need to a measured outcome. Every stop adds a CAPM domain, so the exam map becomes one connected story instead of four separate lists.",
  leadDe:
    "Begleite ein Terminbuchungsprojekt vom Bedarf bis zum messbaren Ergebnis. Jede Station ergänzt eine CAPM-Perspektive.",
  journey: [
    { label: "NEED", title: "Find the real problem", de: "Bedarf verstehen", note: "D4 · Business analysis" },
    { label: "VALUE", title: "Define the benefit", de: "Nutzen klären", note: "D1 · Fundamentals" },
    { label: "APPROACH", title: "Choose how to work", de: "Vorgehen wählen", note: "D1 + D2 + D3" },
    { label: "PLAN", title: "Make work visible", de: "Arbeit planbar machen", note: "D2 · Predictive" },
    { label: "LEARN", title: "Deliver and adapt", de: "Liefern und lernen", note: "D3 · Agile" },
    { label: "OUTCOME", title: "Validate the change", de: "Ergebnis validieren", note: "D4 + D1" },
  ],
  lenses: [
    { domain: "D1", title: "Why and who?", de: "Warum und wer?", body: "Purpose, roles, stakeholders, risks, ethics, and benefits." },
    { domain: "D2", title: "What is the plan?", de: "Was ist der Plan?", body: "Scope decomposition, sequence, baseline, quality, and control." },
    { domain: "D3", title: "What will we learn next?", de: "Was lernen wir als Nächstes?", body: "Short cycles, flow, feedback, empowered teams, and adaptation." },
    { domain: "D4", title: "Does it solve the need?", de: "Löst es den Bedarf?", body: "Elicitation, requirements, traceability, acceptance, and outcomes." },
  ],
  scenario: [
    { step: "01", event: "Patients abandon phone bookings.", move: "Observe the work and interview patients.", domain: "D4" },
    { step: "02", event: "The clinic wants shorter booking time.", move: "Define benefit, sponsor, stakeholders, and measures.", domain: "D1" },
    { step: "03", event: "Privacy rules are fixed; interface needs are uncertain.", move: "Use a hybrid approach: fixed controls, iterative experience.", domain: "D1/2/3" },
    { step: "04", event: "The first release needs a controlled date.", move: "Build a WBS, dependencies, estimate, and baseline.", domain: "D2" },
    { step: "05", event: "Patients test a small increment every two weeks.", move: "Review feedback, limit WIP, refine the backlog.", domain: "D3" },
    { step: "06", event: "The app launches successfully.", move: "Validate reduced booking time and transition operations.", domain: "D4/1" },
  ],
  decisions: [
    { signal: "Stable scope · low change", choice: "Predictive", de: "Prädiktiv", why: "Plan the path and control variance." },
    { signal: "Unclear solution · frequent feedback", choice: "Adaptive", de: "Adaptiv", why: "Learn through small increments." },
    { signal: "Fixed constraints · uncertain experience", choice: "Hybrid", de: "Hybrid", why: "Combine governance with discovery." },
  ],
  anchors: [
    ["output", "Liefergegenstand", "What the project creates"],
    ["outcome", "Ergebnis", "What changes because it is used"],
    ["benefit", "Nutzen", "The measurable improvement"],
    ["risk", "Risiko", "An uncertain future event"],
    ["issue", "Problem", "An event that already exists"],
    ["validation", "Validierung", "Does this solve the real need?"],
  ],
  source: "CAPM ECO 2023 · all four domains · original cross-domain scenario",
} as const;

export const studyGuides: StudyGuide[] = [
  {
    unit: 1,
    title: "See the whole project system",
    titleDe: "Das gesamte Projektsystem verstehen",
    lead:
      "Start with the distinctions CAPM uses repeatedly: temporary project work, coordinated programs, strategy-led portfolios, and ongoing operations. Then connect roles, planning, uncertainty, and value.",
    leadDe:
      "Beginne mit den wiederkehrenden Abgrenzungen: Projekt, Programm, Portfolio und Betrieb. Verbinde sie anschließend mit Rollen, Planung, Unsicherheit und Nutzen.",
    primaryTitle: "From work to strategy",
    primaryNodes: [
      { label: "WORK", title: "Project", de: "Projekt", note: "Temporary · unique result" },
      { label: "COORDINATE", title: "Program", de: "Programm", note: "Related projects · combined benefits" },
      { label: "ALIGN", title: "Portfolio", de: "Portfolio", note: "Strategy · investment choices" },
    ],
    secondaryTitle: "A practical project life cycle",
    secondaryNodes: [
      { label: "01", title: "Initiate", de: "Initiieren", note: "Purpose, sponsor, stakeholders" },
      { label: "02", title: "Plan", de: "Planen", note: "Scope, schedule, cost, risk" },
      { label: "03", title: "Deliver", de: "Umsetzen", note: "Lead people, create outcomes" },
      { label: "04", title: "Monitor", de: "Überwachen", note: "Compare, learn, respond" },
      { label: "05", title: "Close", de: "Abschließen", note: "Accept, transition, learn" },
    ],
    insights: [
      { title: "Risk is not an issue", de: "Risiko ist kein Problem", body: "A risk may happen; an issue already exists. Assumptions are believed true for planning, while constraints limit options." },
      { title: "Lead and manage", de: "Führen und managen", body: "Management creates order; leadership creates direction, trust, and commitment. CAPM scenarios often require both." },
      { title: "Value before activity", de: "Nutzen vor Aktivität", body: "A busy team is not automatically successful. Link deliverables to outcomes, benefits, and the reason the project exists." },
    ],
    terms: [
      { en: "project charter", de: "Projektauftrag", note: "Formally authorizes the project and the project manager." },
      { en: "stakeholder register", de: "Stakeholderregister", note: "Records relevant stakeholder information and analysis." },
      { en: "risk register", de: "Risikoregister", note: "Captures risks, owners, analysis, and responses." },
      { en: "milestone", de: "Meilenstein", note: "A significant point or event, normally with zero duration." },
      { en: "benefit", de: "Nutzen", note: "A measurable improvement resulting from an outcome." },
      { en: "emotional intelligence", de: "emotionale Intelligenz", note: "Recognizing and working constructively with emotions." },
    ],
    source: "CAPM ECO 2023 · Domain I",
  },
  {
    unit: 2,
    title: "Turn scope into a controllable plan",
    titleDe: "Umfang in einen steuerbaren Plan überführen",
    lead:
      "Predictive work reduces uncertainty by decomposing scope, sequencing activities, estimating resources, setting baselines, and comparing actual performance with the plan.",
    leadDe:
      "Prädiktive Arbeit reduziert Unsicherheit durch Zerlegung des Umfangs, Ablaufplanung, Schätzung, Baselines und den Vergleich von Ist und Plan.",
    primaryTitle: "Scope decomposition",
    primaryNodes: [
      { label: "LEVEL 1", title: "Project outcome", de: "Projektergebnis", note: "The complete scope" },
      { label: "LEVEL 2", title: "Deliverables", de: "Liefergegenstände", note: "Major result groups" },
      { label: "LEVEL 3", title: "Work packages", de: "Arbeitspakete", note: "Estimate, assign, control" },
    ],
    secondaryTitle: "Schedule logic",
    secondaryNodes: [
      { label: "A · 3d", title: "Discover", de: "Analysieren", note: "Starts the path" },
      { label: "B · 5d", title: "Design", de: "Entwerfen", note: "Finish-to-start after A" },
      { label: "C · 4d", title: "Build", de: "Umsetzen", note: "Critical-path candidate" },
      { label: "D · 2d", title: "Accept", de: "Abnehmen", note: "Value becomes usable" },
    ],
    insights: [
      { title: "The critical path is a duration", de: "Der kritische Pfad bestimmt die Dauer", body: "It is the longest path through the network and therefore the shortest possible project duration." },
      { title: "Baselines need control", de: "Baselines brauchen Steuerung", body: "A change request is assessed across scope, schedule, cost, quality, risk, and value before approval." },
      { title: "Build quality in", de: "Qualität einbauen", body: "Prevention improves the process before defects occur; inspection detects defects in completed work." },
    ],
    terms: [
      { en: "work breakdown structure", de: "Projektstrukturplan", note: "Hierarchical decomposition of the total project scope." },
      { en: "critical path", de: "kritischer Pfad", note: "Longest-duration path through the schedule network." },
      { en: "total float", de: "Gesamtpuffer", note: "Time an activity may slip without delaying the project finish." },
      { en: "scope baseline", de: "Inhalts- und Umfangsbaseline", note: "Scope statement, WBS, and WBS dictionary." },
      { en: "integrated change control", de: "integrierte Änderungssteuerung", note: "Evaluates the combined impact of requested change." },
      { en: "crashing", de: "Terminverkürzung durch Zusatzressourcen", note: "Adds resources or cost to shorten critical work." },
    ],
    formulas: [
      { label: "Cost Performance Index", formula: "CPI = EV ÷ AC", meaning: "< 1 means over budget for the value earned." },
      { label: "Schedule Performance Index", formula: "SPI = EV ÷ PV", meaning: "< 1 means progress is behind plan." },
      { label: "Cost Variance", formula: "CV = EV − AC", meaning: "Negative means unfavorable cost performance." },
      { label: "Schedule Variance", formula: "SV = EV − PV", meaning: "Negative means less value completed than planned." },
    ],
    source: "CAPM ECO 2023 · Domain II",
  },
  {
    unit: 3,
    title: "Learn through short value cycles",
    titleDe: "In kurzen Wertzyklen lernen",
    lead:
      "Agile approaches make uncertainty visible and manageable. Teams deliver a small increment, inspect outcomes with stakeholders, and adapt priorities and ways of working.",
    leadDe:
      "Agile Ansätze machen Unsicherheit sichtbar und handhabbar. Teams liefern ein kleines Increment, prüfen Ergebnisse und passen Prioritäten sowie Zusammenarbeit an.",
    primaryTitle: "The adaptive learning loop",
    primaryNodes: [
      { label: "PLAN", title: "Choose a small goal", de: "Kleines Ziel wählen", note: "Highest value and learning" },
      { label: "BUILD", title: "Create an increment", de: "Increment erstellen", note: "Cross-functional teamwork" },
      { label: "REVIEW", title: "Inspect the result", de: "Ergebnis prüfen", note: "Stakeholder feedback" },
      { label: "ADAPT", title: "Change the next plan", de: "Nächsten Plan anpassen", note: "Evidence over prediction" },
    ],
    secondaryTitle: "Flow through a Kanban system",
    secondaryNodes: [
      { label: "BACKLOG", title: "Ready", de: "Bereit", note: "Ordered options" },
      { label: "WIP 2", title: "Doing", de: "In Arbeit", note: "Limit parallel work" },
      { label: "CHECK", title: "Review", de: "Prüfung", note: "Quality and feedback" },
      { label: "DONE", title: "Delivered", de: "Geliefert", note: "Measure cycle time" },
    ],
    insights: [
      { title: "Roles are accountabilities", de: "Rollen sind Verantwortlichkeiten", body: "The Product Owner maximizes value, Developers create the increment, and the Scrum Master improves the system." },
      { title: "WIP limits improve flow", de: "WIP-Limits verbessern den Flow", body: "Less parallel work exposes bottlenecks, shortens feedback, and helps teams finish before starting more." },
      { title: "Hybrid can be intentional", de: "Hybrid kann bewusst gewählt sein", body: "Stable governance or regulatory milestones can coexist with adaptive solution development." },
    ],
    terms: [
      { en: "Product Backlog", de: "Product Backlog", note: "Ordered, evolving list of options for improving the product." },
      { en: "Sprint Goal", de: "Sprint-Ziel", note: "The coherent objective for one Sprint." },
      { en: "Definition of Done", de: "Definition of Done", note: "Shared quality standard for completed work." },
      { en: "servant leadership", de: "dienende Führung", note: "Enables people and removes systemic impediments." },
      { en: "velocity", de: "Velocity", note: "Team-specific evidence for near-term forecasting." },
      { en: "cycle time", de: "Durchlaufzeit", note: "Elapsed time from starting one item to finishing it." },
    ],
    source: "CAPM ECO 2023 · Domain III / Agile Practice Guide",
  },
  {
    unit: 4,
    title: "Trace needs all the way to outcomes",
    titleDe: "Bedürfnisse bis zu Ergebnissen rückverfolgen",
    lead:
      "Business analysis prevents teams from solving the wrong problem. It connects stakeholder needs to requirements, solution features, acceptance evidence, and measurable outcomes.",
    leadDe:
      "Business Analysis verhindert Lösungen für das falsche Problem. Sie verbindet Bedürfnisse mit Anforderungen, Features, Akzeptanznachweisen und messbaren Outcomes.",
    primaryTitle: "The traceability chain",
    primaryNodes: [
      { label: "WHY", title: "Stakeholder need", de: "Stakeholderbedarf", note: "Problem or opportunity" },
      { label: "WHAT", title: "Requirement", de: "Anforderung", note: "Necessary capability or condition" },
      { label: "HOW", title: "Solution feature", de: "Lösungsmerkmal", note: "A designed response" },
      { label: "PROVE", title: "Acceptance evidence", de: "Akzeptanznachweis", note: "Observable criteria and tests" },
      { label: "VALUE", title: "Outcome", de: "Ergebnis", note: "Measure the intended change" },
    ],
    secondaryTitle: "Roadmap from now to outcome",
    secondaryNodes: [
      { label: "NOW", title: "Discover", de: "Ermitteln", note: "Interviews, workshops, observation" },
      { label: "NEXT", title: "Prioritize", de: "Priorisieren", note: "Value, risk, dependency" },
      { label: "LATER", title: "Release", de: "Veröffentlichen", note: "Test assumptions in increments" },
      { label: "MEASURE", title: "Evaluate", de: "Bewerten", note: "Did the need improve?" },
    ],
    insights: [
      { title: "Verify and validate", de: "Verifizieren und validieren", body: "Verification checks the requirement or solution specification; validation checks fitness for the real need." },
      { title: "Criteria make stories testable", de: "Kriterien machen Stories prüfbar", body: "A useful user story expresses user, need, and value. Acceptance criteria make success observable." },
      { title: "Priorities are decisions", de: "Prioritäten sind Entscheidungen", body: "MoSCoW, value-risk analysis, and roadmaps communicate tradeoffs; they do not remove stakeholder judgment." },
    ],
    terms: [
      { en: "elicitation", de: "Anforderungsermittlung", note: "Discovering information through people, documents, data, and observation." },
      { en: "acceptance criteria", de: "Akzeptanzkriterien", note: "Observable conditions for accepting an item." },
      { en: "requirements traceability matrix", de: "Rückverfolgbarkeitsmatrix", note: "Links requirements to sources, deliverables, and tests." },
      { en: "product roadmap", de: "Produkt-Roadmap", note: "Directional view of outcomes and releases over time." },
      { en: "solution evaluation", de: "Lösungsbewertung", note: "Measures whether the solution delivers the intended value." },
      { en: "MoSCoW", de: "Must / Should / Could / Won't", note: "A transparent prioritization conversation." },
    ],
    source: "CAPM ECO 2023 · Domain IV / Business Analysis Practice Guide",
  },
];
