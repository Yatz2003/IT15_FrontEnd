import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
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

function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const closeMobileNav = () => {
    setIsOpen(false);
  };

  return (
    <>
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
        className={`fixed inset-y-0 left-0 z-50 w-[18rem] transform border-r border-cyan-200/15 bg-slate-950/50 p-4 shadow-[0_18px_40px_rgba(3,5,16,0.65)] backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Primary"
      >
        <div className="glass-panel mb-4 p-4">
          <Link className="flex items-center gap-3" to="/overview" onClick={closeMobileNav}>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.35)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M12 3 2 8l10 5 8-4v5h2V8L12 3Zm-6 8.2V15c0 .8 2.7 3 6 3s6-2.2 6-3v-3.8l-6 3-6-3Z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-cyan-100">Sandayan Academy</p>
              <p className="text-xs text-slate-300">Enrollment System</p>
            </div>
          </Link>
          <p className="mt-3 truncate text-xs text-slate-300">{user?.name || user?.email || 'Authenticated User'}</p>
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
          onClick={logout}
        >
          Logout
        </button>
      </nav>
    </>
  );
}

export default Navbar;
