import { describe, it, expect } from 'vitest';
import { calcElo, getRank, DEFAULT_ELO } from '../utils/elo';

describe('DEFAULT_ELO', () => {
  it('should be 1000', () => {
    expect(DEFAULT_ELO).toBe(1000);
  });
});

describe('calcElo', () => {
  it('winner gains points and loser loses points', () => {
    const { newWinner, newLoser } = calcElo(1000, 1000);
    expect(newWinner).toBeGreaterThan(1000);
    expect(newLoser).toBeLessThan(1000);
  });

  it('points are conserved (zero-sum)', () => {
    const { newWinner, newLoser } = calcElo(1000, 1000);
    expect(newWinner + newLoser).toBe(2000);
  });

  it('beating a higher-rated player gives more points', () => {
    const { winnerGain: gainVsHigher } = calcElo(1000, 1400);
    const { winnerGain: gainVsLower  } = calcElo(1000, 600);
    expect(gainVsHigher).toBeGreaterThan(gainVsLower);
  });

  it('beating a much lower-rated player gives very few points', () => {
    const { winnerGain } = calcElo(1400, 600);
    expect(winnerGain).toBeLessThan(5);
  });

  it('winnerGain is always positive', () => {
    const cases = [[1000, 1000], [1500, 500], [500, 1500]];
    cases.forEach(([w, l]) => {
      const { winnerGain } = calcElo(w, l);
      expect(winnerGain).toBeGreaterThan(0);
    });
  });

  it('returns rounded integers', () => {
    const { newWinner, newLoser, winnerGain } = calcElo(1000, 1000);
    expect(Number.isInteger(newWinner)).toBe(true);
    expect(Number.isInteger(newLoser)).toBe(true);
    expect(Number.isInteger(winnerGain)).toBe(true);
  });

  it('equal players each gain/lose ~16 points', () => {
    const { winnerGain } = calcElo(1000, 1000);
    expect(winnerGain).toBe(16);
  });
});

describe('getRank', () => {
  it('returns ROOKIE for elo below 950', () => {
    expect(getRank(800).label).toBe('ROOKIE');
    expect(getRank(949).label).toBe('ROOKIE');
  });

  it('returns PLAYER for elo 950–1099', () => {
    expect(getRank(950).label).toBe('PLAYER');
    expect(getRank(1000).label).toBe('PLAYER');
    expect(getRank(1099).label).toBe('PLAYER');
  });

  it('returns EXPERT for elo 1100–1249', () => {
    expect(getRank(1100).label).toBe('EXPERT');
    expect(getRank(1200).label).toBe('EXPERT');
  });

  it('returns MASTER for elo 1250–1399', () => {
    expect(getRank(1250).label).toBe('MASTER');
    expect(getRank(1300).label).toBe('MASTER');
  });

  it('returns GRAND MASTER for elo 1400+', () => {
    expect(getRank(1400).label).toBe('GRAND MASTER');
    expect(getRank(2000).label).toBe('GRAND MASTER');
  });

  it('always returns a color string', () => {
    [800, 1000, 1100, 1250, 1400].forEach(elo => {
      expect(getRank(elo).color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });
});
