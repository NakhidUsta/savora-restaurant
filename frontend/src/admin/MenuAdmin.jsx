import { useEffect, useState } from 'react';
import Button from '../components/Button';
import ImageUploadField from './ImageUploadField';
import { resolveUploadUrl } from '../api/upload';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../api/menu';

const emptyForm = { name: '', description: '', price: '', image_url: '', category: '', is_new: false };

function MenuAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    getMenuItems()
      .then(setItems)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const startCreate = () => {
    setEditingId('new');
    setForm(emptyForm);
    setError(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ ...item });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editingId === 'new') {
        await createMenuItem(payload);
      } else {
        await updateMenuItem(editingId, payload);
      }
      cancelEdit();
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Yemək saxlanılarkən xəta baş verdi');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu yeməyi silmək istədiyinizə əminsiniz?')) return;
    await deleteMenuItem(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] font-display font-semibold">Menyu idarəetməsi</h1>
        <Button variant="primary" onClick={startCreate}>
          + Yeni yemək
        </Button>
      </div>

      {editingId && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-[18px] p-6 shadow-[0_14px_28px_-22px_rgba(36,21,18,.3)] mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Ad"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="border border-ink/15 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-maroon"
          />
          <input
            type="text"
            placeholder="Kateqoriya"
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            className="border border-ink/15 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-maroon"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Qiymət (₼)"
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            className="border border-ink/15 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-maroon"
          />
          <label className="flex items-center gap-2 text-[14px]">
            <input
              type="checkbox"
              checked={form.is_new}
              onChange={(e) => setForm((p) => ({ ...p, is_new: e.target.checked }))}
            />
            Təzə menyu yeniliyi kimi göstər
          </label>
          <textarea
            placeholder="Təsvir"
            rows={2}
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="border border-ink/15 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-maroon resize-none sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <ImageUploadField
              label="Şəkil"
              value={form.image_url}
              onChange={(url) => setForm((p) => ({ ...p, image_url: url }))}
            />
          </div>

          {error && <p className="text-brick text-[13.5px] sm:col-span-2">{error}</p>}

          <div className="sm:col-span-2 flex gap-3">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saxlanılır...' : 'Saxla'}
            </Button>
            <Button type="button" variant="ghost" onClick={cancelEdit}>
              Ləğv et
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-muted">Yüklənir...</p>
      ) : (
        <div className="bg-white rounded-[18px] shadow-[0_14px_28px_-22px_rgba(36,21,18,.3)] overflow-hidden">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border-b border-ink/[0.06] last:border-0">
              <img
                src={resolveUploadUrl(item.image_url)}
                alt={item.name}
                className="w-14 h-14 rounded-xl object-cover flex-none"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[14.5px]">
                  {item.name} {item.is_new && <span className="text-brick text-xs font-bold ml-1">TƏZƏ</span>}
                </div>
                <div className="text-muted text-[13px]">
                  {item.category} · {Number(item.price).toFixed(2)} ₼
                </div>
              </div>
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="text-[13.5px] font-semibold text-maroon"
              >
                Redaktə et
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="text-[13.5px] font-semibold text-brick"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuAdmin;
