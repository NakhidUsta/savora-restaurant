import { useEffect, useState } from 'react';
import Button from '../components/Button';
import MenuCard from '../components/MenuCard';
import StoryBanner from '../components/StoryBanner';
import { getMenuItems } from '../api/menu';
import { useReservation } from '../context/ReservationContext';
import { useSettings } from '../context/SettingsContext';
import { resolveUploadUrl } from '../api/upload';

const heroThumbs = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=120&h=120&fit=crop',
];

function Home() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { open: openReservation } = useReservation();
  const { settings } = useSettings();
  const heroPhoto = resolveUploadUrl(settings.images?.hero_background?.url);
  const aboutPhoto = resolveUploadUrl(settings.images?.about_image?.url);

  useEffect(() => {
    getMenuItems()
      .then((data) => setMeals(data.slice(0, 4)))
      .catch(() => setError('Menyu yüklənə bilmədi'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="pt-9 pb-[70px]">
        <div className="max-w-[1180px] mx-auto px-8 grid grid-cols-1 sm:grid-cols-[1.15fr_.85fr] gap-10 items-center">
          <div>
            <div className="text-[13px] text-brick font-semibold mb-3.5">
              Bişirilib, sevgi ilə qarışdırılıb
            </div>
            <h1 className="text-[32px] sm:text-[44px] lg:text-[56px] leading-[1.04] font-semibold mb-5 tracking-[-0.5px]">
              {settings.hero_title}
            </h1>
            <p className="text-muted text-[15px] sm:text-[16.5px] max-w-[440px] leading-[1.6] mb-[30px]">
              {settings.hero_description}
            </p>
            <div className="flex gap-3.5 flex-wrap mb-[34px]">
              <Button to="/menyu" variant="primary">
                Menyuya bax
              </Button>
              <Button variant="outline" onClick={openReservation}>
                Masa rezerv et
              </Button>
            </div>
            <div className="flex items-center">
              {heroThumbs.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className={`w-14 h-14 rounded-full object-cover border-[3px] border-cream ${i !== 0 ? '-ml-3.5' : ''}`}
                />
              ))}
            </div>
          </div>

          <div className="relative order-first sm:order-2 max-w-[260px] sm:max-w-none mx-auto sm:mx-0">
            <img
              src={heroPhoto}
              alt="Yemək"
              className="rounded-full w-full aspect-square object-cover shadow-[0_30px_60px_-20px_rgba(122,31,31,.35)]"
            />
            <div className="absolute left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-[-40px] bottom-[-18px] sm:bottom-6 bg-white rounded-2xl px-[18px] py-3.5 flex gap-3 items-center shadow-[0_20px_40px_-18px_rgba(0,0,0,.25)] w-[190px] sm:w-[210px]">
              <div className="w-9 h-9 rounded-full bg-blush flex items-center justify-center text-brick text-[15px] flex-none">
                ★
              </div>
              <div className="text-[12.5px] text-muted leading-[1.4]">
                <strong className="text-ink">4.9 / 5</strong>
                <br />
                1200+ məmnun qonaq
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sevimli yeməklər */}
      <section className="py-16">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="text-center max-w-[520px] mx-auto mb-11">
            <div className="text-[13px] text-brick font-semibold mb-2.5">Menyu</div>
            <h2 className="text-[26px] sm:text-[34px] font-semibold mb-2.5">Sevimli yeməklər</h2>
            <p className="text-muted text-[15px] leading-[1.6]">
              Qonaqlarımızın ən çox sifariş etdiyi seçmə yeməklərdən bir neçəsi — tam menyu üçün Menyu
              səhifəmizə baxın.
            </p>
          </div>

          {loading && <p className="text-center text-muted">Yüklənir...</p>}
          {error && <p className="text-center text-brick">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
              {meals.map((meal) => (
                <MenuCard key={meal.id} item={meal} linkTo="/menyu" linkLabel="Menyuda bax →" priceSuffix="-dən" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Hekayəmiz */}
      <section className="py-16">
        <div className="max-w-[1180px] mx-auto px-8">
          <StoryBanner
            title="20 ildən çox təcrübə"
            description="Ənənəvi dadı incə xidmətlə birləşdiririk. Tam hekayəmizi oxumaq üçün Haqqımızda səhifəsinə keçin."
            photo={aboutPhoto}
          />
          <div className="text-center mt-[34px]">
            <Button to="/haqqimizda" variant="outline">
              Hekayəmizi oxu
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
