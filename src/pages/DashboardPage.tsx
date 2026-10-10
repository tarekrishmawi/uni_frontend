
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  {
    label: 'Total Students',
    value: '—',
    note: 'Connect API to load',
    icon: Users,
    color: 'blue',
  },
  {
    label: 'Active Courses',
    value: '—',
    note: 'Coming in next module',
    icon: BookOpen,
    color: 'purple',
  },
  {
    label: 'Faculty Members',
    value: '—',
    note: 'Coming in next module',
    icon: GraduationCap,
    color: 'green',
  },
  {
    label: 'Enrollment Rate',
    value: '—',
    note: 'Connect academic data',
    icon: TrendingUp,
    color: 'orange',
  },
];

export default function DashboardPage() {
  return (
    <>
      <div className="welcome-banner">
        <div>
          <div className="welcome-eyebrow">UNIVERSITY INFORMATION SYSTEM</div>
          <h2>Welcome back, Administrator</h2>
          <p>
            Manage student records and access your university's
            academic information from one place.
          </p>
          <Link to="/students" className="welcome-button">
            Manage students <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="welcome-art">
          <GraduationCap size={104} strokeWidth={1.2} />
        </div>
      </div>

      <div className="section-heading">
        <div>
          <h2>Overview</h2>
          <p>Your university at a glance</p>
        </div>
        <span className="data-status">
          <span className="status-dot" />
          API integration pending
        </span>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="stat-card" key={stat.label}>
              <div className={`stat-icon ${stat.color}`}>
                <Icon size={22} />
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-note">{stat.note}</div>
            </article>
          );
        })}
      </div>

      <div className="dashboard-bottom">
        <article className="panel quick-actions">
          <div className="panel-heading">
            <div>
              <h3>Quick Actions</h3>
              <p>Common administrative tasks</p>
            </div>
          </div>

          <Link to="/students" className="quick-action">
            <div className="action-icon blue">
              <Users size={20} />
            </div>
            <div className="action-text">
              <strong>Manage Students</strong>
              <span>View and maintain student records</span>
            </div>
            <ArrowRight size={18} />
          </Link>

          <div className="quick-action unavailable-action">
            <div className="action-icon purple">
              <BookOpen size={20} />
            </div>
            <div className="action-text">
              <strong>Manage Courses</strong>
              <span>Available in a future module</span>
            </div>
            <span className="coming-soon">Soon</span>
          </div>
        </article>

        <article className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <h3>System Status</h3>
              <p>Development environment</p>
            </div>
          </div>

          <div className="activity-row">
            <span className="activity-indicator online" />
            <div>
              <strong>Frontend</strong>
              <p>React application running</p>
            </div>
            <span className="activity-state">Ready</span>
          </div>

          <div className="activity-row">
            <span className="activity-indicator online" />
            <div>
              <strong>Backend API</strong>
              <p>Spring Boot · Port 8080</p>
            </div>
            <span className="activity-state">Running</span>
          </div>

          <div className="activity-row">
            <span className="activity-indicator pending" />
            <div>
              <strong>Live dashboard data</strong>
              <p>Awaiting API integration</p>
            </div>
            <span className="activity-state pending-text">Pending</span>
          </div>
        </article>
      </div>
    </>
  );
}