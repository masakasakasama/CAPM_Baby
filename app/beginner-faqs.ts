export type BeginnerFaq = {
  questionDe: string;
  answerDe: string;
};

export const beginnerFaqsById: Record<string, BeginnerFaq[]> = {
  Q001: [
    {
      questionDe: "Was ist ein Projekt – ganz einfach gesagt?",
      answerDe:
        "Ein Projekt ist eine Aufgabe mit einem klaren Anfang und Ende. Dabei entsteht etwas Neues oder Einmaliges. Beispiel: Eine Firma entwickelt in sechs Monaten eine neue Buchungs-App. Die tägliche Betreuung der fertigen App läuft danach dauerhaft weiter und gehört zum Betrieb, nicht mehr zum Projekt.",
    },
    {
      questionDe: "Bedeutet „zeitlich begrenzt“, dass ein Projekt kurz sein muss?",
      answerDe:
        "Nein. Ein Projekt kann zwei Wochen oder zehn Jahre dauern. Entscheidend ist nur, dass es nicht endlos weiterläuft. Der Bau eines Flughafens dauert lange, hat aber trotzdem einen geplanten Abschluss.",
    },
  ],
  Q002: [
    {
      questionDe: "Was ist ein Programm?",
      answerDe:
        "Ein Programm verbindet mehrere Projekte, die gemeinsam einen größeren Nutzen erzeugen. Beispiel: Ein Krankenhaus führt eine digitale Patientenversorgung ein. Dazu gehören ein App-Projekt, ein Schulungsprojekt und ein Projekt für neue Geräte. Zusammen bilden sie ein Programm.",
    },
    {
      questionDe: "Was ist ein Portfolio?",
      answerDe:
        "Ein Portfolio ist die Auswahl aller wichtigen Vorhaben, in die eine Organisation investieren will. Die Vorhaben müssen nicht zusammengehören. Beispiel: Eine Firma finanziert gleichzeitig eine neue Fabrik, eine Kunden-App und ein Energiesparprogramm, weil alle drei zur Unternehmensstrategie passen.",
    },
  ],
  Q003: [
    {
      questionDe: "Was ist der Unterschied zwischen Risk und Issue?",
      answerDe:
        "Ein Risk ist etwas Unsicheres, das in Zukunft passieren könnte. Ein Issue ist ein Problem, das bereits passiert ist. „Der Lieferant könnte nächste Woche zu spät liefern“ ist ein Risk. „Der Lieferant hat heute die Frist verpasst“ ist ein Issue.",
    },
    {
      questionDe: "Warum ist die mögliche Lieferverzögerung noch kein Problem?",
      answerDe:
        "Weil sie noch nicht eingetreten ist. Das Team kann vorsorgen, zum Beispiel einen zweiten Lieferanten prüfen oder zusätzlichen Zeitpuffer einplanen. Erst wenn die Verzögerung wirklich eintritt, wird daraus ein aktuelles Problem.",
    },
  ],
  Q004: [
    {
      questionDe: "Was bedeutet Constraint?",
      answerDe:
        "Ein Constraint ist eine feste Grenze, an die sich das Projekt halten muss. Eine Datenschutzregel kann zum Beispiel verbieten, bestimmte Kundendaten zu speichern. Das Team darf diese Grenze nicht einfach ignorieren.",
    },
    {
      questionDe: "Wie unterscheidet sich eine feste Grenze von einer Annahme?",
      answerDe:
        "Eine feste Grenze schränkt die Möglichkeiten ein. Eine Annahme ist etwas, das man für die Planung zunächst als wahr betrachtet. Beispiel: „Wir dürfen keine Gesundheitsdaten speichern“ ist eine Grenze. „Die Fachabteilung stellt im Mai zwei Personen bereit“ ist eine Annahme, die sich später als falsch erweisen kann.",
    },
  ],
  Q005: [
    {
      questionDe: "Wer ist ein Stakeholder?",
      answerDe:
        "Ein Stakeholder ist eine Person oder Gruppe, die das Projekt beeinflusst oder von seinem Ergebnis betroffen ist. Bei einer Termin-App sind das zum Beispiel Patienten, Ärzte, Empfangspersonal, Datenschutzbeauftragte und die Person, die das Projekt bezahlt.",
    },
    {
      questionDe: "Wozu dient das Stakeholder Register?",
      answerDe:
        "Es ist eine geordnete Liste dieser beteiligten oder betroffenen Personen. Dort hält das Team zum Beispiel fest, wer welche Erwartungen hat, wer Entscheidungen treffen kann und wie die Person informiert werden sollte. So wird niemand Wichtiges übersehen.",
    },
  ],
  Q006: [
    {
      questionDe: "Was ist ein Milestone?",
      answerDe:
        "Ein Milestone ist ein wichtiger Zeitpunkt, keine längere Tätigkeit. Beispiel: „Vertrag unterschrieben“ oder „App für den Test freigegeben“. Der Punkt selbst dauert null Tage, auch wenn die Vorbereitung davor mehrere Wochen braucht.",
    },
    {
      questionDe: "Warum hat ein Milestone keine Dauer?",
      answerDe:
        "Er markiert nur, dass ein bestimmter Zustand erreicht wurde. Ein Geburtstag ist ebenfalls ein Datum und keine Aufgabe. „Geburtstagsfeier vorbereiten“ dauert dagegen mehrere Tage und ist eine Tätigkeit.",
    },
  ],
  Q007: [
    {
      questionDe: "Was macht ein Project Sponsor?",
      answerDe:
        "Der Sponsor ist die hochrangige Person, die das Projekt unterstützt und nach außen vertritt. Sie hilft bei Finanzierung, wichtigen Entscheidungen und Hindernissen, die das Projektteam allein nicht lösen kann.",
    },
    {
      questionDe: "Wie sieht das in einem Beispiel aus?",
      answerDe:
        "Eine Klinik entwickelt eine Buchungs-App. Die Klinikleitung stellt das Budget bereit, erklärt anderen Abteilungen die Bedeutung des Projekts und entscheidet bei einem großen Konflikt. Diese Klinikleitung übernimmt die Sponsor-Rolle.",
    },
  ],
  Q008: [
    {
      questionDe: "Was bedeutet emotionale Intelligenz?",
      answerDe:
        "Damit ist die Fähigkeit gemeint, eigene und fremde Gefühle wahrzunehmen und sinnvoll damit umzugehen. Es geht nicht darum, jede Person glücklich zu machen, sondern Reaktionen und Spannungen zu verstehen.",
    },
    {
      questionDe: "Wie hilft das in einem Projekt?",
      answerDe:
        "Zwei Teammitglieder streiten über eine Lösung. Die Projektleitung entscheidet nicht sofort, wer recht hat, sondern fragt zuerst nach den Sorgen beider Seiten. Vielleicht fürchtet eine Person ein Sicherheitsproblem und die andere eine Terminverzögerung. Erst dieses Verständnis ermöglicht eine sachliche Lösung.",
    },
  ],
  Q009: [
    {
      questionDe: "Was sollte am Anfang eines Projekts zuerst klar sein?",
      answerDe:
        "Zuerst muss klar sein, warum das Projekt existiert, welchen Nutzen es bringen soll und welche Personen besonders wichtig sind. Beispiel: Bei einer Buchungs-App lautet der Nutzen vielleicht „Patienten warten weniger am Telefon“.",
    },
    {
      questionDe: "Warum wird am Anfang noch nicht jedes Arbeitspaket fertig geplant?",
      answerDe:
        "Eine sehr detaillierte Planung lohnt sich erst, wenn Ziel, Nutzen und wichtige Beteiligte bekannt sind. Sonst plant das Team möglicherweise viele Aufgaben für eine Lösung, die am eigentlichen Problem vorbeigeht.",
    },
  ],
  Q010: [
    {
      questionDe: "Warum reichen Gespräche in einem Meeting nicht aus?",
      answerDe:
        "Ein Meeting soll zu einem nachvollziehbaren Ergebnis führen. Ohne Entscheidung, verantwortliche Person und Termin weiß danach niemand, was passieren soll. Das gleiche Thema erscheint dann im nächsten Meeting erneut.",
    },
    {
      questionDe: "Wie sieht ein guter Action Log aus?",
      answerDe:
        "Eine einfache Zeile genügt: „Lisa prüft bis Freitag die Datenschutzanforderungen.“ Damit sind Aufgabe, verantwortliche Person und Termin sichtbar. Eine Agenda sorgt vorher dafür, dass die Gruppe über die richtigen Themen spricht.",
    },
  ],
  Q011: [
    {
      questionDe: "Was bedeutet „adaptive“ oder „agile“ Arbeitsweise?",
      answerDe:
        "Das Team entscheidet nicht jedes Detail am ersten Tag. Es baut zuerst einen kleinen nutzbaren Teil, zeigt ihn den Nutzern und verbessert die nächsten Schritte mit deren Rückmeldung. Bei einer App könnte zuerst nur die Terminanzeige entstehen, danach die Buchung und später die Erinnerungsfunktion.",
    },
    {
      questionDe: "Bedeutet agil, dass es keinen Plan gibt?",
      answerDe:
        "Nein. Es gibt einen Plan, aber er wird regelmäßig mit neuen Erkenntnissen angepasst. Die nächsten Wochen werden genauer geplant als weit entfernte Arbeiten. Das ist keine planlose Arbeit, sondern Lernen in kleinen Schritten.",
    },
  ],
  Q012: [
    {
      questionDe: "Warum geht es hier vor allem um Ehrlichkeit?",
      answerDe:
        "Die Führungskraft kennt eine Gefahr und verschweigt sie bewusst. Andere Personen können dadurch keine sichere Entscheidung treffen. Ehrlichkeit bedeutet hier, wichtige Tatsachen offen mitzuteilen, auch wenn dadurch der Termin schwieriger wird.",
    },
    {
      questionDe: "Was wäre ein verantwortungsvolles Verhalten?",
      answerDe:
        "Die Gefahr wird sofort beschrieben, ihre mögliche Wirkung wird geprüft und eine sichere Reaktion wird vereinbart. Beispiel: Ein bekanntes Sicherheitsproblem in einer App wird nicht versteckt, sondern vor der Veröffentlichung bewertet und behoben.",
    },
  ],
  Q013: [
    {
      questionDe: "Was bedeutet eine planbasierte Arbeitsweise?",
      answerDe:
        "Das Team beschreibt das gewünschte Ergebnis und den Weg dorthin möglichst früh und detailliert. Danach vergleicht es die tatsächliche Arbeit regelmäßig mit diesem Plan. Diese Arbeitsweise wird im CAPM-Kontext oft „predictive“ genannt.",
    },
    {
      questionDe: "Wann passt diese Arbeitsweise gut?",
      answerDe:
        "Wenn das Ergebnis gut bekannt ist und nur wenige Änderungen erwartet werden. Beispiel: Ein Unternehmen ersetzt 200 gleiche Lampen nach einem festgelegten technischen Standard. Material, Reihenfolge und Abnahme lassen sich früh planen.",
    },
  ],
  Q014: [
    {
      questionDe: "Was macht eine Work Breakdown Structure?",
      answerDe:
        "Sie zerlegt ein großes Projektergebnis in kleinere, überschaubare Teile. Beim Umzug eines Büros könnten die Hauptteile „Räume vorbereiten“, „Technik umziehen“ und „Mitarbeiter informieren“ heißen. Diese Teile werden weiter unterteilt, bis sie gut planbar sind.",
    },
    {
      questionDe: "Ist eine WBS dasselbe wie ein Terminplan?",
      answerDe:
        "Nein. Die WBS zeigt, welche Ergebnisse und Arbeitsbestandteile zum Projekt gehören. Erst danach kann das Team festlegen, wann und in welcher Reihenfolge diese Arbeiten stattfinden.",
    },
  ],
  Q015: [
    {
      questionDe: "Was bedeutet Finish-to-start?",
      answerDe:
        "Eine vorherige Tätigkeit muss vollständig fertig sein, bevor die nächste beginnen darf. Beispiel: Eine Wand muss fertig gestrichen sein, bevor die Schilder daran montiert werden.",
    },
    {
      questionDe: "Wie passt das zur Frage mit A, B und C?",
      answerDe:
        "C darf erst starten, wenn A und B beide beendet sind. Es gibt also zwei Ende-zu-Start-Abhängigkeiten: A vor C und B vor C. Wenn nur A fertig ist, muss C weiterhin auf B warten.",
    },
  ],
  Q016: [
    {
      questionDe: "Warum bestimmt der längste Weg die kürzeste Projektdauer?",
      answerDe:
        "Alle notwendigen Arbeitswege müssen fertig sein. Beispiel: Weg A dauert 7 Tage, Weg B dauert 10 Tage. Auch wenn A schon fertig ist, endet das Projekt frühestens nach 10 Tagen. Der längste notwendige Weg heißt Critical Path.",
    },
    {
      questionDe: "Ist der Critical Path einfach die schwierigste Arbeit?",
      answerDe:
        "Nein. Es geht nicht um Schwierigkeit, sondern um die gesamte Dauer miteinander verbundener Arbeiten. Viele einfache Aufgaben können zusammen den längsten Weg bilden. In der Prüfung werden deshalb Abhängigkeiten und Zeiten addiert.",
    },
  ],
  Q017: [
    {
      questionDe: "Was bedeutet Float?",
      answerDe:
        "Float ist ein Zeitpuffer. Eine Arbeit mit zwei Tagen Float darf sich normalerweise um zwei Tage verspäten, ohne den Endtermin des gesamten Projekts zu verschieben.",
    },
    {
      questionDe: "Warum ist der Puffer auf dem Critical Path normalerweise null?",
      answerDe:
        "Der Critical Path ist bereits der längste notwendige Arbeitsweg. Wenn eine Tätigkeit darauf einen Tag später endet, endet normalerweise auch das Projekt einen Tag später. Deshalb gibt es dort üblicherweise keinen freien Gesamtpuffer.",
    },
  ],
  Q018: [
    {
      questionDe: "Was sagen EV = 80 und AC = 100 in einfachen Worten?",
      answerDe:
        "Das Projekt hat 100 Geldeinheiten ausgegeben, aber erst Arbeit im geplanten Wert von 80 erledigt. Für jeden ausgegebenen Euro wurden also nur 80 Cent geplanter Arbeitswert erreicht.",
    },
    {
      questionDe: "Warum bedeutet CPI unter 1 eine schlechte Kostenlage?",
      answerDe:
        "CPI teilt den Wert der erledigten Arbeit durch die tatsächlichen Kosten: 80 ÷ 100 = 0,80. Ein Ergebnis unter 1 bedeutet, dass die bisher erledigte Arbeit mehr kostet als vorgesehen. Es ist ein Kostenhinweis, keine Aussage über den Termin.",
    },
  ],
  Q019: [
    {
      questionDe: "Was sagen EV = 90 und PV = 100 in einfachen Worten?",
      answerDe:
        "Bis heute sollte Arbeit im geplanten Wert von 100 fertig sein. Tatsächlich ist erst Arbeit im Wert von 90 fertig. Das Projekt hat also weniger geschafft als für diesen Zeitpunkt vorgesehen.",
    },
    {
      questionDe: "Warum bedeutet SPI unter 1 „hinter dem Plan“?",
      answerDe:
        "SPI vergleicht erledigte Arbeit mit geplanter Arbeit: 90 ÷ 100 = 0,90. Ein Wert unter 1 zeigt Rückstand. Er bedeutet aber nicht automatisch, dass das Projekt genau zehn Prozent mehr Kalendertage benötigt.",
    },
  ],
  Q020: [
    {
      questionDe: "Was ist der Unterschied zwischen Vorbeugung und Kontrolle?",
      answerDe:
        "Vorbeugung soll Fehler verhindern, bevor sie entstehen. Kontrolle sucht Fehler in einem bereits erstellten Ergebnis. Eine Schulung vor Arbeitsbeginn ist Vorbeugung; ein Test des fertigen Ergebnisses ist Kontrolle.",
    },
    {
      questionDe: "Warum ist eine bessere Checkliste Vorbeugung?",
      answerDe:
        "Die Checkliste wird verbessert, bevor die Arbeit beginnt. Sie erinnert das Team früh an wichtige Schritte und senkt damit die Wahrscheinlichkeit eines Fehlers. Fehler erst nach der Veröffentlichung zu zählen, kommt dagegen zu spät.",
    },
  ],
  Q021: [
    {
      questionDe: "Warum darf die Änderung nicht sofort umgesetzt werden?",
      answerDe:
        "Eine scheinbar kleine Änderung kann Termin, Kosten, Sicherheit oder andere Funktionen beeinflussen. Vor der Entscheidung muss das Team diese Folgen sichtbar machen. Erst dann kann eine verantwortliche Person zustimmen oder ablehnen.",
    },
    {
      questionDe: "Wie sieht das in einem Beispiel aus?",
      answerDe:
        "Ein Kunde wünscht kurz vor der Veröffentlichung eine zweite Sprache. Das Team prüft zusätzliche Übersetzung, Tests, Support und Terminwirkung. Diese gemeinsame Prüfung vor der Freigabe heißt Integrated Change Control.",
    },
  ],
  Q022: [
    {
      questionDe: "Was bedeutet Crashing?",
      answerDe:
        "Das Projekt versucht, wichtige zeitbestimmende Arbeiten durch zusätzliche Mittel schneller zu erledigen. Beispiel: Statt einer Person installieren zwei Personen die Geräte. Dadurch steigt meist der Preis.",
    },
    {
      questionDe: "Warum hilft zusätzliches Personal nicht bei jeder Tätigkeit?",
      answerDe:
        "Nur eine Verkürzung auf dem aktuell längsten Arbeitsweg kann den Endtermin direkt verkürzen. Außerdem lassen sich manche Arbeiten nicht sinnvoll aufteilen. Neun Personen können zum Beispiel eine notwendige eintägige behördliche Wartezeit nicht verkürzen.",
    },
  ],
  Q023: [
    {
      questionDe: "Was ist die Scope Baseline?",
      answerDe:
        "Sie ist die genehmigte Beschreibung dessen, was das Projekt liefern soll und wie dieses Ergebnis in kleinere Teile zerlegt wurde. Das Team nutzt sie später als Vergleich: Gehört eine neue Forderung zum vereinbarten Umfang oder ist sie eine Änderung?",
    },
    {
      questionDe: "Was bedeuten die drei Bestandteile?",
      answerDe:
        "Das Scope Statement beschreibt den vereinbarten Umfang. Die WBS zerlegt ihn in überschaubare Teile. Das WBS Dictionary erklärt diese Teile genauer, zum Beispiel Inhalt, Grenzen und Abnahmeregeln.",
    },
  ],
  Q024: [
    {
      questionDe: "Warum ist die Vereinbarung mit dem Lieferanten wichtig?",
      answerDe:
        "Dort steht, was geliefert werden muss und wann die Lieferung akzeptiert werden kann. Wenn bestellte Stühle eine vereinbarte Brandschutzklasse nicht erfüllen, lässt sich anhand der Vereinbarung prüfen, ob der Lieferant nachbessern muss.",
    },
    {
      questionDe: "Was sind Acceptance Criteria?",
      answerDe:
        "Das sind beobachtbare Bedingungen für die Annahme eines Ergebnisses. Beispiel: „Der Akku hält im normalen Betrieb mindestens acht Stunden.“ Ohne eine solche klare Bedingung lässt sich schwer entscheiden, ob die Lieferung korrekt ist.",
    },
  ],
  Q025: [
    {
      questionDe: "Was ist eine kurze Iteration?",
      answerDe:
        "Das Team arbeitet für einen kurzen festen Zeitraum an einem kleinen nutzbaren Teil. Danach zeigt es das Ergebnis und lernt daraus. Beispiel: Eine Termin-App zeigt nach zwei Wochen zuerst nur freie Zeiten, statt erst nach sechs Monaten die gesamte App zu präsentieren.",
    },
    {
      questionDe: "Warum senkt das das Risiko?",
      answerDe:
        "Fehler und falsche Vorstellungen werden früher sichtbar. Wenn Patienten die Terminanzeige nicht verstehen, kann das Team sie sofort verbessern. Bei einer einzigen großen Lieferung würde dieses Problem vielleicht erst nach Monaten auffallen.",
    },
  ],
  Q026: [
    {
      questionDe: "Was bedeutet „agile Denkweise“ ohne Fachsprache?",
      answerDe:
        "Das Team liefert früh etwas Nützliches, hört auf Rückmeldungen und verbessert den weiteren Weg. Es betrachtet eine sinnvolle Änderung nicht automatisch als Störung, sondern als neue Information.",
    },
    {
      questionDe: "Bedeutet das, dass jede Änderung angenommen werden muss?",
      answerDe:
        "Nein. Das Team prüft weiterhin Nutzen, Kosten und Risiken. Beispiel: Nutzer wünschen eine größere Schrift – das kann wertvoll sein. Ein Wunsch ohne erkennbaren Nutzen darf trotzdem abgelehnt oder später eingeplant werden.",
    },
  ],
  Q027: [
    {
      questionDe: "Was macht ein Product Owner?",
      answerDe:
        "Diese Person sorgt dafür, dass das Team zuerst an den Dingen mit dem größten Nutzen arbeitet. Sie ordnet die Liste der gewünschten Produktverbesserungen. Bei einer Essens-App könnte eine sichere Bezahlung wichtiger sein als neue Profilfarben.",
    },
    {
      questionDe: "Ist der Product Owner der Chef des Entwicklungsteams?",
      answerDe:
        "Nein. Der Product Owner entscheidet vor allem über Ziel, Nutzen und Reihenfolge. Die Developers entscheiden gemeinsam, wie sie die ausgewählte Arbeit technisch umsetzen.",
    },
  ],
  Q028: [
    {
      questionDe: "Was ist ein Scrum Master?",
      answerDe:
        "Das ist keine klassische Vorgesetztenrolle. Der Scrum Master hilft dem Team, gut zusammenzuarbeiten, Hindernisse sichtbar zu machen und die Arbeitsweise zu verbessern. Er ist eher Coach und Vermittler als Aufgabenverteiler.",
    },
    {
      questionDe: "Was wäre ein konkretes Hindernis?",
      answerDe:
        "Dem Team fehlt seit Tagen ein Testkonto. Der Scrum Master hilft, die zuständige Stelle zu finden, die Entscheidung zu beschleunigen und den Antragsweg für die Zukunft zu verbessern. Er muss nicht jedes Problem selbst lösen, sorgt aber dafür, dass es lösbar wird.",
    },
  ],
  Q029: [
    {
      questionDe: "Was passiert in einer Sprint Retrospective?",
      answerDe:
        "Das Team betrachtet seine eigene Zusammenarbeit. Es fragt: Was lief gut? Was hat uns gebremst? Was ändern wir im nächsten Arbeitsabschnitt? Beispiel: Zu viele gleichzeitig begonnene Aufgaben führten zu Wartezeiten, deshalb begrenzt das Team sie künftig.",
    },
    {
      questionDe: "Geht es dort hauptsächlich um das Produkt?",
      answerDe:
        "Nein. Das Produkt wird vor allem in einem anderen Termin gemeinsam mit wichtigen Beteiligten betrachtet. Die Retrospective konzentriert sich auf Menschen, Zusammenarbeit, Werkzeuge und Arbeitsabläufe.",
    },
  ],
  Q030: [
    {
      questionDe: "Was passiert im Sprint Review?",
      answerDe:
        "Das Team zeigt wichtigen Beteiligten, was tatsächlich fertig geworden ist. Gemeinsam wird geprüft, was sich im Umfeld geändert hat und was als Nächstes sinnvoll ist. Die Liste der kommenden Produktarbeiten kann danach angepasst werden.",
    },
    {
      questionDe: "Wie unterscheidet sich das vom täglichen Teamtreffen?",
      answerDe:
        "Das tägliche Treffen hilft den Developers, ihre Arbeit für die nächsten 24 Stunden abzustimmen. Im Sprint Review geht es dagegen um das fertige Produktergebnis und Rückmeldungen von Beteiligten wie Kunden oder Fachabteilungen.",
    },
  ],
  Q031: [
    {
      questionDe: "Was bedeutet Definition of Done?",
      answerDe:
        "Das ist eine gemeinsame Checkliste dafür, wann Arbeit wirklich als fertig gelten darf. Beispiel: Eine neue E-Mail-Funktion ist erst fertig, wenn sie programmiert, getestet, auf Sicherheit geprüft und dokumentiert wurde.",
    },
    {
      questionDe: "Warum reicht „bei mir funktioniert es“ nicht?",
      answerDe:
        "Ohne gemeinsame Regeln versteht jede Person „fertig“ anders. Eine Funktion könnte zwar auf einem Laptop laufen, aber noch ungeprüft oder nicht veröffentlichbar sein. Die Definition of Done schafft ein gemeinsames Qualitätsverständnis.",
    },
  ],
  Q032: [
    {
      questionDe: "Warum begrenzt Kanban gleichzeitig begonnene Arbeit?",
      answerDe:
        "Wenn zu viele Dinge gleichzeitig begonnen werden, wartet vieles halb fertig. Weniger parallele Arbeit hilft dem Team, Aufgaben wirklich abzuschließen. Wie an einer engen Kasse verbessert sich der Fluss, wenn nicht ständig neue Wagen in den Bereich geschoben werden.",
    },
    {
      questionDe: "Wie wird dadurch ein Engpass sichtbar?",
      answerDe:
        "Wenn sich vor dem Testen viele fertige Entwicklungen stapeln, ist das Testen wahrscheinlich der Engpass. Die Begrenzung verhindert weiteres Aufstauen und zeigt, wo das Team zuerst helfen oder den Ablauf verbessern sollte.",
    },
  ],
  Q033: [
    {
      questionDe: "Was bedeutet Velocity?",
      answerDe:
        "Sie beschreibt, wie viel geschätzte Arbeit ein bestimmtes Team in den letzten kurzen Arbeitsabschnitten fertiggestellt hat. Die Werte 24, 27 und 25 geben einen groben Hinweis, dass dieses Team demnächst vielleicht wieder ungefähr 25 Einheiten schafft.",
    },
    {
      questionDe: "Warum darf man damit keine Teams vergleichen?",
      answerDe:
        "Jedes Team schätzt mit seiner eigenen Skala. Fünf Punkte bei Team A können etwas völlig anderes bedeuten als fünf Punkte bei Team B. Velocity eignet sich für die kurzfristige Planung desselben Teams, nicht als Rangliste für Personen oder Teams.",
    },
  ],
  Q034: [
    {
      questionDe: "Was passiert beim Backlog Refinement?",
      answerDe:
        "Das Team schaut sich kommende Wünsche an, stellt Fragen und teilt zu große Wünsche in kleinere verständliche Teile. Beispiel: „Online bezahlen“ wird in Kartenzahlung, Bestätigung und Fehlerbehandlung zerlegt.",
    },
    {
      questionDe: "Werden dabei alle zukünftigen Arbeiten festgeschrieben?",
      answerDe:
        "Nein. Vor allem die wahrscheinlich bald benötigten Punkte werden genauer vorbereitet. Weiter entfernte Ideen dürfen noch grob bleiben, weil sich Bedürfnisse und Prioritäten ändern können.",
    },
  ],
  Q035: [
    {
      questionDe: "Was bedeutet Hybrid?",
      answerDe:
        "Hybrid verbindet eine früh festgelegte Planung mit schrittweisem Lernen. Manche Teile bleiben stabil, andere werden in kleinen Schritten verbessert. Das Team wählt also nicht zwangsläufig nur eine einzige Arbeitsweise.",
    },
    {
      questionDe: "Wie sieht ein hybrides Projekt aus?",
      answerDe:
        "Bei einer medizinischen App können gesetzliche Prüfungen und feste Freigabetermine früh geplant werden. Die Bedienoberfläche wird gleichzeitig in kleinen Versionen mit Patienten getestet und angepasst. Feste Kontrolle und flexible Entwicklung werden kombiniert.",
    },
  ],
  Q036: [
    {
      questionDe: "Was misst Cycle Time?",
      answerDe:
        "Sie misst die Zeit ab dem tatsächlichen Arbeitsbeginn an einer einzelnen Aufgabe bis zu ihrer Fertigstellung. Beginnt das Team am Montag mit einer Funktion und beendet sie am Donnerstag, beträgt die Cycle Time ungefähr vier Tage.",
    },
    {
      questionDe: "Zählt die Wartezeit vor dem Arbeitsbeginn mit?",
      answerDe:
        "Bei der Cycle Time normalerweise nicht. Liegt der Wunsch schon zwei Wochen auf einer Liste, bevor jemand beginnt, gehört diese vorherige Wartezeit zu einer umfassenderen Gesamtzeit, nicht zur reinen Bearbeitungszeit.",
    },
  ],
  Q037: [
    {
      questionDe: "Was macht Business Analysis in einfachen Worten?",
      answerDe:
        "Sie hilft, das wirkliche Problem und den gewünschten Nutzen zu verstehen, bevor eine Lösung gewählt wird. Es geht also nicht nur darum, Wünsche aufzuschreiben, sondern die benötigte Veränderung zu klären.",
    },
    {
      questionDe: "Wie sieht das in einem Beispiel aus?",
      answerDe:
        "Eine Klinik verlangt zunächst „eine neue App“. Gespräche zeigen aber, dass das eigentliche Problem lange Telefonwartezeiten sind. Nun kann das Team verschiedene Lösungen vergleichen und messen, ob die Wartezeit wirklich sinkt.",
    },
  ],
  Q038: [
    {
      questionDe: "Was bedeutet Job Shadowing?",
      answerDe:
        "Man beobachtet eine Person direkt bei ihrer normalen Arbeit. Statt nur zu fragen, wie eine Aufgabe funktioniert, sieht man die tatsächlichen Schritte, Unterbrechungen und Hilfsmittel.",
    },
    {
      questionDe: "Warum ist Beobachtung manchmal besser als ein Interview?",
      answerDe:
        "Menschen vergessen oft kleine, selbstverständliche Arbeitsschritte. Eine Empfangskraft erwähnt vielleicht nicht, dass sie Daten aus zwei Systemen vergleicht. Beim Beobachten wird dieser zusätzliche Schritt sichtbar.",
    },
  ],
  Q039: [
    {
      questionDe: "Was ist eine User Story?",
      answerDe:
        "Sie beschreibt kurz, wer etwas braucht, was diese Person erreichen will und warum. Beispiel: „Als Patient möchte ich eine Erinnerung erhalten, damit ich meinen Termin nicht verpasse.“",
    },
    {
      questionDe: "Was macht diese Beschreibung prüfbar?",
      answerDe:
        "Klare Abnahmebedingungen sagen, woran Erfolg erkennbar ist. Beispiel: „Die Erinnerung wird 24 Stunden vor dem Termin an die bestätigte Adresse gesendet.“ Nun kann das Team eindeutig testen, ob der Wunsch erfüllt ist.",
    },
  ],
  Q040: [
    {
      questionDe: "Was ist eine Requirements Traceability Matrix?",
      answerDe:
        "Das ist eine Verbindungsliste für Anforderungen. Sie zeigt, woher eine Anforderung kommt, welches Ergebnis sie umsetzt und welcher Test sie prüft. So kann das Team den Weg einer Anforderung vollständig verfolgen.",
    },
    {
      questionDe: "Wozu braucht man diese Verbindung?",
      answerDe:
        "Beispiel: Eine Datenschutzregel verlangt eine Einwilligung. Die Liste verbindet diese Regel mit dem Einwilligungsbildschirm und dem passenden Test. Ändert sich die Regel, sieht das Team sofort, welche Teile geprüft werden müssen.",
    },
  ],
  Q041: [
    {
      questionDe: "Was bedeutet MoSCoW?",
      answerDe:
        "Das ist eine Methode, Anforderungen nach Wichtigkeit zu gruppieren. Die Buchstaben stehen für Must have, Should have, Could have und Won’t have for now. Das erste M bedeutet also Must have.",
    },
    {
      questionDe: "Was ist ein echtes Must have?",
      answerDe:
        "Ohne dieses Merkmal ist die betrachtete Lieferung nicht sinnvoll oder nicht zulässig. Bei einer Bezahl-App ist eine sichere Zahlungsbestätigung ein Must have. Eine zusätzliche Farbauswahl könnte dagegen nur ein Could have sein.",
    },
  ],
  Q042: [
    {
      questionDe: "Wie kann ich Verification und Validation einfach unterscheiden?",
      answerDe:
        "Verification fragt: Haben wir es entsprechend der Beschreibung gebaut? Validation fragt: Hilft das Gebaute wirklich den Nutzern? Kurz gesagt: richtig gebaut versus das Richtige gebaut.",
    },
    {
      questionDe: "Wie sieht der Unterschied bei einer Termin-App aus?",
      answerDe:
        "Ein Test bestätigt, dass nach der Buchung eine E-Mail gesendet wird: Das ist Verification. Patienten schaffen es trotzdem nicht, den gewünschten Termin zu buchen: Dann ist die Validation fehlgeschlagen, weil die Lösung den echten Bedarf nicht erfüllt.",
    },
  ],
  Q043: [
    {
      questionDe: "Was zeigt eine Product Roadmap?",
      answerDe:
        "Sie zeigt die grobe Richtung eines Produkts über einen längeren Zeitraum. Sie verbindet gewünschte Ergebnisse mit größeren Themen oder geplanten Veröffentlichungen. Sie ist keine tägliche Aufgabenliste.",
    },
    {
      questionDe: "Wie könnte eine einfache Roadmap aussehen?",
      answerDe:
        "Frühjahr: Buchung ohne Telefon ermöglichen. Sommer: weniger verpasste Termine durch Erinnerungen. Herbst: Familienbuchungen unterstützen. Die Roadmap erklärt vor allem, welche Verbesserung wann angestrebt wird.",
    },
  ],
  Q044: [
    {
      questionDe: "Wie kann eine Funktion alle Tests bestehen und trotzdem scheitern?",
      answerDe:
        "Tests können nur prüfen, was vorher als Bedingung festgelegt wurde. Wenn die Bedingungen am echten Nutzerproblem vorbeigehen, ist die Funktion technisch korrekt, aber praktisch nutzlos.",
    },
    {
      questionDe: "Was ist hier mit Validation gemeint?",
      answerDe:
        "Validation prüft, ob die Lösung den tatsächlichen Bedarf erfüllt. Beispiel: Alle Schaltflächen einer Buchungs-App funktionieren, aber ältere Patienten finden den Startknopf nicht. Die Technik funktioniert, die gewünschte Veränderung aber nicht.",
    },
  ],
  Q045: [
    {
      questionDe: "Was bedeutet Elicitation?",
      answerDe:
        "Damit ist das gezielte Gewinnen von Bedürfnissen, Wissen und Anforderungen gemeint. Das Team erfährt nicht automatisch alles aus einem Dokument, sondern spricht und arbeitet mit den betroffenen Personen.",
    },
    {
      questionDe: "Wann nutzt man Interview und Workshop?",
      answerDe:
        "Ein Interview eignet sich für ein ausführliches Gespräch mit einer Person, zum Beispiel einer Ärztin. Ein Workshop bringt mehrere Sichtweisen zusammen, zum Beispiel Ärzte, Empfang und Datenschutz, damit Unterschiede direkt geklärt werden.",
    },
  ],
  Q046: [
    {
      questionDe: "Warum darf eine genehmigte Anforderung nicht still überschrieben werden?",
      answerDe:
        "Sonst ist später nicht mehr sichtbar, was geändert wurde, wer zugestimmt hat und welche Folgen geprüft wurden. Das kann Tests, Kosten und bereits entwickelte Funktionen unbemerkt falsch machen.",
    },
    {
      questionDe: "Wie behandelt man die Änderung richtig?",
      answerDe:
        "Das Team beschreibt die neue Forderung, prüft Auswirkungen, holt die notwendige Zustimmung ein und aktualisiert die Verbindungen zu Lösung und Tests. Erst danach wird umgesetzt. So bleibt die Entscheidung nachvollziehbar.",
    },
  ],
  Q047: [
    {
      questionDe: "Was sind beobachtbare Acceptance Criteria?",
      answerDe:
        "Es sind Bedingungen, die man eindeutig prüfen kann. „Die Seite ist benutzerfreundlich“ ist zu unklar. „Ein Patient kann einen freien Termin auswählen und erhält innerhalb einer Minute eine Bestätigung“ ist beobachtbar.",
    },
    {
      questionDe: "Warum sind klare Bedingungen so wichtig?",
      answerDe:
        "Ohne klare Bedingungen können zwei Personen zu unterschiedlichen Urteilen kommen. Messbare oder sichtbar prüfbare Aussagen machen Annahme, Test und spätere Fehlersuche nachvollziehbar.",
    },
  ],
  Q048: [
    {
      questionDe: "Warum sollte man nicht sofort eine Lösung auswählen?",
      answerDe:
        "Wenn die Beteiligten unterschiedliche Probleme sehen, löst eine schnelle Lösung vielleicht nur die Sicht einer Person. Zuerst müssen Bedürfnisse, Ursachen und betroffene Abläufe gemeinsam verstanden werden.",
    },
    {
      questionDe: "Wie schafft man ein gemeinsames Verständnis?",
      answerDe:
        "Die Business-Analyse kann die Beteiligten in einem Gespräch oder Workshop zusammenbringen. Beispiel: Patienten, Empfang und Ärzte beschreiben gemeinsam den heutigen Buchungsweg, markieren Probleme und einigen sich darauf, welches Ergebnis verbessert werden soll.",
    },
  ],
};
