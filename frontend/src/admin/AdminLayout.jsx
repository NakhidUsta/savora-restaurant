import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/settings', label: 'Sayt ayarları' },
  { to: '/admin/menu', label: 'Menyu' },
  { to: '/admin/reservations', label: 'Rezervasiyalar' },
  { to: '/admin/orders', label: 'Sifarişlər' },
  { to: '/admin/reviews', label: 'Rəylər' },
  { to: '/admin/messages', label: 'Mesajlar' },
];

const linkClass = ({ isActive }) =>
  `block px-4 py-2.5 rounded-xl text-[14px] font-medium ${
    isActive ? 'bg-maroon text-white' : 'text-ink hover:bg-blush/60'
  }`;

function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const sidebarContent = (
    <>
      <div className="px-6 py-6 font-display font-bold text-xl">
        Savora <span className="text-brick text-sm font-sans font-semibold">Admin</span>
      </div>
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setMobileNavOpen(false)}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-5 border-t border-ink/10">
        <p className="text-xs text-muted mb-2 truncate">{admin?.email}</p>
        <button type="button" onClick={handleLogout} className="text-[13.5px] font-semibold text-brick">
          Çıxış et
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-cream">
      {/* Mobil üst panel */}
      <div className="sm:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-ink/10">
        <span className="font-display font-bold text-lg">
          Savora <span className="text-brick text-sm font-sans font-semibold">Admin</span>
        </span>
        <button
          type="button"
          onClick={() => setMobileNavOpen((o) => !o)}
          aria-label="Admin menyusunu aç/bağla"
          aria-expanded={mobileNavOpen}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-ink/20"
        >
          <span className="relative block w-[18px] h-[2px] bg-ink before:content-[''] before:absolute before:w-[18px] before:h-[2px] before:bg-ink before:-top-[6px] before:left-0 after:content-[''] after:absolute after:w-[18px] after:h-[2px] after:bg-ink after:top-[6px] after:left-0" />
        </button>
      </div>
      {mobileNavOpen && (
        <div className="sm:hidden bg-white border-b border-ink/10 flex flex-col">{sidebarContent}</div>
      )}

      {/* Masaüstü sidebar */}
      <aside className="hidden sm:flex w-[240px] flex-none bg-white border-r border-ink/10 flex-col">
        {sidebarContent}
      </aside>

      <main className="flex-1 p-5 sm:p-8 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
