import { useState } from "react";
import { calcElo } from "../utils/elo";

export default function LogMatch({ players, onSubmit }) {
  const [winner, setWinner]         = useState("");
  const [loser, setLoser]           = useState("");
  const [loserScore, setLoserScore] = useState("");

  function handleSubmit() {
    if (!winner || !loser) return;
    const score = loserScore !== "" ? parseInt(loserScore) : null;
    onSubmit(winner, loser, score);
    setWinner("");
    setLoser("");
    setLoserScore("");
  }

  const previewGain = winner && loser
    ? calcElo(
        players.find(p => p.name === winner)?.elo,
        players.find(p => p.name === loser)?.elo
      ).winnerGain
    : null;

  const scoreValid = loserScore === "" || (
    Number.isInteger(Number(loserScore)) &&
    Number(loserScore) >= 0 &&
    Number(loserScore) <= 10
  );

  return (
    <div className="panel">
      <div className="panel-title">LOG A MATCH</div>

      {players.length < 2 ? (
        <div className="panel-empty">Add at least 2 players first.</div>
      ) : (
        <>
          {/* Winner / Loser selects */}
          <div className="vs-grid">
            <div>
              <div className="select-label">WINNER 🏆</div>
              <select value={winner} onChange={e => setWinner(e.target.value)} className="select">
                <option value="">Select...</option>
                {players.filter(p => p.name !== loser).map(p => (
                  <option key={p.id} value={p.name}>{p.name} ({p.elo})</option>
                ))}
              </select>
            </div>
            <div className="vs-divider">VS</div>
            <div>
              <div className="select-label">LOSER 💀</div>
              <select value={loser} onChange={e => setLoser(e.target.value)} className="select">
                <option value="">Select...</option>
                {players.filter(p => p.name !== winner).map(p => (
                  <option key={p.id} value={p.name}>{p.name} ({p.elo})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Score input — only visible once both players selected */}
          {winner && loser && (
            <div style={{ marginBottom: 20 }}>
              <div className="select-label" style={{ marginBottom: 8 }}>FINAL SCORE</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Winner score — always 11 */}
                <div style={{
                  flex: 1, padding: '12px 14px', borderRadius: 10,
                  background: 'rgba(152,217,142,0.08)',
                  border: '1px solid rgba(152,217,142,0.25)',
                  color: '#98D98E', fontFamily: "'Bebas Neue', cursive",
                  fontSize: 28, textAlign: 'center', letterSpacing: 2,
                }}>
                  11
                </div>
                <div style={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontSize: 20, color: 'rgba(255,255,255,0.2)',
                }}>–</div>
                {/* Loser score input */}
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={loserScore}
                  onChange={e => setLoserScore(e.target.value)}
                  placeholder="?"
                  style={{
                    flex: 1, padding: '12px 14px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.07)',
                    border: `1px solid ${scoreValid ? 'rgba(255,255,255,0.12)' : 'rgba(244,162,97,0.5)'}`,
                    color: '#f0f0f0', fontFamily: "'Bebas Neue', cursive",
                    fontSize: 28, textAlign: 'center', outline: 'none',
                    letterSpacing: 2,
                    MozAppearance: 'textfield',
                  }}
                />
              </div>
              {!scoreValid && (
                <div style={{ color: '#F4A261', fontSize: 11, marginTop: 6 }}>
                  Loser score must be between 0 and 10
                </div>
              )}
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 6 }}>
                Leave blank if you don't want to record the score
              </div>
            </div>
          )}

          {/* Elo preview */}
          {previewGain !== null && (
            <div className="preview">
              Preview: <span style={{ color: '#FFD700' }}>{winner}</span> gains{" "}
              <span style={{ color: '#7EC8E3' }}>+{previewGain}</span> ELO ·{" "}
              <span style={{ color: '#F4A261' }}>{loser}</span> loses{" "}
              <span style={{ color: '#F4A261' }}>-{previewGain}</span> ELO
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!winner || !loser || !scoreValid}
            className={`submit-btn ${winner && loser && scoreValid ? 'submit-btn-active' : ''}`}
          >
            SUBMIT MATCH
          </button>
        </>
      )}
    </div>
  );
}
