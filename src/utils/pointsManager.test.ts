import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStudentPoints } from './pointsManager';

test('Points calculation correctly increments positive points', () => {
  const result = calculateStudentPoints({
    currentPoints: 80,
    delta: 15,
    reason: 'Kuis Gamifikasi Teman Sebaya',
  });

  assert.equal(result.newPoints, 95);
  assert.equal(result.isAlert, false);
  assert.equal(result.statusBadge.colorScheme, 'green');
});

test('Points calculation triggers alert when points drop drastically by 20 or more', () => {
  const result = calculateStudentPoints({
    currentPoints: 85,
    delta: -25,
    reason: 'Keterlambatan berturut-turut tanpa keterangan',
  });

  assert.equal(result.newPoints, 60);
  assert.equal(result.isAlert, true);
  assert.ok(result.alertMessage?.includes('penurunan poin signifikan'));
});

test('Points calculation triggers high alert when total falls below 60', () => {
  const result = calculateStudentPoints({
    currentPoints: 60,
    delta: -15,
    reason: 'Pelanggaran tata tertib',
  });

  assert.equal(result.newPoints, 45);
  assert.equal(result.isAlert, true);
  assert.equal(result.statusBadge.colorScheme, 'red');
});
