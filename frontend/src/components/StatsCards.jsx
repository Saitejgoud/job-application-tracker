const ORDER = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

export default function StatsCards({ stats }) {
  return (
    <div className="stats">
      {ORDER.map((s) => (
        <div key={s} className={`stat stat-${s.toLowerCase()}`}>
          <div className="stat-number">{stats[s] ?? 0}</div>
          <div className="stat-label">{s}</div>
        </div>
      ))}
    </div>
  );
}
