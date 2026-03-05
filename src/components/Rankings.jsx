import { getRank } from '../utils/elo';
import { getStreak } from '../utils/stats';

export default function Rankings({ players, matches, onSelectPlayer }) {
  const sorted = [...players].sort((a, b) => b.elo - a.elo);

  return (
    <div className="rankings-grid">
      {sorted.length === 0 && (
        <div className="empty-state">No players yet. Add some friends!</div>
      )}
      {sorted.map((p, i) => {
        const rank    = getRank(p.elo);
        const total   = p.wins + p.losses;
        const winRate = total > 0 ? Math.round((p.wins / total) * 100) : 0;
        const isTop   = i === 0;
        const streak  = getStreak(p.name, matches);

        const streakBadge = streak.count >= 2
          ? `${streak.type === 'win' ? '🔥' : '🥶'} ${streak.count}`
          : null;

        return (
          <div
            key={p.id}
            className={`player-card ${isTop ? 'player-card-top' : ''}`}
            onClick={() => onSelectPlayer(p)}
            style={{ cursor: 'pointer' }}
          >
            <div className="rank-num" style={{ color: isTop ? '#FFD700' : 'rgba(255,255,255,0.2)', fontSize: isTop ? 28 : 22 }}>
              {i === 0 ? '👑' : i + 1}
            </div>
            <div className="avatar" style={{
              background: `linear-gradient(135deg, ${rank.color}33, ${rank.color}11)`,
              border: `2px solid ${rank.color}55`,
              color: rank.color,
            }}>
              {p.name[0].toUpperCase()}
            </div>
            <div className="player-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="player-name">{p.name}</div>
                {streakBadge && (
                  <div style={{
                    fontSize: 11, fontWeight: 700,
                    background: streak.type === 'win' ? 'rgba(152,217,142,0.15)' : 'rgba(244,162,97,0.15)',
                    color: streak.type === 'win' ? '#98D98E' : '#F4A261',
                    padding: '2px 7px', borderRadius: 20, whiteSpace: 'nowrap',
                  }}>
                    {streakBadge}
                  </div>
                )}
              </div>
              <div className="player-rank" style={{ color: rank.color }}>{rank.label}</div>
            </div>
            <div className="player-stats">
              <div className="elo-num">{p.elo}</div>
              <div className="wl">{p.wins}W {p.losses}L · {winRate}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
