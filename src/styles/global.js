const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    width: 100%;
    min-height: 100vh;
    background: #0a0a0f;
  }

  .app {
    width: 100%;
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'Inter', sans-serif;
    color: #f0f0f0;
    position: relative;
  }

  .bg-gradient {
    position: fixed; inset: 0; z-index: 0;
    background:
      radial-gradient(ellipse at 15% 15%, #1a1a2e 0%, transparent 55%),
      radial-gradient(ellipse at 85% 85%, #0d1b1e 0%, transparent 55%);
    pointer-events: none;
  }

  .container {
    position: relative; z-index: 1;
    width: 100%; max-width: 1200px;
    margin: 0 auto; padding: 0 24px 80px;
  }

  .loading-screen {
    width: 100vw; height: 100vh; background: #0a0a0f;
    display: flex; align-items: center; justify-content: center;
  }
  .loading-text {
    color: #FFD700; font-family: 'Bebas Neue', cursive;
    font-size: 32px; letter-spacing: 4px;
  }

  /* Header */
  .header { text-align: center; padding: 48px 0 32px; }
  .header-icon { font-size: 48px; margin-bottom: 8px; }
  .header-title {
    font-family: 'Bebas Neue', cursive;
    font-size: clamp(40px, 7vw, 72px); letter-spacing: 6px;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    line-height: 1;
  }
  .header-sub {
    font-family: 'Bebas Neue', cursive;
    font-size: clamp(14px, 3vw, 20px); letter-spacing: 8px;
    color: rgba(255,255,255,0.3); margin-top: 6px;
  }

  /* Flash */
  .flash {
    position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
    background: #FFD700; color: #0a0a0f;
    padding: 10px 24px; border-radius: 40px;
    font-weight: 700; font-size: 15px; letter-spacing: 1px;
    z-index: 999; white-space: nowrap;
    box-shadow: 0 4px 30px rgba(255,215,0,0.4);
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  /* Tabs */
  .tabs {
    display: flex; gap: 4px; margin-bottom: 28px;
    background: rgba(255,255,255,0.04);
    border-radius: 12px; padding: 4px; width: 100%;
  }
  .tab-btn {
    flex: 1; padding: 10px 4px; border: none; border-radius: 8px;
    cursor: pointer; font-size: clamp(11px, 2vw, 13px);
    font-weight: 600; letter-spacing: 0.5px;
    background: transparent; color: rgba(255,255,255,0.4);
    border-bottom: 2px solid transparent; transition: all 0.2s; white-space: nowrap;
  }
  .tab-active {
    background: rgba(255,215,0,0.15) !important;
    color: #FFD700 !important;
    border-bottom: 2px solid #FFD700 !important;
  }

  /* Rankings */
  .rankings-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .empty-state {
    text-align: center; color: rgba(255,255,255,0.2);
    padding: 60px 0; font-size: 15px; grid-column: 1/-1;
  }
  .player-card {
    display: flex; align-items: center; gap: 16px;
    padding: 18px 20px; border-radius: 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    transition: transform 0.15s;
  }
  .player-card:hover { transform: translateY(-1px); }
  .player-card-top {
    background: linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,140,0,0.06)) !important;
    border: 1px solid rgba(255,215,0,0.25) !important;
  }
  .rank-num { width: 36px; text-align: center; font-family: 'Bebas Neue', cursive; flex-shrink: 0; }
  .avatar {
    width: 44px; height: 44px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 700; flex-shrink: 0;
  }
  .player-info { flex: 1; min-width: 0; }
  .player-name { font-weight: 700; font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .player-rank { font-size: 10px; letter-spacing: 2px; margin-top: 2px; font-weight: 600; }
  .player-stats { text-align: right; flex-shrink: 0; }
  .elo-num { font-family: 'Bebas Neue', cursive; font-size: 26px; color: #FFD700; line-height: 1; }
  .wl { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 2px; }

  /* Panel */
  .panel {
    background: rgba(255,255,255,0.04); border-radius: 16px; padding: 40px;
    border: 1px solid rgba(255,255,255,0.08); max-width: 700px; margin: 0 auto;
  }
  .panel-title { font-family: 'Bebas Neue', cursive; font-size: 22px; letter-spacing: 4px; margin-bottom: 24px; color: #FFD700; }
  .panel-empty { color: rgba(255,255,255,0.3); font-size: 14px; }

  /* VS grid */
  .vs-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 24px; }
  .vs-divider { font-family: 'Bebas Neue', cursive; font-size: 24px; color: rgba(255,255,255,0.2); text-align: center; }
  .select-label { font-size: 11px; letter-spacing: 2px; color: rgba(255,255,255,0.35); margin-bottom: 8px; }
  .select {
    width: 100%; padding: 12px 14px; border-radius: 10px;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
    color: #f0f0f0; font-size: 14px; outline: none; cursor: pointer;
  }
  .select option { background: #1a1a2e; }
  .preview {
    background: rgba(255,215,0,0.06); border: 1px solid rgba(255,215,0,0.15);
    border-radius: 10px; padding: 12px 16px; margin-bottom: 20px;
    font-size: 13px; color: rgba(255,255,255,0.5);
  }
  .submit-btn {
    width: 100%; padding: 14px; border: none; border-radius: 10px;
    background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.2);
    font-weight: 800; font-size: 15px; letter-spacing: 1px; cursor: default; transition: all 0.2s;
  }
  .submit-btn-active {
    background: linear-gradient(135deg, #FFD700, #FFA500) !important;
    color: #0a0a0f !important; cursor: pointer !important;
  }

  /* History */
  .section-title { font-family: 'Bebas Neue', cursive; font-size: 22px; letter-spacing: 4px; margin-bottom: 20px; color: #FFD700; }
  .history-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 360px), 1fr));
    gap: 8px;
  }
  .history-card {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; border-radius: 12px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); gap: 12px;
  }
  .history-names { font-size: 13px; }
  .beat-text { color: rgba(255,255,255,0.3); margin: 0 8px; }
  .history-meta { text-align: right; flex-shrink: 0; }

  /* Add player */
  .add-row { display: flex; gap: 10px; }
  .text-input {
    flex: 1; padding: 12px 16px; border-radius: 10px;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
    color: #f0f0f0; font-size: 15px; outline: none;
  }
  .text-input::placeholder { color: rgba(255,255,255,0.25); }
  .add-btn {
    padding: 12px 22px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #0a0a0f; font-weight: 800; font-size: 14px; cursor: pointer;
  }
  .player-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 14px; border-radius: 8px; margin-bottom: 6px;
    background: rgba(255,255,255,0.04);
  }
  .delete-btn { background: none; border: none; color: rgba(255,80,80,0.5); cursor: pointer; font-size: 18px; line-height: 1; padding: 0; }
  .delete-btn:hover { color: rgba(255,80,80,0.9); }

  /* Responsive */
  @media (max-width: 600px) {
    .container { padding: 0 16px 80px; }
    .panel { padding: 24px 18px; }
    .header { padding: 32px 0 24px; }
    .vs-grid { grid-template-columns: 1fr; gap: 8px; }
    .vs-divider { display: none; }
    .tab-btn { font-size: 10px; padding: 8px 2px; }
  }
  @media (min-width: 601px) and (max-width: 900px) {
    .container { padding: 0 20px 80px; }
    .panel { padding: 32px 24px; }
  }
`;

export default globalStyles;