import { useState } from "react";
import { calcElo } from "../utils/elo";

export default function LogMatch({ players, onSubmit }) {
  const [winner, setWinner] = useState("");
  const [loser, setLoser] = useState("");

  function handleSubmit() {
    if (!winner || !loser) return;
    onSubmit(winner, loser);
    setWinner("");
    setLoser("");
  }

  const previewGain = winner && loser
    ? calcElo(
        players.find(p => p.name === winner)?.elo,
        players.find(p => p.name === loser)?.elo
      ).winnerGain
    : null;

  return (
    <div className="panel">
      <div className="panel-title">LOG A MATCH</div>

      {players.length < 2 ? (
        <div className="panel-empty">Add at least 2 players first.</div>
      ) : (
        <>
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

          {previewGain !== null && (
            <div className="preview">
              Preview: <span style={{ color: "#FFD700" }}>{winner}</span> gains{" "}
              <span style={{ color: "#7EC8E3" }}>+{previewGain}</span> ELO ·{" "}
              <span style={{ color: "#F4A261" }}>{loser}</span> loses{" "}
              <span style={{ color: "#F4A261" }}>-{previewGain}</span> ELO
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!winner || !loser}
            className={`submit-btn ${winner && loser ? "submit-btn-active" : ""}`}
          >
            SUBMIT MATCH
          </button>
        </>
      )}
    </div>
  );
}
