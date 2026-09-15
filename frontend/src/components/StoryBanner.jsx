const defaultStats = [
  { value: '20+', label: 'İl təcrübə' },
  { value: '50+', label: 'Fərqli resept' },
  { value: '1000+', label: 'Məmnun qonaq' },
  { value: '26', label: 'Peşəkar aşpaz' },
];

const defaultPhoto = 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1100&h=500&fit=crop';

function StoryBanner({ kicker = 'Hekayəmiz', title, description, photo = defaultPhoto, stats = defaultStats }) {
  return (
    <div className="bg-maroon rounded-[20px] sm:rounded-[28px] p-1.5 text-white">
      <div className="relative rounded-[22px] overflow-hidden">
        <img src={photo} alt="" loading="lazy" className="w-full h-[280px] sm:h-[420px] object-cover brightness-60" />

        <div className="absolute inset-0 flex flex-col items-center text-center px-4 pt-9">
          <div className="text-[13px] text-white font-semibold mb-2.5">{kicker}</div>
          <h2 className="text-[26px] sm:text-[34px] font-semibold mb-2.5 text-white max-w-[520px]">{title}</h2>
          <p className="text-[#e9d7cf] text-[15px] leading-[1.6] max-w-[520px]">{description}</p>
        </div>

        <div className="static sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:bottom-[26px] mt-4 sm:mt-0 mx-4 sm:mx-0 bg-white rounded-[14px] sm:rounded-[18px] flex flex-wrap lg:flex-nowrap shadow-[0_20px_40px_-16px_rgba(0,0,0,.4)] overflow-hidden w-[calc(100%-2rem)] sm:w-[88%] lg:w-auto">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`basis-1/2 lg:basis-auto lg:flex-none text-center px-[10px] sm:px-[14px] lg:px-[30px] py-3.5 sm:py-4 lg:py-5 ${
                i !== stats.length - 1 ? 'lg:border-r border-[#f0e6e0]' : ''
              }`}
            >
              <b className="block font-display text-[18px] lg:text-[22px] text-maroon">{s.value}</b>
              <span className="text-xs text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StoryBanner;
