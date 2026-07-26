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

export const agencyCourse = {
  title: "Find the right students. Build a path that works.",
  titleDe: "Passende Lernende finden. Einen funktionierenden Weg aufbauen.",
  lead:
    "A student agency already works with one Japanese language school. The school is known; the open question is where suitable international students are and how to help them make an informed choice.",
  leadDe:
    "Eine Vermittlungsagentur arbeitet bereits mit einer japanischen Sprachschule zusammen. Die Schule ist bekannt. Unklar ist, wo passende internationale Lernende zu finden sind und wie sie eine gut informierte Entscheidung treffen können.",
  caseFacts: [
    { label: "WE ALREADY HAVE", value: "1 partner school", de: "Eine Partnerschule", tone: "pink" },
    { label: "WE DO NOT KNOW YET", value: "Which students and channels fit", de: "Welche Lernenden und Kanäle passen", tone: "blue" },
    { label: "PROJECT GOAL", value: "A tested recruitment path", de: "Ein getesteter Vermittlungsweg", tone: "mint" },
  ],
  ecosystem: [
    { icon: "people", title: "Prospective students", de: "Interessierte Lernende", note: "Goals, budget, timing, country" },
    { icon: "signal", title: "Discovery channels", de: "Kontaktkanäle", note: "Referrals, partners, webinars, content" },
    { icon: "handshake", title: "Student agency", de: "Vermittlungsagentur", note: "Explain, qualify, support, never overpromise" },
    { icon: "school", title: "Japanese language school", de: "Japanische Sprachschule", note: "Offer, requirements, capacity, decision" },
    { icon: "cap", title: "Enrolled learner", de: "Eingeschriebene Person", note: "Good fit, prepared start, learning outcome" },
  ],
  journey: [
    {
      label: "UNDERSTAND",
      title: "Know the school and the learner",
      de: "Schule und Lernende verstehen",
      question: "Who can genuinely benefit from this school?",
      actions: "Confirm intake dates, fees, courses, support, entry conditions, and interview current students.",
      artifact: "Student–school fit profile",
      measure: "School facts confirmed; 5 learner interviews",
      note: "D4 + D1",
    },
    {
      label: "FIND",
      title: "Test where students can be reached",
      de: "Kontaktwege testen",
      question: "Where do suitable students already ask for help?",
      actions: "Test alumni referrals, local education partners, multilingual webinars, and focused online content.",
      artifact: "Channel test cards",
      measure: "Qualified inquiries per channel",
      note: "D3 + D4",
    },
    {
      label: "QUALIFY",
      title: "Check readiness and fit",
      de: "Eignung und Bereitschaft prüfen",
      question: "Is this a real match—not merely a lead?",
      actions: "Ask about learning goal, start date, budget, education history, and document readiness with consent.",
      artifact: "Short qualification checklist",
      measure: "Qualified inquiry rate",
      note: "D4",
    },
    {
      label: "MATCH",
      title: "Explain the choice honestly",
      de: "Die Wahl ehrlich erklären",
      question: "Can the student decide with clear facts?",
      actions: "Explain curriculum, total cost, location, support, requirements, and limitations. Record open questions.",
      artifact: "Fit summary for student and school",
      measure: "Informed consultation completed",
      note: "D1 + D4",
    },
    {
      label: "APPLY",
      title: "Guide a complete application",
      de: "Eine vollständige Bewerbung begleiten",
      question: "What must happen, by whom, and by when?",
      actions: "Use a document checklist, owners, hand-off dates, school review, and application status board.",
      artifact: "Application tracker",
      measure: "Complete applications submitted on time",
      note: "D2",
    },
    {
      label: "LEARN",
      title: "Improve the path with evidence",
      de: "Den Weg mit Daten verbessern",
      question: "Which path creates suitable enrollments?",
      actions: "Compare channel quality, applications, acceptance, enrollment, and early attendance. Stop weak tests; expand strong ones.",
      artifact: "Recruitment playbook",
      measure: "Good-fit enrollments and early retention",
      note: "D3 + D1",
    },
  ],
  funnel: [
    { value: 120, label: "People reached", de: "Erreichte Personen", note: "Saw useful, accurate information" },
    { value: 36, label: "Inquiries", de: "Anfragen", note: "Asked for more information" },
    { value: 18, label: "Qualified conversations", de: "Passende Gespräche", note: "Goal, timing, budget, and basic readiness fit" },
    { value: 8, label: "Applications", de: "Bewerbungen", note: "Chose the school and prepared documents" },
    { value: 5, label: "Accepted", de: "Angenommen", note: "School made the decision" },
    { value: 4, label: "Enrolled", de: "Eingeschrieben", note: "Completed the process and started" },
  ],
  channels: [
    {
      title: "Alumni referrals",
      de: "Empfehlungen ehemaliger Lernender",
      strength: "High trust · limited reach",
      test: "Invite 10 alumni to one Q&A session and give them a factual school guide to share.",
      signal: "Qualified conversations per referral",
    },
    {
      title: "Local education partners",
      de: "Lokale Bildungspartner",
      strength: "Local context · needs quality control",
      test: "Pilot with 2 partners using the same eligibility and messaging checklist.",
      signal: "Suitable students per partner",
    },
    {
      title: "Multilingual webinar + content",
      de: "Mehrsprachiges Webinar und Inhalte",
      strength: "Explains complexity · needs repeated testing",
      test: "Run one country-specific session answering costs, study goals, and application timing.",
      signal: "Attendee → qualified conversation",
    },
    {
      title: "Focused paid campaign",
      de: "Gezielte bezahlte Kampagne",
      strength: "Fast reach · costs money",
      test: "Use a small budget only after the fit profile and honest message are validated.",
      signal: "Cost per qualified conversation",
    },
  ],
  lenses: [
    {
      domain: "D1",
      title: "Why, for whom, and with what responsibility?",
      de: "Warum, für wen und mit welcher Verantwortung?",
      body: "Clarify the benefit for the learner, school, and agency. Identify roles, risks, privacy, ethics, and who may decide.",
    },
    {
      domain: "D2",
      title: "What must happen by the intake date?",
      de: "Was muss bis zum Aufnahmetermin passieren?",
      body: "Turn fixed school dates, document checks, hand-offs, and application work into a visible plan.",
    },
    {
      domain: "D3",
      title: "What should we test before spending more?",
      de: "Was sollten wir vor höheren Ausgaben testen?",
      body: "Use small channel experiments, compare evidence every two weeks, and change the next test.",
    },
    {
      domain: "D4",
      title: "Does the school really fit the learner?",
      de: "Passt die Schule wirklich zur lernenden Person?",
      body: "Discover needs, define fit rules, trace them into the consultation, and check the real outcome.",
    },
  ],
  fixedAndLearning: {
    fixed: [
      "School intake dates and capacity",
      "Tuition and documented requirements",
      "Application and immigration rules",
      "Privacy, consent, and honest claims",
    ],
    learning: [
      "Which country segment responds",
      "Which channel brings suitable inquiries",
      "Which message builds understanding",
      "Where students abandon the process",
    ],
    bridge:
      "Hybrid = keep the application path controlled while testing recruitment channels in small two-week cycles.",
  },
  pilot: [
    { week: "W1", title: "School facts", de: "Schulfakten", result: "Offer, limits, dates, and responsibilities confirmed" },
    { week: "W2", title: "Learner evidence", de: "Lernenden-Daten", result: "5 interviews and a first fit profile" },
    { week: "W3", title: "Two channel tests", de: "Zwei Kanaltests", result: "Referral and webinar tests launched" },
    { week: "W4", title: "Observe response", de: "Reaktionen beobachten", result: "Questions and drop-off points recorded" },
    { week: "W5", title: "Qualify", de: "Eignung prüfen", result: "Readiness and fit conversations completed" },
    { week: "W6", title: "Application rehearsal", de: "Bewerbung testen", result: "Checklist tested with school feedback" },
    { week: "W7", title: "Compare", de: "Vergleichen", result: "Channel quality, cost, and effort compared" },
    { week: "W8", title: "Decide", de: "Entscheiden", result: "Expand, change, or stop each channel" },
  ],
  valueChain: [
    { label: "ACTIVITY", title: "Run referral and webinar tests", de: "Tests durchführen" },
    { label: "OUTPUT", title: "Qualified student conversations", de: "Passende Beratungsgespräche" },
    { label: "OUTCOME", title: "Complete, informed applications", de: "Vollständige, informierte Bewerbungen" },
    { label: "BENEFIT", title: "Better-fit enrollments and a repeatable path", de: "Passendere Einschreibungen und ein wiederholbarer Weg" },
  ],
  anchors: [
    ["lead", "Kontakt", "Someone who showed interest; fit is not known yet"],
    ["qualified inquiry", "qualifizierte Anfrage", "Goal, timing, budget, and basic readiness appear to fit"],
    ["output", "Liefergegenstand", "What the project creates, such as a checklist"],
    ["outcome", "Ergebnis", "What changes when the output is used"],
    ["benefit", "Nutzen", "The measurable improvement for people or organizations"],
    ["validation", "Validierung", "Evidence that the path solves the real need"],
  ],
  source: "Original teaching case · aligned to the four CAPM ECO 2023 domains · illustrative numbers, not a forecast",
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
