import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../api/orders';

const statuses = ['qəbul edildi', 'hazırlanır', 'hazırdır', 'çatdırıldı', 'ləğv edildi'];

function OrdersAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAllOrders()
      .then(setItems)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    setItems((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await updateOrderStatus(id, status);
  };

  return (
    <div>
      <h1 className="text-[24px] font-display font-semibold mb-6">Sifarişlər</h1>

      {loading ? (
        <p className="text-muted">Yüklənir...</p>
      ) : items.length === 0 ? (
        <p className="text-muted">Hələ sifariş yoxdur.</p>
      ) : (
        <div className="bg-white rounded-[18px] shadow-[0_14px_28px_-22px_rgba(36,21,18,.3)] overflow-hidden">
          {items.map((o) => (
            <div key={o.id} className="flex items-center gap-4 p-4 border-b border-ink/[0.06] last:border-0 flex-wrap">
              <div className="flex-1 min-w-[180px]">
                <div className="font-semibold text-[14.5px]">
                  #{o.id} — {o.customer_name}
                </div>
                <div className="text-muted text-[13px]">
                  {o.phone} {o.table_number ? `· Masa ${o.table_number}` : ''}
                </div>
              </div>
              <div className="text-[14.5px] font-semibold text-maroon">{Number(o.total).toFixed(2)} ₼</div>
              <select
                value={o.status}
                onChange={(e) => handleStatusChange(o.id, e.target.value)}
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

export default OrdersAdmin;
