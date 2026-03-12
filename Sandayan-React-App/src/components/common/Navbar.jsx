import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark app-navbar px-3 px-lg-4">
      <div className="container-fluid p-0">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/dashboard">
          <span className="brand-dot" aria-hidden="true" />
          Sandayan Dashboard
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#dashboardNav"
          aria-controls="dashboardNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="dashboardNav">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
            <NavLink className="nav-link" to="/dashboard">
              Dashboard
            </NavLink>
            <span className="nav-link text-light-subtle small">
              {user?.name || user?.email || 'Authenticated User'}
            </span>
            <button type="button" className="btn btn-outline-light btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
