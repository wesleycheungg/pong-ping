/**
 * Returns the current win or loss streak for a player.
 * Looks at matches sorted by date (newest first) and counts
 * consecutive wins or losses from the most recent match.
 *
 * Returns: { type: 'win' | 'loss' | 'none', count: number }
 */
export function getStreak(playerName, matches) {
  const playerMatches = [...matches]
    .filter(m => m.winner === playerName || m.loser === playerName)
    .sort((a, b) => b.date - a.date);

  if (playerMatches.length === 0) return { type: 'none', count: 0 };

  const first = playerMatches[0];
  const streakType = first.winner === playerName ? 'win' : 'loss';
  let count = 0;

  for (const match of playerMatches) {
    const won = match.winner === playerName;
    if ((streakType === 'win' && won) || (streakType === 'loss' && !won)) {
      count++;
    } else {
      break;
    }
  }

  return { type: streakType, count };
}

/**
 * Returns the best upset win for a player — the match where they
 * beat the highest-rated opponent (based on opponent's pre-match Elo).
 *
 * Returns a match object with an added `opponentEloBefore` field, or null.
 */
export function getBestWin(playerName, matches) {
  const wins = matches.filter(m => m.winner === playerName);
  if (wins.length === 0) return null;

  // Opponent's pre-match Elo = loserElo + gain
  return wins.reduce((best, match) => {
    const opponentElo = match.loserElo + match.gain;
    const bestOpponentElo = best.loserElo + best.gain;
    return opponentElo > bestOpponentElo ? match : best;
  });
}

/**
 * Builds an array of { date, elo, matchNum } data points for a player
 * to power the Elo history line chart.
 * Starts at 1000 and applies each match result in chronological order.
 */
export function getEloHistory(playerName, matches) {
  const playerMatches = [...matches]
    .filter(m => m.winner === playerName || m.loser === playerName)
    .sort((a, b) => a.date - b.date);

  const history = [{ matchNum: 0, elo: 1000, label: 'Start' }];

  playerMatches.forEach((m, i) => {
    const elo = m.winner === playerName ? m.winnerElo : m.loserElo;
    const opponent = m.winner === playerName ? m.loser : m.winner;
    history.push({
      matchNum: i + 1,
      elo,
      label: new Date(m.date).toLocaleDateString(),
      opponent,
      result: m.winner === playerName ? 'W' : 'L',
    });
  });

  return history;
}