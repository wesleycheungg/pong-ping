import { getRank } from '../utils/elo';
import { getStreak } from '../utils/stats';

export default function Rankings({ players, matches, onSelectPlayer, onLogMatch }) {
  const sorted = [...players].sort((a, b) => b.elo - a.elo);

  return (
    <div>
      {/* Header row with Log Match button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 20, letterSpacing: 4, color: 'rgba(255,255,255,0.3)' }}>
          {players.length} PLAYER{players.length !== 1 ? 'S' : ''}
        </div>
        <button onClick={onLogMatch} className="log-match-btn">
          ⚔️ Log Match
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">No players yet. Add some friends!</div>
      ) : (
        <div className="table-wrapper">
          <table className="rankings-table">
            <thead>
              <tr>
                <th style={{ width: 48 }}>#</th>
                <th style={{ textAlign: 'left' }}>PLAYER</th>
                <th>ELO</th>
                <th>W</th>
                <th>L</th>
                <th>WIN %</th>
                <th>STREAK</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => {
                const rank    = getRank(p.elo);
                const total   = p.wins + p.losses;
                const winRate = total > 0 ? Math.round((p.wins / total) * 100) : 0;
                const isTop   = i === 0;
                const streak  = getStreak(p.name, matches);

                const streakDisplay = streak.count >= 2
                  ? `${streak.type === 'win' ? '🔥' : '🥶'} ${streak.count}`
                  : '–';

                return (
                  <tr key={p.id} className={isTop ? 'row-top' : ''}>
                    <td className="td-rank">{isTop ? '👑' : i + 1}</td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                          background: `linear-gradient(135deg, ${rank.color}33, ${rank.color}11)`,
                          border: `2px solid ${rank.color}55`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 700, color: rank.color,
                        }}>
                          {p.name[0].toUpperCase()}
                        </div>
                        <div>
                          <button onClick={() => onSelectPlayer(p)} className="name-btn">
                            {p.name}
                          </button>
                          <div style={{ fontSize: 10, letterSpacing: 1.5, color: rank.color, fontWeight: 600, marginTop: 1 }}>
                            {rank.label}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="td-elo" style={{ color: isTop ? '#FFD700' : '#f0f0f0' }}>{p.elo}</td>
                    <td style={{ color: '#98D98E', fontWeight: 600 }}>{p.wins}</td>
                    <td style={{ color: '#F4A261', fontWeight: 600 }}>{p.losses}</td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, borderRadius: 2, maxWidth: 60, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: 2, width: `${winRate}%`,
                            background: winRate >= 60 ? '#98D98E' : winRate >= 40 ? '#FFD700' : '#F4A261',
                            transition: 'width 0.4s ease',
                          }} />
                        </div>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', minWidth: 32 }}>{winRate}%</span>
                      </div>
                    </td>

                    <td style={{ fontSize: 13, color: streak.type === 'win' ? '#98D98E' : streak.type === 'loss' ? '#F4A261' : 'rgba(255,255,255,0.2)' }}>
                      {streakDisplay}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}