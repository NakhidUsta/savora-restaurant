import { useEffect, useState } from 'react';
import Button from '../components/Button';
import ReviewCard from '../components/ReviewCard';
import { getReviews, createReview } from '../api/reviews';

function StarInput({ value, onChange }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} ulduz`}
          className={`text-2xl leading-none ${n <= value ? 'text-brick' : 'text-ink/20'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [form, setForm] = useState({ name: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const loadReviews = () => {
    setLoading(true);
    getReviews()
      .then(setReviews)
      .catch(() => setLoadError('Rəylər yüklənə bilmədi'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!form.name.trim() || !form.comment.trim()) {
      setSubmitError('Ad və rəy mətni tələb olunur');
      return;
    }

    setSubmitting(true);
    try {
      await createReview(form);
      setSubmitted(true);
      setForm({ name: '', rating: 5, comment: '' });
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Rəy göndərilərkən xəta baş verdi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="pt-[50px] pb-16">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="text-center max-w-[520px] mx-auto mb-11">
            <div className="text-[13px] text-brick font-semibold mb-2.5">Rəylər</div>
            <h1 className="text-[26px] sm:text-[34px] font-display font-semibold mb-2.5">
              Qonaqlarımızın fikri
            </h1>
            <p className="text-muted text-[15px] leading-[1.6]">
              1200-dən çox qonağımızın gerçək təəssüratlarından bir neçəsi.
            </p>
          </div>

          {loading && <p className="text-center text-muted">Yüklənir...</p>}
          {loadError && <p className="text-center text-brick">{loadError}</p>}
          {!loading && !loadError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-[600px] mx-auto px-8">
          <div className="bg-white rounded-[20px] shadow-[0_18px_34px_-28px_rgba(36,21,18,.3)] p-8">
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-blush text-brick text-2xl flex items-center justify-center mx-auto mb-4">
                  ✓
                </div>
                <h2 className="text-[19px] font-display font-semibold mb-2">Təşəkkür edirik!</h2>
                <p className="text-muted mb-6">Rəyiniz göndərildi, təsdiqdən sonra saytda görünəcək.</p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Başqa rəy yaz
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-[19px] font-display font-semibold mb-5">Rəyinizi bölüşün</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Adınız"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="border border-ink/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-maroon"
                  />
                  <div>
                    <div className="text-[13px] text-muted mb-2">Reytinqiniz</div>
                    <StarInput value={form.rating} onChange={(n) => setForm((p) => ({ ...p, rating: n }))} />
                  </div>
                  <textarea
                    placeholder="Təəssüratınızı yazın..."
                    rows={4}
                    value={form.comment}
                    onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
                    className="border border-ink/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-maroon resize-none"
                  />

                  {submitError && <p className="text-brick text-[13.5px]">{submitError}</p>}

                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'Göndərilir...' : 'Rəyi göndər'}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Reviews;
