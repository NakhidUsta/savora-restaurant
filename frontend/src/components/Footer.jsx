import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { resolveUploadUrl } from '../api/upload';

function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-[#e9dcd6] pt-[50px] pb-[26px] mt-auto">
      <div className="max-w-[1180px] mx-auto px-8">
        <div className="flex flex-wrap justify-between gap-[30px] mb-10">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-[22px] text-white">
              {settings.logo_url ? (
                <img src={resolveUploadUrl(settings.logo_url)} alt={settings.site_name} className="h-8 w-auto" />
              ) : (
                settings.site_name || 'Savora'
              )}
            </Link>
            <p className="max-w-[220px] text-[13.5px] text-[#a9958e] mt-3">
              Sadə, təzə və unudulmaz dad təcrübəsi.
            </p>
          </div>

          <div>
            <h4 className="text-[13px] uppercase tracking-[0.06em] text-[#a9958e] mb-3.5">Naviqasiya</h4>
            <Link to="/menyu" className="block text-sm mb-2.5 text-[#e9dcd6] hover:text-white">
              Menyu
            </Link>
            <Link to="/haqqimizda" className="block text-sm mb-2.5 text-[#e9dcd6] hover:text-white">
              Haqqımızda
            </Link>
            <Link to="/reyler" className="block text-sm mb-2.5 text-[#e9dcd6] hover:text-white">
              Rəylər
            </Link>
          </div>

          <div>
            <h4 className="text-[13px] uppercase tracking-[0.06em] text-[#a9958e] mb-3.5">Əlaqə</h4>
            <a href={`mailto:${settings.email}`} className="block text-sm mb-2.5 text-[#e9dcd6] hover:text-white">
              {settings.email}
            </a>
            <a
              href={`tel:${(settings.phone || '').replace(/\s/g, '')}`}
              className="block text-sm mb-2.5 text-[#e9dcd6] hover:text-white"
            >
              {settings.phone}
            </a>
            <Link to="/elaqe" className="block text-sm mb-2.5 text-[#e9dcd6] hover:text-white">
              {settings.address}
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 pt-[22px] flex flex-wrap justify-between gap-2 text-[13px] text-[#a9958e]">
          <span>
            © {year} {settings.site_name || 'Savora'}. Bütün hüquqlar qorunur.
          </span>
          <span>Instagram · Facebook</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
