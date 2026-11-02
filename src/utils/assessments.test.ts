import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRIASEC, TALENTS_QUESTIONS } from './talentsCalculator';
import { calculateVARK, VARK_QUESTIONS } from './learningStyleCalculator';
import { calculateMentalHealth, MENTAL_HEALTH_QUESTIONS } from './mentalHealthCalculator';

test('RIASEC has exactly 50 questions and computes top categories', () => {
  assert.equal(TALENTS_QUESTIONS.length, 50);
  const result = calculateRIASEC({});
  assert.equal(result.topCategories.length, 3);
  assert.ok(result.recommendedMajors.length > 0);
});

test('VARK has exactly 50 questions and identifies dominant learning style', () => {
  assert.equal(VARK_QUESTIONS.length, 50);
  const answers: Record<number, number> = {};
  VARK_QUESTIONS.forEach((q) => {
    answers[q.id] = q.category === 'V' ? 5 : 1;
  });
  const result = calculateVARK(answers);
  assert.equal(result.dominantStyle, 'Visual');
  assert.ok(result.strategies.length > 0);
});

test('Mental Health assessment has 100 questions and computes wellness tier', () => {
  assert.equal(MENTAL_HEALTH_QUESTIONS.length, 100);
  const answers: Record<number, number> = {};
  MENTAL_HEALTH_QUESTIONS.forEach((q) => {
    answers[q.id] = q.isReverseScored ? 5 : 1; // best possible scores
  });
  const result = calculateMentalHealth(answers);
  assert.equal(result.statusTier, 'Sejahtera Optimal');
  assert.ok(result.overallScore >= 95);
});
