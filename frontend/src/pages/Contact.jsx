import { useState } from 'react';
import Button from '../components/Button';
import { sendContactMessage } from '../api/contact';

const offers = [
  {
    tag: '-10%',
    caption: 'Həftəlik salat menyusu',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&h=500&fit=crop',
    big: true,
  },
  {
    tag: '-15%',
    caption: 'Səhər yeməyi dəsti',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&h=260&fit=crop',
  },
  {
    tag: '-12%',
    caption: 'Ailə paketi',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500&h=260&fit=crop',
  },
];

function OfferTile({ image, tag, caption, big }) {
  return (
    <div
      className={`relative rounded-[22px] overflow-hidden ${
        big ? 'h-[200px] sm:h-[240px] lg:h-[400px]' : 'h-[200px] sm:h-[240px] lg:h-[190px]'
      }`}
    >
      <img src={image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_40%,rgba(0,0,0,.55)_100%)]" />
      <span className="absolute top-4 left-4 bg-brick text-white text-xs font-bold px-3 py-1.5 rounded-full z-[2]">
        {tag}
      </span>
      <span className="absolute bottom-4 left-4 text-white font-display text-xl z-[2]">{caption}</span>
    </div>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Bütün sahələr tələb olunur');
      return;
    }

    setSubmitting(true);
    try {
      await sendContactMessage(form);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Mesaj göndərilərkən xəta baş verdi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="pt-[50px] pb-16">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="text-center max-w-[520px] mx-auto mb-11">
            <div className="text-[13px] text-brick font-semibold mb-2.5">Əlaqə</div>
            <h1 className="text-[26px] sm:text-[34px] font-display font-semibold mb-2.5">
              Bizimlə əlaqə saxlayın
            </h1>
            <p className="text-muted text-[15px] leading-[1.6]">
              Sualınız var, ya da xüsusi bir tədbir üçün masa lazımdır? Bizə yazın, tezliklə cavab verək.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[.9fr_1.1fr] gap-[26px] items-stretch">
            <div className="rounded-[22px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=520&fit=crop"
                alt=""
                className="w-full h-[260px] lg:h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
              <div className="sm:col-span-2 bg-maroon text-white rounded-[18px] p-6">
                <h4 className="text-[#e9d7cf] text-sm font-semibold mb-1.5">İş saatları</h4>
                <p className="text-[20px] font-semibold m-0">Hər gün, 10:00 — 23:00</p>
              </div>
              <div className="bg-white rounded-[18px] p-[22px] shadow-[0_14px_28px_-22px_rgba(36,21,18,.3)]">
                <h4 className="text-muted text-sm font-semibold mb-1.5">E-poçt</h4>
                <p className="text-[15.5px] font-semibold m-0">hello@savora.az</p>
              </div>
              <div className="bg-white rounded-[18px] p-[22px] shadow-[0_14px_28px_-22px_rgba(36,21,18,.3)]">
                <h4 className="text-muted text-sm font-semibold mb-1.5">Telefon</h4>
                <p className="text-[15.5px] font-semibold m-0">+994 12 345 67 89</p>
              </div>
              <div className="sm:col-span-2 bg-white rounded-[18px] p-[22px] shadow-[0_14px_28px_-22px_rgba(36,21,18,.3)]">
                <h4 className="text-muted text-sm font-semibold mb-1.5">Ünvan</h4>
                <p className="text-[15.5px] font-semibold m-0">Nizami küç. 45, Bakı</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-[600px] mx-auto px-8">
          <div className="bg-white rounded-[20px] shadow-[0_18px_34px_-28px_rgba(36,21,18,.3)] p-8">
            {sent ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-blush text-brick text-2xl flex items-center justify-center mx-auto mb-4">
                  ✓
                </div>
                <h2 className="text-[19px] font-display font-semibold mb-2">Mesajınız göndərildi!</h2>
                <p className="text-muted mb-6">Ən qısa zamanda sizinlə əlaqə saxlayacağıq.</p>
                <Button variant="outline" onClick={() => setSent(false)}>
                  Yeni mesaj yaz
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-[19px] font-display font-semibold mb-5">Bizə yazın</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Adınız"
                    value={form.name}
                    onChange={handleChange}
                    className="border border-ink/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-maroon"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="E-poçt ünvanınız"
                    value={form.email}
                    onChange={handleChange}
                    className="border border-ink/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-maroon"
                  />
                  <textarea
                    name="message"
                    placeholder="Mesajınız..."
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="border border-ink/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-maroon resize-none"
                  />

                  {error && <p className="text-brick text-[13.5px]">{error}</p>}

                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'Göndərilir...' : 'Mesajı göndər'}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="text-center max-w-[520px] mx-auto mb-11">
            <div className="text-[13px] text-brick font-semibold mb-2.5">Təkliflər</div>
            <h2 className="text-[26px] sm:text-[34px] font-semibold">Cari təkliflərimiz</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5">
            <OfferTile {...offers[0]} />
            <div className="grid grid-rows-2 gap-5">
              <OfferTile {...offers[1]} />
              <OfferTile {...offers[2]} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
