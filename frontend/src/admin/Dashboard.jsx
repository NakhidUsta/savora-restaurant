import { useEffect, useState } from 'react';
import { getStats } from '../api/admin';

const cards = [
  { key: 'menuItems', label: 'Menyu elementi' },
  { key: 'reservations', label: 'Rezervasiya' },
  { key: 'orders', label: 'Sifariş' },
  { key: 'pendingReviews', label: 'Təsdiq gözləyən rəy' },
  { key: 'messages', label: 'Əlaqə mesajı' },
];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-[24px] font-display font-semibold mb-6">Dashboard</h1>

      {loading && <p className="text-muted">Yüklənir...</p>}

      {!loading && stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((c) => (
            <div key={c.key} className="bg-white rounded-[18px] p-5 shadow-[0_14px_28px_-22px_rgba(36,21,18,.3)]">
              <div className="text-[26px] font-display font-semibold text-maroon">{stats[c.key]}</div>
              <div className="text-[13px] text-muted mt-1">{c.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
