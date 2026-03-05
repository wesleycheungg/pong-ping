export default function History({ matches }) {
  return (
    <div>
      <div className="section-title">MATCH HISTORY</div>

      {matches.length === 0 && (
        <div className="empty-state">No matches yet.</div>
      )}

      <div className="history-grid">
        {matches.map(m => (
          <div key={m.id} className="history-card">
            <div className="history-names">
              <span style={{ color: '#FFD700', fontWeight: 700 }}>{m.winner}</span>
              <span className="beat-text">beat</span>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>{m.loser}</span>

              {/* Score badge */}
              {m.winnerScore != null && m.loserScore != null && (
                <span style={{
                  marginLeft: 8,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6, padding: '1px 7px',
                  fontSize: 12, fontFamily: "'Bebas Neue', cursive",
                  letterSpacing: 1, color: 'rgba(255,255,255,0.5)',
                  whiteSpace: 'nowrap',
                }}>
                  {m.winnerScore}–{m.loserScore}
                </span>
              )}
            </div>

            <div className="history-meta">
              <div style={{ color: '#7EC8E3', fontSize: 12, fontWeight: 600 }}>+{m.gain} ELO</div>
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
                {new Date(m.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
