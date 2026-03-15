import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/overview', label: 'Overview' },
  { to: '/students', label: 'Students' },
  { to: '/programs', label: 'Programs' },
  { to: '/subjects', label: 'Subjects' },
  { to: '/active-programs', label: 'Active Programs' },
  { to: '/enrollment', label: 'Enrollment' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
];

const BRAND_LOGO_SRC = '/brand/SandayanAcademy.png';

function Navbar({ isDesktopNavVisible = true, onToggleDesktopNav = () => {} }) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();

  const currentNavItem = navItems.find((item) => item.to === location.pathname);

  const closeMobileNav = () => {
    setIsOpen(false);
  };

  const openLogoutConfirm = () => {
    setIsLogoutConfirmOpen(true);
  };

  const closeLogoutConfirm = () => {
    if (isLoggingOut) {
      return;
    }

    setIsLogoutConfirmOpen(false);
  };

  const handleLogoutContinue = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      setIsLogoutConfirmOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`group fixed top-3 z-[60] hidden h-11 w-9 items-center gap-2 overflow-hidden rounded-r-xl border border-l-0 border-cyan-300/30 bg-slate-900/85 px-2 text-xs font-semibold tracking-wide text-cyan-100 shadow-[0_0_20px_rgba(12,200,255,0.25)] backdrop-blur-md transition-all duration-500 ease-in-out hover:w-28 lg:flex ${isDesktopNavVisible ? 'left-[18rem]' : 'left-0'}`}
        onClick={onToggleDesktopNav}
        aria-label={isDesktopNavVisible ? 'Hide navigation' : 'Show navigation'}
        aria-expanded={isDesktopNavVisible}
      >
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cyan-400/20 text-cyan-100">
          {isDesktopNavVisible ? '◀' : '▶'}
        </span>
        <span className="whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {isDesktopNavVisible ? 'Hide menu' : 'Show menu'}
        </span>
      </button>

      <button
        type="button"
        className="fixed left-3 top-3 z-[60] rounded-xl border border-cyan-300/30 bg-slate-900/85 px-3 py-2 text-xs font-semibold tracking-wide text-cyan-100 shadow-[0_0_20px_rgba(12,200,255,0.25)] backdrop-blur-md lg:hidden"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
      >
        Menu
      </button>

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={closeMobileNav}
          aria-label="Close navigation"
        />
      )}

      <nav
        className={`fixed inset-y-0 left-0 z-50 w-[18rem] transform border-r border-cyan-200/15 bg-slate-950/50 p-4 shadow-[0_18px_40px_rgba(3,5,16,0.65)] backdrop-blur-xl transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${isDesktopNavVisible ? 'lg:translate-x-0' : 'lg:-translate-x-full'}`}
        aria-label="Primary"
      >
        <div className="glass-panel mb-4 p-4">
          <Link className="flex items-center gap-3" to="/overview" onClick={closeMobileNav}>
            <img
              src={BRAND_LOGO_SRC}
              alt="Sandayan Academy logo"
              className="h-10 w-10 rounded-xl object-cover shadow-[0_0_20px_rgba(34,211,238,0.35)]"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = '/vite.svg';
              }}
            />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-cyan-100">Sandayan Academy</p>
              <p className="text-xs text-slate-300">Enrollment System</p>
            </div>
          </Link>
          <p className="mt-3 truncate text-xs text-slate-300">{user?.name || user?.email || 'Authenticated User'}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-cyan-200/80">
            Current: {currentNavItem?.label || 'Dashboard'}
          </p>
        </div>

        <div className="flex flex-col gap-2" role="list">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMobileNav}
              className={({ isActive }) => `neon-ring rounded-xl border px-3 py-2 text-sm transition ${isActive ? 'border-cyan-200/50 bg-cyan-400/15 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.2)]' : 'border-transparent text-slate-300 hover:border-cyan-200/30 hover:bg-slate-800/40 hover:text-white'}`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="mt-auto rounded-xl border border-rose-300/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
          onClick={openLogoutConfirm}
        >
          Logout
        </button>
      </nav>

      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            aria-label="Close logout confirmation"
            onClick={closeLogoutConfirm}
            disabled={isLoggingOut}
          />

          <div className="glass-panel relative z-[91] w-full max-w-sm p-5 text-center sm:p-6">
            <img
              src={BRAND_LOGO_SRC}
              alt="Sandayan Academy logo"
              className="mx-auto h-20 w-20 rounded-2xl object-cover shadow-[0_0_24px_rgba(34,211,238,0.35)]"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = '/vite.svg';
              }}
            />
            <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-cyan-100/85">Sandayan Academy</p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-50">Confirm Logout</h3>
            <p className="mt-2 text-sm text-slate-300">Do you want to continue logging out?</p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="rounded-xl border border-cyan-200/30 bg-slate-900/40 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-slate-800/50 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={closeLogoutConfirm}
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-xl border border-rose-300/35 bg-rose-500/15 px-3 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleLogoutContinue}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging out...' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
