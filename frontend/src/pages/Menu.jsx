import { useEffect, useState } from 'react';
import MenuCard from '../components/MenuCard';
import { getMenuItems } from '../api/menu';
import { useCart } from '../context/CartContext';
import { resolveUploadUrl } from '../api/upload';

function FreshCard({ item, onAdd, added }) {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_18px_34px_-28px_rgba(36,21,18,.3)]">
      <img
        src={resolveUploadUrl(item.image_url)}
        alt={item.name}
        loading="lazy"
        className="h-[190px] w-full object-cover"
      />
      <div className="px-[22px] pt-5 pb-6">
        <h3 className="text-[17px] font-semibold mb-1.5">{item.name}</h3>
        <p className="text-[13.5px] text-muted mb-4">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-display font-semibold text-maroon">{Number(item.price)} ₼</span>
          <button type="button" onClick={onAdd} className="text-[13.5px] font-semibold text-maroon">
            {added ? 'Əlavə edildi ✓' : 'Sifariş et'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState('hamısı');
  const { addToCart } = useCart();

  useEffect(() => {
    getMenuItems()
      .then(setItems)
      .catch(() => setError('Menyu yüklənə bilmədi'))
      .finally(() => setLoading(false));
  }, []);

  const freshItems = items.filter((i) => i.is_new);
  const categories = ['hamısı', ...new Set(items.map((i) => i.category))];
  const visibleItems = activeCategory === 'hamısı' ? items : items.filter((i) => i.category === activeCategory);

  const handleAdd = (item) => {
    addToCart(item);
    setAddedIds((prev) => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 1500);
  };

  return (
    <>
      <section className="pt-[50px] pb-16">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="text-center max-w-[520px] mx-auto mb-11">
            <div className="text-[13px] text-brick font-semibold mb-2.5">Menyu</div>
            <h2 className="text-[26px] sm:text-[34px] font-semibold mb-2.5">Tam menyumuz</h2>
            <p className="text-muted text-[15px] leading-[1.6]">
              Hər yemək təzə inqrediyentlərdən, gündəlik hazırlanır.
            </p>
          </div>

          {!loading && !error && categories.length > 2 && (
            <div className="flex flex-wrap justify-center gap-2.5 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-[13.5px] font-semibold capitalize border transition-colors ${
                    activeCategory === cat
                      ? 'bg-maroon text-white border-maroon'
                      : 'bg-white text-ink border-ink/15 hover:border-maroon'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading && <p className="text-center text-muted">Yüklənir...</p>}
          {error && <p className="text-center text-brick">{error}</p>}
          {!loading && !error && visibleItems.length === 0 && (
            <p className="text-center text-muted">Bu kateqoriyada yemək tapılmadı.</p>
          )}
          {!loading && !error && visibleItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
              {visibleItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAction={() => handleAdd(item)}
                  actionLabel={addedIds.has(item.id) ? 'Əlavə edildi ✓' : 'Sifariş et →'}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {!loading && freshItems.length > 0 && (
        <section className="py-16">
          <div className="max-w-[1180px] mx-auto px-8">
            <div className="text-center max-w-[520px] mx-auto mb-11">
              <div className="text-[13px] text-brick font-semibold mb-2.5">Təzə</div>
              <h2 className="text-[26px] sm:text-[34px] font-semibold mb-2.5">Təzə menyu yenilikləri</h2>
              <p className="text-muted text-[15px] leading-[1.6]">
                Fəsil dəyişdikcə menyumuz da təzələnir — mövsümün ən yaxşı inqrediyentləri ilə
                hazırlanmış yeni dadlar.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {freshItems.map((item) => (
                <FreshCard key={item.id} item={item} onAdd={() => handleAdd(item)} added={addedIds.has(item.id)} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Menu;
