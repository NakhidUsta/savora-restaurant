import { useEffect, useState } from 'react';
import { getAllReservations, updateReservationStatus } from '../api/reservations';

const statuses = ['gözləyir', 'təsdiqləndi', 'ləğv edildi'];

function ReservationsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAllReservations()
      .then(setItems)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await updateReservationStatus(id, status);
  };

  return (
    <div>
      <h1 className="text-[24px] font-display font-semibold mb-6">Rezervasiyalar</h1>

      {loading ? (
        <p className="text-muted">Yüklənir...</p>
      ) : items.length === 0 ? (
        <p className="text-muted">Hələ rezervasiya yoxdur.</p>
      ) : (
        <div className="bg-white rounded-[18px] shadow-[0_14px_28px_-22px_rgba(36,21,18,.3)] overflow-hidden">
          {items.map((r) => (
            <div key={r.id} className="flex items-center gap-4 p-4 border-b border-ink/[0.06] last:border-0 flex-wrap">
              <div className="flex-1 min-w-[180px]">
                <div className="font-semibold text-[14.5px]">{r.name}</div>
                <div className="text-muted text-[13px]">{r.phone}</div>
              </div>
              <div className="text-[13.5px] text-ink">
                {new Date(r.date).toLocaleDateString('az-AZ')} ·{' '}
                {new Date(r.time).toISOString().slice(11, 16)} · {r.guests} nəfər
              </div>
              <select
                value={r.status}
                onChange={(e) => handleStatusChange(r.id, e.target.value)}
                className="border border-ink/15 rounded-full px-3 py-1.5 text-[13px] outline-none bg-white"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReservationsAdmin;
