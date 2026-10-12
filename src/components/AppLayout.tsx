import {
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router-dom';

import {
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Users,
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logoutUser } from '../features/auth/authSlice';

export default function AppLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { username, role } = useAppSelector(
    (state) => state.auth,
  );

  async function handleLogout() {
    await dispatch(logoutUser());
    navigate('/login', { replace: true });
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link d-flex align-items-center gap-2 rounded px-3 py-2 ${
      isActive
        ? 'active bg-primary text-white'
        : 'text-secondary'
    }`;

  return (
    <div className="min-vh-100 bg-light">
      <header className="navbar bg-white border-bottom px-3 px-lg-4 py-3">
        <NavLink
          to="/"
          className="navbar-brand d-flex align-items-center gap-2 fw-bold mb-0"
        >
          <GraduationCap size={28} className="text-primary" />
          <span>University IS</span>
        </NavLink>

        <div className="d-flex align-items-center gap-3">
          <div className="text-end d-none d-sm-block">
            <div className="fw-semibold">{username}</div>
            <small className="text-secondary">{role}</small>
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            onClick={handleLogout}
            aria-label="Sign out"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      <div className="container-fluid">
        <div className="row">
          <aside className="col-md-3 col-lg-2 bg-white border-end min-vh-100 p-3">
            <p className="text-secondary text-uppercase small fw-semibold px-3 mt-2">
              Main menu
            </p>

            <nav className="nav flex-column gap-2">
              <NavLink to="/" end className={linkClass}>
                <LayoutDashboard size={19} />
                Dashboard
              </NavLink>

              <NavLink to="/students" className={linkClass}>
                <Users size={19} />
                Students
              </NavLink>
            </nav>
          </aside>

          <main className="col-md-9 col-lg-10 p-3 p-lg-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}