import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/db.js', () => ({ default: {} }));
const { adherencePercent, weekRange } = await import('../src/services/adherence.service.js');

describe('adherencePercent (US-08)', () => {
  it('rounds to a whole percentage (2 of 3 = 67 %)', () => {
    expect(adherencePercent(2, 3)).toBe(67);
  });

  it('is at most 100 % when more workouts are logged than planned', () => {
    expect(adherencePercent(5, 3)).toBe(100);
  });

  it('is 0 % when nothing is logged', () => {
    expect(adherencePercent(0, 4)).toBe(0);
  });

  it('is null when the plan has no training days', () => {
    expect(adherencePercent(2, 0)).toBeNull();
  });
});

describe('weekRange', () => {
  it('returns Monday to Sunday of the week that contains the date', () => {
    const { start, end } = weekRange(new Date('2026-11-19T00:00:00Z')); // Thursday
    expect(start.toISOString().slice(0, 10)).toBe('2026-11-16');
    expect(end.toISOString().slice(0, 10)).toBe('2026-11-22');
  });

  it('treats Sunday as the last day of the week', () => {
    const { start } = weekRange(new Date('2026-11-22T00:00:00Z')); // Sunday
    expect(start.toISOString().slice(0, 10)).toBe('2026-11-16');
  });
});
