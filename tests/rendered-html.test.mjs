import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { questions, sources, units } from "../app/data.ts";
import {
  MOCK_BLUEPRINT,
  MOCK_EXAM_SIZE,
  selectMockExamQuestions,
} from "../app/exam.ts";
import {
  calculateReadiness,
  getAnswerStats,
  initialProgress,
  upsertAnswerAttempt,
} from "../app/progress.ts";
import { overviewCourse, studyGuides } from "../app/study.ts";

test("covers the public CAPM domain map with an original bilingual bank", () => {
  assert.equal(units.length, 4);
  assert.deepEqual(units.map((unit) => unit.weight), [36, 17, 20, 27]);
  assert.equal(questions.length, 48);
  assert.equal(new Set(questions.map((question) => question.id)).size, 48);

  for (const unit of units) {
    assert.equal(
      questions.filter((question) => question.unit === unit.id).length,
      12,
    );
  }

  for (const question of questions) {
    assert.ok(question.prompt.length > 20);
    assert.ok(question.explanationDe.length > 20);
    assert.ok(question.correct.length >= 1);
    assert.ok(
      question.correct.every(
        (answer) => Number.isInteger(answer) && answer >= 0 && answer < question.options.length,
      ),
    );
    assert.equal(question.points, question.kind === "multiple" ? 2 : 1);
  }
});

test("builds a smaller weighted mock from a larger bank", () => {
  const selected = selectMockExamQuestions(questions, () => 0.42);
  assert.equal(selected.length, MOCK_EXAM_SIZE);
  assert.equal(new Set(selected.map((question) => question.id)).size, MOCK_EXAM_SIZE);
  for (const [unit, count] of Object.entries(MOCK_BLUEPRINT)) {
    assert.equal(
      selected.filter((question) => question.unit === Number(unit)).length,
      count,
    );
  }
});

test("does not overstate readiness after a small number of answers", () => {
  const first = questions[0];
  const at = new Date("2026-07-26T00:00:00.000Z").toISOString();
  const once = upsertAnswerAttempt(
    undefined,
    first.correct,
    true,
    "high",
    at,
  );
  const progress = {
    ...initialProgress,
    answered: { [first.id]: once },
  };
  const readiness = calculateReadiness(progress, questions.length, units.length);
  assert.ok(readiness.total < 5);
  assert.equal(getAnswerStats(once).consecutiveCorrect, 1);

  const twice = upsertAnswerAttempt(
    once,
    first.correct,
    true,
    "high",
    new Date("2026-07-31T00:00:00.000Z").toISOString(),
  );
  assert.equal(getAnswerStats(twice).consecutiveCorrect, 2);
});

test("ships overview and detailed courses with transparent public-source boundaries", async () => {
  assert.equal(overviewCourse.journey.length, 6);
  assert.equal(studyGuides.length, 4);
  assert.ok(studyGuides.every((guide) => guide.terms.length >= 6));
  assert.ok(sources.some((source) => source.id === "capm-eco"));
  assert.ok(sources.some((source) => source.id === "scrum-guide"));

  const [page, layout, hosting, migration, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0000_productive_peter_quill.sql", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /No ChatGPT login/);
  assert.match(page, /COURSE 1/);
  assert.match(page, /COURSE 02/);
  assert.match(layout, /CAPM Baby/);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(page, /codex-preview|SkeletonPreview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.equal(JSON.parse(hosting).d1, "DB");
  assert.match(migration, /CREATE TABLE `progress_documents`/);
});
