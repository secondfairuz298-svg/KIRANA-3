import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMBTI, MBTI_QUESTIONS } from './mbtiCalculator';

test('MBTI 100 questions exist and are correctly divided into 4 dimensions', () => {
  assert.equal(MBTI_QUESTIONS.length, 100);
  const ei = MBTI_QUESTIONS.filter((q) => q.dimension === 'EI');
  const sn = MBTI_QUESTIONS.filter((q) => q.dimension === 'SN');
  const tf = MBTI_QUESTIONS.filter((q) => q.dimension === 'TF');
  const jp = MBTI_QUESTIONS.filter((q) => q.dimension === 'JP');

  assert.equal(ei.length, 25);
  assert.equal(sn.length, 25);
  assert.equal(tf.length, 25);
  assert.equal(jp.length, 25);
});

test('MBTI calculation correctly identifies INFJ with specific positive/negative responses', () => {
  const answers: Record<number, number> = {};
  MBTI_QUESTIONS.forEach((q) => {
    // We want Introvert (I), Intuitive (N), Feeling (F), Judging (J)
    if (q.dimension === 'EI') {
      answers[q.id] = q.direction === 'positive' ? 1 : 5; // drives toward I
    } else if (q.dimension === 'SN') {
      answers[q.id] = q.direction === 'positive' ? 1 : 5; // drives toward N
    } else if (q.dimension === 'TF') {
      answers[q.id] = q.direction === 'positive' ? 1 : 5; // drives toward F
    } else if (q.dimension === 'JP') {
      answers[q.id] = q.direction === 'positive' ? 5 : 1; // drives toward J
    }
  });

  const result = calculateMBTI(answers);
  assert.equal(result.code, 'INFJ');
  assert.equal(result.dimensions.EI.dominant, 'I');
  assert.equal(result.dimensions.SN.dominant, 'N');
  assert.equal(result.dimensions.TF.dominant, 'F');
  assert.equal(result.dimensions.JP.dominant, 'J');
  assert.ok(result.strengths.length > 0);
  assert.ok(result.growthAreas.length > 0);
});

test('MBTI calculation defaults cleanly when answers are empty or neutral', () => {
  const result = calculateMBTI({});
  assert.equal(typeof result.code, 'string');
  assert.equal(result.code.length, 4);
});
