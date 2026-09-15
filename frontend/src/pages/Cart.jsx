import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/orders';
import { resolveUploadUrl } from '../api/upload';

function QuantityControl({ quantity, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        className="w-7 h-7 rounded-full border border-ink/25 flex items-center justify-center text-ink"
        aria-label="Azalt"
      >
        −
      </button>
      <span className="w-5 text-center font-semibold">{quantity}</span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        className="w-7 h-7 rounded-full border border-ink/25 flex items-center justify-center text-ink"
        aria-label="Artır"
      >
        +
      </button>
    </div>
  );
}

function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const [form, setForm] = useState({ customer_name: '', phone: '', table_number: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.customer_name.trim() || !form.phone.trim()) {
      setError('Ad və telefon nömrəsi tələb olunur');
      return;
    }
    if (!/^[+\d][\d\s\-()]{6,}$/.test(form.phone.trim())) {
      setError('Düzgün telefon nömrəsi daxil edin');
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        customer_name: form.customer_name,
        phone: form.phone,
        table_number: form.table_number ? Number(form.table_number) : undefined,
        items: items.map((i) => ({ menu_item_id: i.id, quantity: i.quantity })),
      });
      setConfirmedOrder(order);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.error || 'Sifariş göndərilərkən xəta baş verdi');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedOrder) {
    return (
      <section className="py-20">
        <div className="max-w-[560px] mx-auto px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-blush text-brick text-3xl flex items-center justify-center mx-auto mb-6">
            ✓
          </div>
          <h1 className="text-[28px] font-display font-semibold mb-3">Sifarişiniz qəbul edildi!</h1>
          <p className="text-muted mb-1">
            Sifariş nömrəniz: <strong className="text-ink">#{confirmedOrder.id}</strong>
          </p>
          <p className="text-muted mb-8">Ümumi məbləğ: {Number(confirmedOrder.total).toFixed(2)} ₼</p>
          <Button to="/menyu" variant="primary">
            Menyuya qayıt
          </Button>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="py-20">
        <div className="max-w-[560px] mx-auto px-8 text-center">
          <h1 className="text-[28px] font-display font-semibold mb-3">Səbətiniz boşdur</h1>
          <p className="text-muted mb-8">Menyudan sevimli yeməklərinizi seçib səbətə əlavə edin.</p>
          <Button to="/menyu" variant="primary">
            Menyuya bax
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-[900px] mx-auto px-8">
        <div className="text-center max-w-[520px] mx-auto mb-11">
          <div className="text-[13px] text-brick font-semibold mb-2.5">Sifariş</div>
          <h1 className="text-[26px] sm:text-[34px] font-display font-semibold">Səbətiniz</h1>
        </div>

        <div className="bg-white rounded-[20px] shadow-[0_18px_34px_-28px_rgba(36,21,18,.3)] divide-y divide-ink/[0.06] mb-8">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-5">
              <img
                src={resolveUploadUrl(item.image_url)}
                alt={item.name}
                loading="lazy"
                className="w-16 h-16 rounded-[12px] object-cover flex-none"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[15px]">{item.name}</h3>
                <p className="text-muted text-[13px]">{item.price.toFixed(2)} ₼</p>
              </div>
              <QuantityControl quantity={item.quantity} onChange={(q) => updateQuantity(item.id, q)} />
              <div className="w-16 text-right font-semibold text-[14px]">
                {(item.price * item.quantity).toFixed(2)} ₼
              </div>
              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                className="text-muted hover:text-brick text-lg leading-none px-1"
                aria-label="Sil"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-10 px-1">
          <span className="text-muted">Ümumi məbləğ</span>
          <span className="text-[22px] font-display font-semibold text-maroon">{totalPrice.toFixed(2)} ₼</span>
        </div>

        <div className="bg-white rounded-[20px] shadow-[0_18px_34px_-28px_rgba(36,21,18,.3)] p-8">
          <h2 className="text-[19px] font-display font-semibold mb-5">Sifarişi tamamlayın</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="customer_name"
              placeholder="Adınız"
              value={form.customer_name}
              onChange={handleChange}
              className="border border-ink/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-maroon"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Telefon nömrəniz"
              value={form.phone}
              onChange={handleChange}
              className="border border-ink/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-maroon"
            />
            <input
              type="number"
              name="table_number"
              placeholder="Masa nömrəsi (istəyə bağlı)"
              value={form.table_number}
              onChange={handleChange}
              className="border border-ink/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-maroon sm:col-span-2"
              min="1"
            />

            {error && <p className="text-brick text-[13.5px] sm:col-span-2">{error}</p>}

            <Button type="submit" variant="primary" className="sm:col-span-2 mt-2" disabled={submitting}>
              {submitting ? 'Göndərilir...' : 'Sifarişi təsdiqlə'}
            </Button>
          </form>
        </div>

        <div className="text-center mt-8">
          <Link to="/menyu" className="text-[13.5px] font-semibold text-maroon">
            ← Menyuya qayıt
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Cart;
