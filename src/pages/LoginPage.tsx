import { useState, type FormEvent } from 'react';

import {
  Navigate,
  useNavigate,
} from 'react-router-dom';

import {
  AlertCircle,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  UserRound,
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../app/hooks';

import {
  clearAuthError,
  loginUser,
} from '../features/auth/authSlice';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    isAuthenticated,
    initializing,
    loading,
    error,
  } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (initializing) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <LoaderCircle className="animate-spin" size={32} />
        <span className="ms-2">Checking your session...</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await dispatch(
      loginUser({
        username: username.trim(),
        password,
      }),
    );

    if (loginUser.fulfilled.match(result)) {
      navigate('/', { replace: true });
    }
  }

  return (
    <main className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light py-4">
      <div
        className="card border-0 shadow-sm w-100"
        style={{ maxWidth: '440px', borderRadius: '18px' }}
      >
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-4 p-3 mb-3">
              <GraduationCap size={34} />
            </div>

            <h1 className="h3 fw-bold mb-2">
              University Information System
            </h1>

            <p className="text-secondary mb-0">
              Sign in to access your account
            </p>
          </div>

          {error && (
            <div
              className="alert alert-danger d-flex align-items-start gap-2"
              role="alert"
            >
              <AlertCircle size={20} className="flex-shrink-0 mt-1" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                htmlFor="username"
                className="form-label fw-semibold"
              >
                Username
              </label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <UserRound size={18} />
                </span>

                <input
                  id="username"
                  name="username"
                  type="text"
                  className="form-control"
                  placeholder="Enter your username"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    if (error) dispatch(clearAuthError());
                  }}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="form-label fw-semibold"
              >
                Password
              </label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <LockKeyhole size={18} />
                </span>

                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) dispatch(clearAuthError());
                  }}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading || !username.trim() || !password}
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="me-2 animate-spin"
                  />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="text-center text-secondary small mt-4 mb-0">
            University Information System
          </p>
        </div>
      </div>
    </main>
  );
}