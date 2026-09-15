import { useEffect, useState } from 'react';
import Button from './Button';
import { useReservation } from '../context/ReservationContext';
import { createReservation } from '../api/reservations';

const emptyForm = { name: '', phone: '', date: '', time: '', guests: 2 };
const todayStr = () => new Date().toISOString().slice(0, 10);

function ReservationModal() {
  const { isOpen, close } = useReservation();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  if (!isOpen) return null;

  const handleClose = () => {
    close();
    setTimeout(() => {
      setForm(emptyForm);
      setError(null);
      setSuccess(false);
    }, 200);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.phone.trim() || !form.date || !form.time || !form.guests) {
      setError('Bütün sahələr tələb olunur');
      return;
    }
    if (form.date < todayStr()) {
      setError('Keçmiş tarix üçün rezervasiya edilə bilməz');
      return;
    }
    if (!/^[+\d][\d\s\-()]{6,}$/.test(form.phone.trim())) {
      setError('Düzgün telefon nömrəsi daxil edin');
      return;
    }

    setSubmitting(true);
    try {
      await createReservation({ ...form, guests: Number(form.guests) });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Rezervasiya göndərilərkən xəta baş verdi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4"
      onClick={handleClose}
    >
      <div
        className="bg-cream rounded-[20px] w-full max-w-[460px] p-8 relative shadow-[0_30px_60px_-20px_rgba(36,21,18,.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Bağla"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-ink hover:bg-blush/60 text-lg"
        >
          ×
        </button>

        {success ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-blush text-brick text-2xl flex items-center justify-center mx-auto mb-4">
              ✓
            </div>
            <h2 className="text-[19px] font-display font-semibold mb-2">Rezervasiyanız qəbul edildi!</h2>
            <p className="text-muted mb-6">Tezliklə sizinlə əlaqə saxlayıb təsdiqləyəcəyik.</p>
            <Button variant="primary" onClick={handleClose}>
              Bağla
            </Button>
          </div>
        ) : (
          <>
            <div className="text-[13px] text-brick font-semibold mb-1.5">Rezervasiya</div>
            <h2 className="text-[22px] font-display font-semibold mb-5">Masa sifariş et</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Adınız"
                value={form.name}
                onChange={handleChange}
                className="border border-ink/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-maroon sm:col-span-2"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Telefon nömrəniz"
                value={form.phone}
                onChange={handleChange}
                className="border border-ink/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-maroon sm:col-span-2"
              />
              <input
                type="date"
                name="date"
                min={todayStr()}
                value={form.date}
                onChange={handleChange}
                className="border border-ink/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-maroon"
              />
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="border border-ink/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-maroon"
              />
              <select
                name="guests"
                value={form.guests}
                onChange={handleChange}
                className="border border-ink/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-maroon sm:col-span-2 bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} nəfər
                  </option>
                ))}
              </select>

              {error && <p className="text-brick text-[13.5px] sm:col-span-2">{error}</p>}

              <Button type="submit" variant="primary" className="sm:col-span-2 mt-1" disabled={submitting}>
                {submitting ? 'Göndərilir...' : 'Rezervasiyanı təsdiqlə'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ReservationModal;
