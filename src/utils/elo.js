export const DEFAULT_ELO = 1000;
const K_FACTOR = 32;

export function calcElo(winnerRating, loserRating) {
  const expectedWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const gainAmount = K_FACTOR * (1 - expectedWinner);
  const winnerGain = Math.max(1, Math.round(gainAmount));
  return {
    newWinner: Math.round(winnerRating + gainAmount),
    newLoser: Math.round(loserRating - gainAmount),
    winnerGain: winnerGain,
  };
}

export function getRank(elo) {
  if (elo >= 1400) return { label: "GRAND MASTER", color: "#FFD700" };
  if (elo >= 1250) return { label: "MASTER",       color: "#E0E0FF" };
  if (elo >= 1100) return { label: "EXPERT",       color: "#7EC8E3" };
  if (elo >= 950)  return { label: "PLAYER",       color: "#98D98E" };
  return             { label: "ROOKIE",        color: "#F4A261" };
}