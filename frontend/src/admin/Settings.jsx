import { useEffect, useState } from 'react';
import Button from '../components/Button';
import ImageUploadField from './ImageUploadField';
import { useSettings } from '../context/SettingsContext';
import { updateSetting, updateImage } from '../api/settings';

const textFields = [
  { key: 'site_name', label: 'Sayt adı' },
  { key: 'phone', label: 'Telefon' },
  { key: 'email', label: 'E-poçt' },
  { key: 'address', label: 'Ünvan' },
  { key: 'is_saatlari', label: 'İş saatları' },
  { key: 'instagram_link', label: 'Instagram linki' },
  { key: 'facebook_link', label: 'Facebook linki' },
];

const textAreaFields = [
  { key: 'hero_title', label: 'Hero başlığı' },
  { key: 'hero_description', label: 'Hero təsviri' },
];

function Settings() {
  const { settings, refetch } = useSettings();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const setImage = (sectionKey, url) =>
    setForm((p) => ({ ...p, images: { ...p.images, [sectionKey]: { ...p.images[sectionKey], url } } }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const allTextKeys = [...textFields, ...textAreaFields, { key: 'logo_url' }];
      await Promise.all(allTextKeys.map((f) => updateSetting(f.key, form[f.key] ?? '')));
      await Promise.all(
        Object.keys(form.images || {}).map((sectionKey) =>
          updateImage(sectionKey, form.images[sectionKey].url, form.images[sectionKey].alt)
        )
      );
      await refetch();
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Ayarlar saxlanılarkən xəta baş verdi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[640px]">
      <h1 className="text-[24px] font-display font-semibold mb-6">Sayt ayarları</h1>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="bg-white rounded-[18px] p-6 shadow-[0_14px_28px_-22px_rgba(36,21,18,.3)]">
          <h2 className="font-semibold mb-4">Loqo</h2>
          <ImageUploadField value={form.logo_url} onChange={(url) => setField('logo_url', url)} />
        </div>

        <div className="bg-white rounded-[18px] p-6 shadow-[0_14px_28px_-22px_rgba(36,21,18,.3)] flex flex-col gap-4">
          <h2 className="font-semibold mb-1">Ümumi məlumat</h2>
          {textFields.map((f) => (
            <div key={f.key}>
              <label className="block text-[13px] text-muted mb-1.5">{f.label}</label>
              <input
                type="text"
                value={form[f.key] || ''}
                onChange={(e) => setField(f.key, e.target.value)}
                className="w-full border border-ink/15 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-maroon"
              />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[18px] p-6 shadow-[0_14px_28px_-22px_rgba(36,21,18,.3)] flex flex-col gap-4">
          <h2 className="font-semibold mb-1">Ana səhifə hero mətni</h2>
          {textAreaFields.map((f) => (
            <div key={f.key}>
              <label className="block text-[13px] text-muted mb-1.5">{f.label}</label>
              <textarea
                rows={3}
                value={form[f.key] || ''}
                onChange={(e) => setField(f.key, e.target.value)}
                className="w-full border border-ink/15 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-maroon resize-none"
              />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[18px] p-6 shadow-[0_14px_28px_-22px_rgba(36,21,18,.3)] flex flex-col gap-4">
          <h2 className="font-semibold mb-1">Şəkillər</h2>
          <ImageUploadField
            label="Hero fon şəkli (Ana səhifə)"
            value={form.images?.hero_background?.url}
            onChange={(url) => setImage('hero_background', url)}
          />
          <ImageUploadField
            label="Haqqımızda şəkli"
            value={form.images?.about_image?.url}
            onChange={(url) => setImage('about_image', url)}
          />
        </div>

        {error && <p className="text-brick text-[13.5px]">{error}</p>}
        {saved && <p className="text-brick text-[13.5px]">Ayarlar saxlanıldı!</p>}

        <Button type="submit" variant="primary" disabled={saving} className="self-start">
          {saving ? 'Saxlanılır...' : 'Yadda saxla'}
        </Button>
      </form>
    </div>
  );
}

export default Settings;
