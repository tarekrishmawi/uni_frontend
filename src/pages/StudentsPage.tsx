
import { Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentsPage() {
  return (
    <div className="panel students-placeholder">
      <div className="placeholder-icon">
        <Users size={34} />
      </div>

      <h2>Student Management</h2>
      <p>
        This page will display real student records from your Spring
        Boot API, with search, filtering, pagination, and CRUD operations.
      </p>

      <Link to="/" className="back-link">
        <ArrowLeft size={17} /> Back to dashboard
      </Link>
    </div>
  );
}