import { useState } from "react";

export default function AddPlayers({ players, onAdd, onDelete }) {
  const [newName, setNewName] = useState("");

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    onAdd(name);
    setNewName("");
  }

  return (
    <div className="panel">
      <div className="panel-title">ADD A PLAYER</div>

      <div className="add-row">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          placeholder="Player name..."
          className="text-input"
        />
        <button onClick={handleAdd} className="add-btn">ADD</button>
      </div>

      {players.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div className="select-label" style={{ marginBottom: 14 }}>CURRENT PLAYERS</div>
          {players.map(p => (
            <div key={p.id} className="player-row">
              <span style={{ fontWeight: 600 }}>{p.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                  {p.wins}W {p.losses}L · {p.elo} ELO
                </span>
                <button onClick={() => onDelete(p)} className="delete-btn">×</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
