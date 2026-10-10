
import { NavLink } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
} from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <GraduationCap size={25} />
        </div>
        <div>
          <div className="brand-name">UniPortal</div>
          <div className="brand-subtitle">Information System</div>
        </div>
      </div>

      <div className="nav-section-label">MAIN MENU</div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/students"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          <Users size={19} />
          <span>Students</span>
        </NavLink>

        <div className="nav-item disabled-nav">
          <BookOpen size={19} />
          <span>Courses</span>
          <span className="coming-soon">Soon</span>
        </div>

        <div className="nav-item disabled-nav">
          <Settings size={19} />
          <span>Settings</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="admin-avatar">AD</div>
        <div className="admin-info">
          <div className="admin-name">Administrator</div>
          <div className="admin-role">System Admin</div>
        </div>
        <LogOut size={18} className="logout-icon" />
      </div>
    </aside>
  );
}