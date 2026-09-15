import { useEffect, useState } from 'react';
import { getAllReviews, updateReviewStatus, deleteReview } from '../api/reviews';

function ReviewsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAllReviews()
      .then(setItems)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleApprove = async (id, is_approved) => {
    await updateReviewStatus(id, is_approved);
    load();
  };

  const handleReject = async (id) => {
    if (!window.confirm('Bu rəyi rədd edib silmək istədiyinizə əminsiniz?')) return;
    await deleteReview(id);
    load();
  };

  return (
    <div>
      <h1 className="text-[24px] font-display font-semibold mb-6">Rəylər</h1>

      {loading ? (
        <p className="text-muted">Yüklənir...</p>
      ) : (
        <div className="bg-white rounded-[18px] shadow-[0_14px_28px_-22px_rgba(36,21,18,.3)] overflow-hidden">
          {items.map((r) => (
            <div key={r.id} className="p-4 border-b border-ink/[0.06] last:border-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-[14.5px]">{r.name}</span>
                <span className="text-brick text-[13px]">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="text-muted text-[13.5px] mb-3">{r.comment}</p>
              <div className="flex items-center gap-3">
                <span
                  className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${
                    r.is_approved ? 'bg-blush text-brick' : 'bg-ink/5 text-muted'
                  }`}
                >
                  {r.is_approved ? 'Təsdiqlənib' : 'Gözləyir'}
                </span>
                {!r.is_approved && (
                  <button
                    type="button"
                    onClick={() => handleApprove(r.id, true)}
                    className="text-[13.5px] font-semibold text-maroon"
                  >
                    Təsdiqlə
                  </button>
                )}
                {r.is_approved && (
                  <button
                    type="button"
                    onClick={() => handleApprove(r.id, false)}
                    className="text-[13.5px] font-semibold text-muted"
                  >
                    Təsdiqi geri al
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleReject(r.id)}
                  className="text-[13.5px] font-semibold text-brick"
                >
                  Rədd et / Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsAdmin;
