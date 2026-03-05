import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the entire firebase/firestore module
vi.mock('firebase/firestore', () => ({
  getFirestore:  vi.fn(() => ({})),
  collection:    vi.fn(),
  doc:           vi.fn(),
  addDoc:        vi.fn(() => Promise.resolve({ id: 'mock-id' })),
  setDoc:        vi.fn(() => Promise.resolve()),
  deleteDoc:     vi.fn(() => Promise.resolve()),
  onSnapshot:    vi.fn(() => vi.fn()), // returns unsubscribe fn
  query:         vi.fn(),
  orderBy:       vi.fn(),
  limit:         vi.fn(),
}));

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

import { addDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { calcElo, DEFAULT_ELO } from '../utils/elo';

// We test the Firebase logic in isolation by reproducing
// the handler functions from App.jsx and verifying the calls.

const mockPlayers = [
  { id: 'p1', name: 'Alice', elo: 1000, wins: 5, losses: 3 },
  { id: 'p2', name: 'Bob',   elo: 1200, wins: 8, losses: 2 },
];

// Simulates handleAddPlayer from App.jsx
async function handleAddPlayer(players, name, db) {
  if (players.find(p => p.name.toLowerCase() === name.toLowerCase())) {
    throw new Error('Player already exists');
  }
  return addDoc({ db }, { name, elo: DEFAULT_ELO, wins: 0, losses: 0 });
}

// Simulates handleLogMatch from App.jsx
async function handleLogMatch(players, winnerName, loserName, db) {
  const w = players.find(p => p.name === winnerName);
  const l = players.find(p => p.name === loserName);
  if (!w || !l) throw new Error('Player not found');
  const { newWinner, newLoser, winnerGain } = calcElo(w.elo, l.elo);
  await setDoc({ db, id: w.id }, { ...w, elo: newWinner, wins: w.wins + 1 });
  await setDoc({ db, id: l.id }, { ...l, elo: newLoser, losses: l.losses + 1 });
  await addDoc({ db }, { winner: winnerName, loser: loserName, gain: winnerGain, date: Date.now() });
  return winnerGain;
}

// Simulates handleDeletePlayer from App.jsx
async function handleDeletePlayer(player, confirmed, db) {
  if (!confirmed) return false;
  await deleteDoc({ db, id: player.id });
  return true;
}

describe('Firebase: addPlayer', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls addDoc with correct default values', async () => {
    await handleAddPlayer([], 'Wesley', {});
    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'Wesley', elo: DEFAULT_ELO, wins: 0, losses: 0 })
    );
  });

  it('throws if player already exists', async () => {
    await expect(handleAddPlayer(mockPlayers, 'Alice', {})).rejects.toThrow('Player already exists');
  });

  it('is case-insensitive for duplicate check', async () => {
    await expect(handleAddPlayer(mockPlayers, 'alice', {})).rejects.toThrow('Player already exists');
  });

  it('does not call addDoc when player already exists', async () => {
    try { await handleAddPlayer(mockPlayers, 'Alice', {}); } catch (_) {}
    expect(addDoc).not.toHaveBeenCalled();
  });
});

describe('Firebase: logMatch', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls setDoc twice (winner + loser updates)', async () => {
    await handleLogMatch(mockPlayers, 'Alice', 'Bob', {});
    expect(setDoc).toHaveBeenCalledTimes(2);
  });

  it('calls addDoc once to record the match', async () => {
    await handleLogMatch(mockPlayers, 'Alice', 'Bob', {});
    expect(addDoc).toHaveBeenCalledTimes(1);
  });

  it('increments winner wins by 1', async () => {
    await handleLogMatch(mockPlayers, 'Alice', 'Bob', {});
    expect(setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'Alice', wins: 6 })
    );
  });

  it('increments loser losses by 1', async () => {
    await handleLogMatch(mockPlayers, 'Alice', 'Bob', {});
    expect(setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'Bob', losses: 3 })
    );
  });

  it('records correct winner and loser names in match doc', async () => {
    await handleLogMatch(mockPlayers, 'Alice', 'Bob', {});
    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ winner: 'Alice', loser: 'Bob' })
    );
  });

  it('throws if a player is not found', async () => {
    await expect(handleLogMatch(mockPlayers, 'Alice', 'Nobody', {})).rejects.toThrow('Player not found');
  });
});

describe('Firebase: deletePlayer', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls deleteDoc when confirmed', async () => {
    await handleDeletePlayer(mockPlayers[0], true, {});
    expect(deleteDoc).toHaveBeenCalledTimes(1);
  });

  it('does not call deleteDoc when not confirmed', async () => {
    await handleDeletePlayer(mockPlayers[0], false, {});
    expect(deleteDoc).not.toHaveBeenCalled();
  });

  it('returns true when deletion proceeds', async () => {
    const result = await handleDeletePlayer(mockPlayers[0], true, {});
    expect(result).toBe(true);
  });

  it('returns false when cancelled', async () => {
    const result = await handleDeletePlayer(mockPlayers[0], false, {});
    expect(result).toBe(false);
  });
});
