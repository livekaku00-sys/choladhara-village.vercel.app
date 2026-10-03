import { describe, expect, it } from 'vitest';
import { daysLeftLabel, daysUntil, formatDate, localDateString } from './dates';

describe('dates', () => {
  const now = new Date(2026, 9, 3, 23, 30); // 3 Oct 2026, 11:30 PM local

  it('uses the local calendar date', () => {
    expect(localDateString(now)).toBe('2026-10-03');
  });

  it('counts whole days from today', () => {
    expect(daysUntil('2026-10-03', now)).toBe(0);
    expect(daysUntil('2026-10-04', now)).toBe(1);
    expect(daysUntil('2026-10-31', now)).toBe(28);
    expect(daysUntil('2026-10-02', now)).toBe(-1);
  });

  it('labels days left in both languages', () => {
    expect(daysLeftLabel(0, false)).toBe('Last day today');
    expect(daysLeftLabel(1, false)).toBe('1 day left');
    expect(daysLeftLabel(5, false)).toBe('5 days left');
    expect(daysLeftLabel(0, true)).toBe('আজি শেষ দিন');
    expect(daysLeftLabel(5, true)).toBe('5 দিন বাকী');
  });

  it('formats dates for display', () => {
    expect(formatDate('2026-10-31', false)).toBe('31 Oct 2026');
    expect(formatDate('2026-10-05', true)).toBe('৫ অক্টোবৰ ২০২৬');
    expect(formatDate('not a date', false)).toBe('not a date');
  });
});
