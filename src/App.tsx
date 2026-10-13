
import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import StudentsPage from './pages/StudentsPage';
import StudentCreatePage from './pages/StudentCreatePage';
import StudentEditPage from './pages/StudentEditPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/students" element={<StudentsPage />} />

          <Route
            path="/students/new"
            element={<StudentCreatePage />}
          />

          <Route
            path="/students/:id/edit"
            element={<StudentEditPage />}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
