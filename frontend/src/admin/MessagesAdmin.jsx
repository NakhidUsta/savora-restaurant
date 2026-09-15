import { useEffect, useState } from 'react';
import { getAllMessages, deleteMessage } from '../api/contact';

function MessagesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAllMessages()
      .then(setItems)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bu mesajı silmək istədiyinizə əminsiniz?')) return;
    await deleteMessage(id);
    load();
  };

  return (
    <div>
      <h1 className="text-[24px] font-display font-semibold mb-6">Əlaqə mesajları</h1>

      {loading ? (
        <p className="text-muted">Yüklənir...</p>
      ) : items.length === 0 ? (
        <p className="text-muted">Hələ mesaj yoxdur.</p>
      ) : (
        <div className="bg-white rounded-[18px] shadow-[0_14px_28px_-22px_rgba(36,21,18,.3)] overflow-hidden">
          {items.map((m) => (
            <div key={m.id} className="p-4 border-b border-ink/[0.06] last:border-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-[14.5px]">{m.name}</span>
                <button
                  type="button"
                  onClick={() => handleDelete(m.id)}
                  className="text-[13px] font-semibold text-brick"
                >
                  Sil
                </button>
              </div>
              <div className="text-muted text-[13px] mb-2">{m.email}</div>
              <p className="text-[13.5px]">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessagesAdmin;
