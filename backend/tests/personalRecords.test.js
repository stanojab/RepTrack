import { describe, it, expect, vi, beforeEach } from 'vitest';

const aggregate = vi.fn();
vi.mock('../src/db.js', () => ({ default: { loggedSet: { aggregate } } }));
const { markPersonalRecords } = await import('../src/services/workout.service.js');

const best = (weightKg) => ({ _max: { weightKg } });

describe('markPersonalRecords (US-07)', () => {
  beforeEach(() => aggregate.mockReset());

  it('marks a set heavier than every earlier set of the exercise', async () => {
    aggregate.mockResolvedValue(best(50));
    const [set] = await markPersonalRecords(1, [{ exerciseId: 1, weightKg: 55 }]);
    expect(set.isPersonalRecord).toBe(true);
  });

  it('does not mark a set with the same weight as the previous best', async () => {
    aggregate.mockResolvedValue(best(50));
    const [set] = await markPersonalRecords(1, [{ exerciseId: 1, weightKg: 50 }]);
    expect(set.isPersonalRecord).toBe(false);
  });

  it('does not mark the first time an exercise is done', async () => {
    aggregate.mockResolvedValue(best(null));
    const [set] = await markPersonalRecords(1, [{ exerciseId: 1, weightKg: 80 }]);
    expect(set.isPersonalRecord).toBe(false);
  });

  it('compares with earlier sets in the same workout', async () => {
    aggregate.mockResolvedValue(best(50));
    const sets = await markPersonalRecords(1, [
      { exerciseId: 1, weightKg: 55 },
      { exerciseId: 1, weightKg: 55 },
      { exerciseId: 1, weightKg: 60 },
    ]);
    expect(sets.map((s) => s.isPersonalRecord)).toEqual([true, false, true]);
  });
});
