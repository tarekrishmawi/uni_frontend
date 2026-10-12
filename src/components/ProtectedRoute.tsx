import { Navigate, Outlet } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';

import { useAppSelector } from '../app/hooks';

export default function ProtectedRoute() {
  const {
    isAuthenticated,
    initializing,
  } = useAppSelector((state) => state.auth);

  if (initializing) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center gap-3">
        <LoaderCircle
          size={36}
          className="text-primary"
          aria-label="Loading"
        />
        <p className="text-secondary mb-0">
          Restoring your session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}