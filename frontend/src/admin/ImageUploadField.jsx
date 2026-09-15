import { useState } from 'react';
import { uploadImage, resolveUploadUrl } from '../api/upload';

function ImageUploadField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err.response?.data?.error || 'Şəkil yüklənərkən xəta baş verdi');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      {label && <label className="block text-[13px] text-muted mb-2">{label}</label>}
      <div className="flex items-center gap-4">
        {value ? (
          <img
            src={resolveUploadUrl(value)}
            alt=""
            className="w-16 h-16 rounded-xl object-cover border border-ink/10 flex-none"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-blush flex items-center justify-center text-brick text-xs flex-none">
            Şəkil yox
          </div>
        )}
        <label className="cursor-pointer border border-ink/20 rounded-full px-4 py-2 text-[13px] font-semibold hover:bg-blush/40">
          {uploading ? 'Yüklənir...' : 'Şəkil seç'}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
      </div>
      {error && <p className="text-brick text-[12.5px] mt-2">{error}</p>}
    </div>
  );
}

export default ImageUploadField;
