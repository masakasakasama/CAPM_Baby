export type Unit = {
  id: number;
  title: string;
  titleDe: string;
  weight: number;
  duration: string;
  keywords: string[];
  summaryDe: string;
  source: string;
};

export type Question = {
  id: string;
  unit: number;
  eo: string;
  kind: "single" | "multiple" | "boolean";
  prompt: string;
  options: string[];
  correct: number[];
  points: 1 | 2;
  keyword: string;
  explanationDe: string;
  source: string;
};

export const units: Unit[] = [
  {
    id: 1,
    title: "Project Management Fundamentals & Core Concepts",
    titleDe: "Grundlagen und Kernkonzepte des Projektmanagements",
    weight: 36,
    duration: "4 h",
    keywords: ["life cycle", "roles", "risk", "ethics", "planning"],
    summaryDe:
      "Projekte, Programme und Portfolios unterscheiden; Rollen, Planung, Risiken, Ethik und Problemlösung sicher einordnen.",
    source: "CAPM ECO 2023 · Domain I",
  },
  {
    id: 2,
    title: "Predictive, Plan-Based Methodologies",
    titleDe: "Prädiktive, planbasierte Methoden",
    weight: 17,
    duration: "3 h",
    keywords: ["WBS", "critical path", "EVM", "change control", "quality"],
    summaryDe:
      "Umfang, Terminplan und Kosten planbasiert strukturieren; Abweichungen messen und Änderungen kontrolliert behandeln.",
    source: "CAPM ECO 2023 · Domain II",
  },
  {
    id: 3,
    title: "Agile Frameworks & Methodologies",
    titleDe: "Agile Frameworks und Methoden",
    weight: 20,
    duration: "3 h",
    keywords: ["Scrum", "Kanban", "iteration", "backlog", "servant leadership"],
    summaryDe:
      "Adaptive Arbeitsweisen auswählen, Wert in kurzen Zyklen liefern und den Fluss mit Scrum- und Kanban-Praktiken verbessern.",
    source: "CAPM ECO 2023 · Domain III",
  },
  {
    id: 4,
    title: "Business Analysis Frameworks",
    titleDe: "Frameworks der Business-Analyse",
    weight: 27,
    duration: "3 h 30 m",
    keywords: ["requirements", "elicitation", "traceability", "roadmap", "acceptance"],
    summaryDe:
      "Bedürfnisse ermitteln, Anforderungen priorisieren und rückverfolgbar halten sowie Lösungsergebnisse bewerten.",
    source: "CAPM ECO 2023 · Domain IV",
  },
];

type QuestionSeed = [
  id: string,
  unit: number,
  task: string,
  kind: Question["kind"],
  prompt: string,
  options: string[],
  correct: number[],
  keyword: string,
  explanationDe: string,
];

const questionSeeds: QuestionSeed[] = [
  ["Q001", 1, "D1.T1", "single", "Which statement best distinguishes a project from operations?", ["A project is temporary and creates a unique result.", "A project repeats the same service indefinitely.", "Operations always have a fixed end date.", "Operations cannot create value."], [0], "project vs operations", "Ein Projekt ist zeitlich begrenzt und erzeugt ein einzigartiges Ergebnis. Betrieb ist fortlaufende, wiederholbare Arbeit."],
  ["Q002", 1, "D1.T1", "multiple", "Which TWO statements correctly describe programs and portfolios?", ["A program coordinates related projects for combined benefits.", "A portfolio groups work to support strategic objectives.", "A portfolio must contain only related projects.", "A program is the same as daily operations."], [0, 1], "program and portfolio", "Ein Programm koordiniert zusammenhängende Projekte. Ein Portfolio richtet Projekte, Programme und weitere Arbeiten an der Strategie aus."],
  ["Q003", 1, "D1.T1", "single", "A vendor delay might occur next month and could affect delivery. How should it be classified now?", ["Issue", "Risk", "Constraint", "Milestone"], [1], "risk", "Ein Risk ist ein unsicheres zukünftiges Ereignis. Ein Issue ist bereits eingetreten."],
  ["Q004", 1, "D1.T1", "single", "A regulation limits which customer data may be stored. What is it?", ["Assumption", "Constraint", "Risk response", "Benefit"], [1], "constraint", "Eine Constraint begrenzt die verfügbaren Optionen; hier setzt die Vorschrift eine feste Grenze."],
  ["Q005", 1, "D1.T2", "single", "Which artifact is the best place to record identified stakeholders and their relevant information?", ["Risk register", "Stakeholder register", "Issue log", "Product roadmap"], [1], "stakeholder register", "Das Stakeholder Register hält identifizierte Stakeholder und analysebezogene Informationen fest."],
  ["Q006", 1, "D1.T2", "boolean", "True or False: A milestone normally has zero duration.", ["True", "False"], [0], "milestone", "Ein Milestone markiert einen wichtigen Punkt oder ein Ereignis und hat üblicherweise keine Dauer."],
  ["Q007", 1, "D1.T3", "single", "Who is primarily accountable for championing the project and securing high-level support?", ["Project sponsor", "Business analyst", "Scrum developer", "Customer support lead"], [0], "sponsor", "Der Sponsor vertritt das Vorhaben auf hoher Ebene, unterstützt Finanzierung und beseitigt organisatorische Hindernisse."],
  ["Q008", 1, "D1.T3", "single", "A project manager notices tension and first tries to understand each person's perspective. Which capability is most visible?", ["Emotional intelligence", "Schedule compression", "Procurement control", "Cost aggregation"], [0], "emotional intelligence", "Emotionale Intelligenz hilft, eigene und fremde Emotionen wahrzunehmen und konstruktiv zu reagieren."],
  ["Q009", 1, "D1.T4", "multiple", "Which TWO actions support effective project initiation?", ["Clarify intended benefits.", "Identify key stakeholders.", "Finalize every detailed work package.", "Close all procurement contracts."], [0, 1], "initiation", "Zu Beginn werden Nutzen und zentrale Stakeholder geklärt. Detaillierte Planung folgt später."],
  ["Q010", 1, "D1.T5", "single", "A meeting ends without decisions, owners, or next steps. Which improvement is most direct?", ["Add a clear agenda and action log.", "Increase the project budget.", "Replace the sponsor.", "Remove all timeboxes."], [0], "effective meetings", "Agenda, Entscheidungen, Verantwortliche und nächste Schritte machen Meetings zielgerichtet und nachverfolgbar."],
  ["Q011", 1, "D1.T1", "single", "When is an adaptive approach generally more suitable than a predictive approach?", ["Requirements are uncertain and feedback is frequent.", "Scope is stable and repeatable.", "Change is prohibited by contract.", "The solution is fully known."], [0], "adaptive approach", "Adaptive Ansätze sind besonders nützlich, wenn Unsicherheit hoch ist und Feedback die Lösung schrittweise verbessert."],
  ["Q012", 1, "D1.T1", "single", "A manager hides a known safety concern to protect a deadline. Which PMI ethics value is most directly violated?", ["Honesty", "Velocity", "Tailoring", "Float"], [0], "ethics", "Bewusstes Verschweigen einer relevanten Gefahr verletzt insbesondere die Verpflichtung zu Ehrlichkeit und Verantwortung."],

  ["Q013", 2, "D2.T1", "single", "Which condition most strongly favors a predictive, plan-based approach?", ["Scope is well understood and change is relatively low.", "The solution must emerge through experiments.", "Priorities change every few days.", "Stakeholders cannot define an outcome."], [0], "predictive suitability", "Prädiktive Ansätze funktionieren gut, wenn Umfang und Vorgehen früh stabil beschrieben werden können."],
  ["Q014", 2, "D2.T1", "single", "What is the primary purpose of a Work Breakdown Structure?", ["Decompose project scope into manageable components.", "Rank stakeholders by influence.", "Display team emotions.", "Authorize the project."], [0], "WBS", "Die WBS zerlegt den gesamten Projektumfang hierarchisch in handhabbare Deliverables und Work Packages."],
  ["Q015", 2, "D2.T2", "single", "Activities A and B must finish before C can start. Which relationship is described?", ["Finish-to-start", "Start-to-start", "Finish-to-finish", "Start-to-finish"], [0], "dependency", "Bei Finish-to-start muss der Vorgänger abgeschlossen sein, bevor der Nachfolger beginnt."],
  ["Q016", 2, "D2.T2", "single", "Which path determines the shortest possible project duration in a network diagram?", ["Critical path", "Fastest resource path", "Quality path", "Stakeholder path"], [0], "critical path", "Der Critical Path ist die längste Pfad-Dauer durch das Netz und bestimmt damit die kürzeste Projektlaufzeit."],
  ["Q017", 2, "D2.T2", "boolean", "True or False: Total float on a critical-path activity is normally zero.", ["True", "False"], [0], "float", "Aktivitäten auf dem Critical Path haben unter normalen Annahmen keinen gesamten Puffer."],
  ["Q018", 2, "D2.T3", "single", "A project has EV = 80 and AC = 100. What does CPI = 0.80 indicate?", ["The project is over budget for the value earned.", "The project is ahead of schedule.", "The project has no cost variance.", "The scope is complete."], [0], "CPI", "CPI = EV ÷ AC. Ein Wert unter 1 bedeutet, dass für den erreichten Wert mehr ausgegeben wurde als geplant."],
  ["Q019", 2, "D2.T3", "single", "A project has EV = 90 and PV = 100. What does SPI = 0.90 indicate?", ["Progress is behind the planned rate.", "Costs are exactly on budget.", "Quality exceeds requirements.", "The critical path has negative duration."], [0], "SPI", "SPI = EV ÷ PV. Ein Wert unter 1 zeigt, dass der erarbeitete Wert hinter dem Planwert liegt."],
  ["Q020", 2, "D2.T3", "multiple", "Which TWO are examples of prevention rather than inspection?", ["Training the team on a standard process.", "Improving a checklist before work starts.", "Testing a finished deliverable.", "Counting defects after release."], [0, 1], "quality prevention", "Prävention baut Qualität in den Prozess ein. Inspection sucht Fehler in bereits erzeugten Ergebnissen."],
  ["Q021", 2, "D2.T4", "single", "A requested scope change affects schedule and cost baselines. What should happen first?", ["Assess the impact through integrated change control.", "Implement it immediately.", "Ignore the request.", "Delete the baselines."], [0], "change control", "Vor der Entscheidung werden Auswirkungen auf alle relevanten Baselines und Ziele gemeinsam bewertet."],
  ["Q022", 2, "D2.T2", "single", "Which technique shortens a schedule by adding resources to critical-path work, usually at extra cost?", ["Crashing", "Rolling wave planning", "Resource smoothing", "Backlog refinement"], [0], "crashing", "Crashing verkürzt die Dauer durch zusätzliche Ressourcen oder Kosten auf kritischen Aktivitäten."],
  ["Q023", 2, "D2.T1", "single", "What does the scope baseline commonly include?", ["Scope statement, WBS, and WBS dictionary", "Issue log and team charter", "Product backlog and burnup chart", "Risk appetite and vendor invoice"], [0], "scope baseline", "Die Scope Baseline besteht typischerweise aus Scope Statement, WBS und WBS Dictionary."],
  ["Q024", 2, "D2.T4", "single", "A supplier delivers an item that does not meet agreed acceptance criteria. Which document is most relevant?", ["Procurement agreement", "Team calendar", "Benefits register", "Product vision"], [0], "procurement", "Die Vereinbarung beschreibt Leistung, Bedingungen und Akzeptanz; sie ist die Grundlage für die Prüfung der Lieferung."],

  ["Q025", 3, "D3.T1", "single", "What is the main advantage of delivering in short iterations?", ["Frequent feedback can guide the next increment.", "All uncertainty disappears before work starts.", "Documentation is never needed.", "The sponsor no longer makes decisions."], [0], "iteration", "Kurze Iterationen erzeugen häufige Lern- und Feedbackpunkte und reduzieren das Risiko langer Fehlentwicklungen."],
  ["Q026", 3, "D3.T1", "multiple", "Which TWO statements reflect an agile mindset?", ["Welcome useful change.", "Deliver value frequently.", "Freeze learning after planning.", "Measure success only by document volume."], [0, 1], "agile mindset", "Agilität nutzt Veränderung und häufige Wertlieferung, statt Lernen nach der Planung zu stoppen."],
  ["Q027", 3, "D3.T2", "single", "Who is accountable for maximizing product value and ordering the Product Backlog in Scrum?", ["Product Owner", "Scrum Master", "Developers", "Project sponsor"], [0], "Product Owner", "Der Product Owner maximiert den Produktwert und verantwortet die Reihenfolge des Product Backlog."],
  ["Q028", 3, "D3.T2", "single", "What is the Scrum Master's most appropriate response to an impediment?", ["Help the team remove it and improve the system.", "Assign every task personally.", "Rewrite the product goal alone.", "Approve all invoices."], [0], "Scrum Master", "Der Scrum Master unterstützt Team und Organisation als Servant Leader beim Beseitigen von Hindernissen."],
  ["Q029", 3, "D3.T2", "boolean", "True or False: The Sprint Retrospective primarily focuses on improving how the team works.", ["True", "False"], [0], "retrospective", "Die Retrospektive untersucht Zusammenarbeit, Prozesse und Werkzeuge und vereinbart Verbesserungen."],
  ["Q030", 3, "D3.T2", "single", "Which event inspects the increment with stakeholders and adapts the Product Backlog?", ["Sprint Review", "Daily Scrum", "Sprint Planning", "Backlog creation"], [0], "Sprint Review", "Im Sprint Review werden Ergebnis und Umfeld gemeinsam betrachtet und das Backlog bei Bedarf angepasst."],
  ["Q031", 3, "D3.T2", "single", "What does a Definition of Done provide?", ["A shared quality standard for completed work", "A list of future product ideas", "A vendor payment schedule", "A personal task ranking"], [0], "Definition of Done", "Die Definition of Done schafft ein gemeinsames Qualitätsverständnis dafür, wann ein Increment fertig ist."],
  ["Q032", 3, "D3.T3", "single", "Why does Kanban limit work in progress?", ["To expose bottlenecks and improve flow", "To guarantee every estimate", "To eliminate stakeholder feedback", "To increase batch size"], [0], "WIP limit", "WIP-Limits reduzieren parallele Arbeit, machen Engpässe sichtbar und fördern gleichmäßigen Flow."],
  ["Q033", 3, "D3.T3", "single", "A team's velocity was 24, 27, and 25 points in the last three iterations. What is the safest use of this data?", ["Forecast near-term capacity for that same team.", "Compare individual productivity across teams.", "Promise an exact delivery date.", "Convert points directly into money."], [0], "velocity", "Velocity ist ein teamspezifischer empirischer Anhaltspunkt für Planung, kein universelles Produktivitätsmaß."],
  ["Q034", 3, "D3.T2", "multiple", "Which TWO are useful outcomes of backlog refinement?", ["Items become clearer and smaller.", "Near-term items gain better estimates.", "The Sprint Goal is cancelled automatically.", "Every future item becomes fixed."], [0, 1], "backlog refinement", "Refinement verbessert Verständnis, Größe und Schätzbarkeit kommender Items, ohne die gesamte Zukunft einzufrieren."],
  ["Q035", 3, "D3.T1", "single", "A project has stable regulatory milestones but uncertain solution details. Which approach may fit best?", ["Hybrid", "Purely predictive with no feedback", "No life cycle", "Operations only"], [0], "hybrid", "Ein hybrider Ansatz kann feste Governance-Punkte mit adaptiver Lösungsentwicklung verbinden."],
  ["Q036", 3, "D3.T3", "single", "Which metric measures how long one work item takes from start to finish?", ["Cycle time", "Cost variance", "Total float", "Planned value"], [0], "cycle time", "Cycle Time misst die Zeit vom Arbeitsbeginn bis zur Fertigstellung eines einzelnen Items."],

  ["Q037", 4, "D4.T1", "single", "What is the central purpose of business analysis on a project?", ["Enable valuable change by clarifying needs and recommending solutions.", "Own every project budget.", "Replace all stakeholders.", "Control only the schedule."], [0], "business analysis", "Business Analysis klärt Bedürfnisse, bewertet Optionen und unterstützt Veränderungen, die messbaren Wert erzeugen."],
  ["Q038", 4, "D4.T1", "single", "Which technique is best for exploring a stakeholder's work through direct observation?", ["Job shadowing", "Monte Carlo analysis", "Crashing", "Earned value analysis"], [0], "observation", "Job Shadowing bzw. Beobachtung zeigt reale Arbeitsabläufe, einschließlich stillschweigenden Wissens."],
  ["Q039", 4, "D4.T2", "multiple", "Which TWO elements make a user story more testable?", ["Clear acceptance criteria", "A concrete user need", "An unlimited scope", "No stakeholder context"], [0, 1], "user story", "Ein klarer Nutzen und prüfbare Akzeptanzkriterien verbinden Bedarf und erwartetes Verhalten."],
  ["Q040", 4, "D4.T2", "single", "Which artifact links requirements to their origin and downstream deliverables or tests?", ["Requirements traceability matrix", "Resource histogram", "Risk breakdown structure", "Burndown chart"], [0], "traceability", "Die Requirements Traceability Matrix verbindet Anforderungen mit Quellen, Ergebnissen und Tests."],
  ["Q041", 4, "D4.T2", "single", "In MoSCoW prioritization, what does the first M represent?", ["Must have", "May ignore", "Measure later", "Manage cost"], [0], "MoSCoW", "Must-have-Anforderungen sind für die betrachtete Lieferung unverzichtbar."],
  ["Q042", 4, "D4.T2", "single", "Which statement best distinguishes verification from validation?", ["Verification checks the specification; validation checks the solution meets the need.", "Verification is only agile; validation is only predictive.", "They are identical.", "Validation occurs only after project closure."], [0], "verification vs validation", "Verification fragt, ob das Arbeitsergebnis korrekt erstellt wurde; Validation, ob es den tatsächlichen Bedarf erfüllt."],
  ["Q043", 4, "D4.T3", "single", "What does a product roadmap primarily communicate?", ["A directional view of product outcomes and releases over time", "Every developer's daily task", "Only the project cost baseline", "A complete defect log"], [0], "product roadmap", "Eine Product Roadmap verbindet angestrebte Outcomes, Themen und Releases in einer zeitlichen Richtung."],
  ["Q044", 4, "D4.T3", "single", "A feature passes its tests but users cannot complete the intended task. What has most likely failed?", ["Solution validation", "Schedule verification", "Procurement closure", "Resource leveling"], [0], "solution validation", "Technische Tests können bestanden sein, während der reale Nutzerbedarf dennoch nicht erfüllt wird."],
  ["Q045", 4, "D4.T1", "multiple", "Which TWO are common elicitation techniques?", ["Interview", "Workshop", "Schedule crashing", "Cost aggregation"], [0, 1], "elicitation", "Interviews und Workshops gewinnen Anforderungen und Kontext gemeinsam mit Stakeholdern."],
  ["Q046", 4, "D4.T2", "single", "A requirement changes after approval. What should the team do?", ["Assess impact and update traceability before approval and implementation.", "Silently overwrite the original.", "Reject every change.", "Delete all acceptance criteria."], [0], "requirements change", "Änderungen werden analysiert, entschieden, versioniert und in der Rückverfolgbarkeit aktualisiert."],
  ["Q047", 4, "D4.T3", "boolean", "True or False: Acceptance criteria should be observable enough to decide whether a requirement is satisfied.", ["True", "False"], [0], "acceptance criteria", "Akzeptanzkriterien müssen klar und beobachtbar sein, damit Annahme oder Ablehnung nachvollziehbar wird."],
  ["Q048", 4, "D4.T1", "single", "Stakeholders disagree about the real problem. What should the business analyst do first?", ["Facilitate shared understanding of needs and context.", "Select a solution alone.", "Skip elicitation.", "Freeze the roadmap."], [0], "shared understanding", "Vor einer Lösung braucht die Gruppe ein gemeinsames Verständnis von Problem, Bedarf und Kontext."],
];

export const questions: Question[] = questionSeeds.map(
  ([id, unit, eo, kind, prompt, options, correct, keyword, explanationDe]) => ({
    id,
    unit,
    eo,
    kind,
    prompt,
    options,
    correct,
    points: kind === "multiple" ? 2 : 1,
    keyword,
    explanationDe,
    source: `CAPM ECO 2023 · ${eo}`,
  }),
);

export const sources = [
  {
    id: "capm-eco",
    title: "CAPM Examination Content Outline",
    publisher: "Project Management Institute",
    version: "2023 structure · current CAPM page checked 26 Jul 2026",
    chapter: "Domains, tasks, exam information",
    url: "https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/capm-exam-content-outline-english.pdf",
  },
  {
    id: "capm-certification",
    title: "Certified Associate in Project Management (CAPM)®",
    publisher: "Project Management Institute",
    version: "Live certification page",
    chapter: "Eligibility, 150 questions, 180 minutes, languages",
    url: "https://www.pmi.org/certifications/certified-associate-capm/",
  },
  {
    id: "pmi-ethics",
    title: "PMI Code of Ethics and Professional Conduct",
    publisher: "Project Management Institute",
    version: "Effective 17 Nov 2025",
    chapter: "Responsibility, respect, fairness, honesty",
    url: "https://www.pmi.org/about/ethics/",
  },
  {
    id: "agile-guide",
    title: "Agile Practice Guide",
    publisher: "Project Management Institute",
    version: "Public PMI overview; full publication has separate access terms",
    chapter: "Public overview of agile, adaptive, and hybrid work",
    url: "https://www.pmi.org/standards/agile",
  },
  {
    id: "ba-guide",
    title: "Business Analysis for Practitioners: A Practice Guide",
    publisher: "Project Management Institute",
    version: "Public PMI overview; full publication has separate access terms",
    chapter: "Public overview of needs, requirements, and solution evaluation",
    url: "https://www.pmi.org/standards/business-analysis-second-edition",
  },
  {
    id: "scrum-guide",
    title: "The Scrum Guide",
    publisher: "Ken Schwaber & Jeff Sutherland",
    version: "Official free guide · November 2020",
    chapter: "Scrum accountabilities, events, artifacts, and commitments",
    url: "https://scrumguides.org/scrum-guide.html",
  },
  {
    id: "agile-manifesto",
    title: "Principles behind the Agile Manifesto",
    publisher: "Agile Manifesto authors",
    version: "Official public text",
    chapter: "Agile values and 12 principles",
    url: "https://agilemanifesto.org/principles",
  },
] as const;
