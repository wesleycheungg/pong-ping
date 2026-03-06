const TABS = [
  ["board",   "🏆 Rankings"],
  ["history", "📜 History"],
  ["add",     "➕ Players"],
];

export default function Tabs({ active, onChange }) {
  return (
    <div className="tabs">
      {TABS.map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`tab-btn ${active === key ? "tab-active" : ""}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}