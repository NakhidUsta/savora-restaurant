import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Button from './Button';
import { useCart } from '../context/CartContext';
import { useReservation } from '../context/ReservationContext';
import { useSettings } from '../context/SettingsContext';
import { resolveUploadUrl } from '../api/upload';

const navLinks = [
  { to: '/menyu', label: 'Menyu' },
  { to: '/haqqimizda', label: 'Haqqımızda' },
  { to: '/reyler', label: 'Rəylər' },
  { to: '/elaqe', label: 'Əlaqə' },
];

const desktopLinkClass = ({ isActive }) =>
  `text-[15px] font-medium ${isActive ? 'text-maroon font-bold' : 'text-ink'}`;

const mobileLinkClass = ({ isActive }) =>
  `py-3 text-[15px] font-medium border-b border-ink/[0.08] ${isActive ? 'text-maroon font-bold' : 'text-ink'}`;

function Header() {
  const [open, setOpen] = useState(false);
  const { totalCount } = useCart();
  const { open: openReservation } = useReservation();
  const { settings } = useSettings();

  return (
    <header className="py-[26px] relative">
      <div className="max-w-[1180px] mx-auto px-8 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-[22px] tracking-[0.5px] text-ink">
          {settings.logo_url ? (
            <img src={resolveUploadUrl(settings.logo_url)} alt={settings.site_name} className="h-8 w-auto" />
          ) : (
            settings.site_name || 'Savora'
          )}
        </Link>

        <nav className="hidden sm:flex gap-[34px]">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={desktopLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          <Link
            to="/sebet"
            aria-label="Səbət"
            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-blush/60 transition-colors flex-none"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-ink">
              <path d="M3 6h2l2.4 12.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L22 8H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="21" r="1.4" fill="currentColor" stroke="none" />
              <circle cx="18" cy="21" r="1.4" fill="currentColor" stroke="none" />
            </svg>
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brick text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>

          <div className="hidden sm:block">
            <Button variant="primary" onClick={openReservation}>
              Masa sifariş et
            </Button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menyunu aç/bağla"
          aria-expanded={open}
          className="sm:hidden flex items-center justify-center w-[42px] h-[42px] rounded-[10px] border-[1.5px] border-ink/25 flex-none"
        >
          <span className="relative block w-[18px] h-[2px] bg-ink before:content-[''] before:absolute before:w-[18px] before:h-[2px] before:bg-ink before:-top-[6px] before:left-0 after:content-[''] after:absolute after:w-[18px] after:h-[2px] after:bg-ink after:top-[6px] after:left-0" />
        </button>
      </div>

      {open && (
        <div className="sm:hidden flex flex-col gap-0.5 px-8 pt-2.5 pb-[22px]">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className={mobileLinkClass}>
              {link.label}
            </NavLink>
          ))}
          <Button
            variant="primary"
            className="mt-3 w-full"
            onClick={() => {
              setOpen(false);
              openReservation();
            }}
          >
            Masa sifariş et
          </Button>
        </div>
      )}
    </header>
  );
}

export default Header;
