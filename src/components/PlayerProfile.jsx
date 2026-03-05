import { getRank } from '../utils/elo';
import { getStreak, getBestWin, getEloHistory } from '../utils/stats';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

// ── Custom tooltip for the chart ─────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: '#1a1a2e', border: '1px solid rgba(255,215,0,0.3)',
      borderRadius: 8, padding: '10px 14px', fontSize: 12,
    }}>
      {d.matchNum === 0 ? (
        <div style={{ color: 'rgba(255,255,255,0.5)' }}>Starting Elo</div>
      ) : (
        <>
          <div style={{ color: d.result === 'W' ? '#98D98E' : '#F4A261', fontWeight: 700, marginBottom: 4 }}>
            {d.result === 'W' ? '✓ Win' : '✗ Loss'} vs {d.opponent}
          </div>
          <div style={{ color: '#FFD700', fontWeight: 700 }}>Elo: {d.elo}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{d.label}</div>
        </>
      )}
    </div>
  );
}

// ── Stat card ────────────────────────────────────────────────
function StatCard({ label, value, sub, color = '#FFD700' }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12, padding: '16px 20px', flex: 1, minWidth: 120,
    }}>
      <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────
export default function PlayerProfile({ player, matches, allPlayers, onClose }) {
  const rank        = getRank(player.elo);
  const streak      = getStreak(player.name, matches);
  const bestWin     = getBestWin(player.name, matches);
  const eloHistory  = getEloHistory(player.name, matches);

  const total     = player.wins + player.losses;
  const winRate   = total > 0 ? Math.round((player.wins / total) * 100) : 0;
  const eloChange = eloHistory.length > 1
    ? player.elo - 1000
    : 0;

  const streakEmoji = streak.type === 'win'  ? '🔥'
                    : streak.type === 'loss' ? '🥶'
                    : '–';
  const streakLabel = streak.type === 'none'
    ? 'No matches yet'
    : `${streak.count} ${streak.type === 'win' ? 'win' : 'loss'} streak`;

  const bestWinOpponentElo = bestWin ? bestWin.loserElo + bestWin.gain : null;
  const bestWinUpset       = bestWin ? bestWinOpponentElo - (bestWin.winnerElo - bestWin.gain) : null;

  // Chart Y-axis domain with some padding
  const eloValues  = eloHistory.map(d => d.elo);
  const minElo     = Math.min(...eloValues) - 30;
  const maxElo     = Math.max(...eloValues) + 30;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px 16px',
      backdropFilter: 'blur(6px)',
    }} onClick={onClose}>
      <div style={{
        background: '#0f0f1a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20, width: '100%', maxWidth: 680,
        maxHeight: '90vh', overflowY: 'auto',
        padding: '32px 28px',
      }} onClick={e => e.stopPropagation()}>

        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 20,
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.3)', fontSize: 24,
          cursor: 'pointer', lineHeight: 1,
        }}>×</button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${rank.color}44, ${rank.color}11)`,
            border: `2px solid ${rank.color}66`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 700, color: rank.color,
          }}>
            {player.name[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 22 }}>{player.name}</div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: rank.color, marginTop: 3, fontWeight: 600 }}>
              {rank.label}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{
              fontFamily: "'Bebas Neue', cursive", fontSize: 40,
              color: '#FFD700', lineHeight: 1,
            }}>{player.elo}</div>
            <div style={{
              fontSize: 12, marginTop: 2,
              color: eloChange >= 0 ? '#98D98E' : '#F4A261',
              fontWeight: 600,
            }}>
              {eloChange >= 0 ? '+' : ''}{eloChange} from start
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
          <StatCard label="WIN RATE"  value={`${winRate}%`}  sub={`${player.wins}W – ${player.losses}L`} />
          <StatCard label="STREAK"    value={streakEmoji}     sub={streakLabel} color={streak.type === 'win' ? '#98D98E' : streak.type === 'loss' ? '#F4A261' : '#888'} />
          <StatCard label="MATCHES"   value={total}           sub="played" />
        </div>

        {/* Best win */}
        {bestWin && (
          <div style={{
            background: 'rgba(255,215,0,0.06)',
            border: '1px solid rgba(255,215,0,0.15)',
            borderRadius: 12, padding: '14px 18px', marginBottom: 28,
          }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>
              🏆 BEST WIN
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 15 }}>vs {bestWin.loser}</span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginLeft: 10 }}>
                  {new Date(bestWin.date).toLocaleDateString()}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#FFD700', fontFamily: "'Bebas Neue', cursive", fontSize: 18 }}>
                  Opponent was {bestWinOpponentElo} ELO
                </div>
                {bestWinUpset > 0 && (
                  <div style={{ fontSize: 11, color: '#98D98E' }}>
                    +{bestWinUpset} ELO underdog upset
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Elo history chart */}
        <div>
          <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
            ELO HISTORY
          </div>
          {eloHistory.length <= 1 ? (
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, textAlign: 'center', padding: '30px 0' }}>
              No matches played yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={eloHistory} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="matchNum"
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                  label={{ value: 'Match #', position: 'insideBottom', offset: -2, fill: 'rgba(255,255,255,0.2)', fontSize: 11 }}
                />
                <YAxis
                  domain={[minElo, maxElo]}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={1000} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                <Line
                  type="monotone"
                  dataKey="elo"
                  stroke="#FFD700"
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    if (payload.matchNum === 0) return null;
                    const color = payload.result === 'W' ? '#98D98E' : '#F4A261';
                    return <circle key={payload.matchNum} cx={cx} cy={cy} r={4} fill={color} stroke="#0f0f1a" strokeWidth={2} />;
                  }}
                  activeDot={{ r: 6, fill: '#FFD700' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
          <div style={{ display: 'flex', gap: 16, marginTop: 10, justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#98D98E' }} /> Win
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F4A261' }} /> Loss
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
