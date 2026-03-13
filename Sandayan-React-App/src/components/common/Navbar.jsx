import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/overview', label: 'Overview' },
  { to: '/students', label: 'Students' },
  { to: '/programs', label: 'Programs' },
  { to: '/subjects', label: 'Subjects' },
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
        className="mobile-nav-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
      >
        Menu
      </button>

      {isOpen && <button type="button" className="mobile-nav-backdrop" onClick={closeMobileNav} aria-label="Close navigation" />}

      <nav className={`app-sidebar ${isOpen ? 'is-open' : ''}`} aria-label="Primary">
        <div className="sidebar-top">
          <Link className="sidebar-brand fw-bold d-flex align-items-center gap-2" to="/overview" onClick={closeMobileNav}>
            <span className="brand-dot" aria-hidden="true" />
            Sandayan Dashboard
          </Link>
          <p className="sidebar-user mb-0">{user?.name || user?.email || 'Authenticated User'}</p>
        </div>

        <div className="app-nav-links" role="list">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMobileNav}
              className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <button type="button" className="btn btn-outline-light btn-sm mt-auto" onClick={logout}>
          Logout
        </button>
      </nav>
    </>
  );
}

export default Navbar;
