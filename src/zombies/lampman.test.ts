// The Lamp Man's relocation cadence (DESIGN §8.5), pinned against the hatch's
// five-shift toll. User bug 2026-08-07: cranking the hatch at shift 4 jumped
// the counter to 9, and the old `shift % 7 === 0` test simply never saw 7 —
// the Lamp Man was skipped for the whole run.

import { describe, expect, it } from 'vitest';
import { TUNING } from '../tuning';
import { lampManDue } from './specials';

const EVERY = TUNING.specials.lampman.everyShifts;

describe('lampManDue (the lamp relocates every Nth shift)', () => {
  it('fires on the multiples when the clock walks one shift at a time', () => {
    const fired: number[] = [];
    for (let s = 1; s <= 30; s++) if (lampManDue(s - 1, s, EVERY)) fired.push(s);
    expect(fired).toEqual([EVERY, EVERY * 2, EVERY * 3, EVERY * 4]);
  });

  it('a jump that steps OVER a multiple still fires it (the hatch toll)', () => {
    expect(lampManDue(4, 9, EVERY)).toBe(true); // the reported run: 4 → 9 crosses 7
    expect(lampManDue(1, 6, EVERY)).toBe(false); // 1 → 6 crosses nothing
    expect(lampManDue(EVERY, EVERY + 5, EVERY)).toBe(false); // already had him at 7
  });

  it('a jump that crosses two multiples still relocates him exactly once', () => {
    expect(lampManDue(6, 20, EVERY)).toBe(true); // one call, one lamp — never two alive
  });

  it('the pre-game grace (shift 0) never summons him', () => {
    expect(lampManDue(-1, 0, EVERY)).toBe(false);
    expect(lampManDue(0, 1, EVERY)).toBe(false);
  });
});
