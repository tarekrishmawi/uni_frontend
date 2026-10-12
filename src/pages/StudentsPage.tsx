
import { useCallback, useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  clearStudentsError,
  loadStudents,
  removeStudent,
} from '../features/students/studentsSlice';
import type { StudentQuery } from '../features/students/studentsTypes';

const PAGE_SIZE = 10;

export default function StudentsPage() {
  const dispatch = useAppDispatch();
  const { data, loading, saving, error, page, totalElements, totalPages } =
    useAppSelector((state) => state.students);

  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(
    (pageNumber: number, searchTerm = search, statusFilter = status) => {
      const query: StudentQuery = {
        search: searchTerm,
        status: statusFilter,
        page: pageNumber,
        size: PAGE_SIZE,
        sortBy: 'lastName',
        direction: 'asc',
      };

      void dispatch(loadStudents(query));
    },
    [dispatch, search, status],
  );

  useEffect(() => {
    load(0);
  }, [load]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(searchInput.trim());
    load(0, searchInput.trim(), status);
  }

  function handleStatusChange(value: string) {
    setStatus(value);
    load(0, search, value);
  }

  async function handleDelete(id: number, name: string) {
    const confirmed = window.confirm(
      `Delete ${name}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    const result = await dispatch(removeStudent(id));

    if (removeStudent.fulfilled.match(result) && data.length === 1 && page > 0) {
      load(page - 1);
    }
  }

  function handleRefresh() {
    dispatch(clearStudentsError());
    load(page);
  }

  return (
    <div className="container-fluid px-0">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Student Management</h2>
          <p className="text-secondary mb-0">
            Manage student records and personal information.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => window.alert('The student form is the next step.')}
        >
          <Plus size={18} />
          Add student
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="rounded-3 bg-primary-subtle text-primary p-3">
                <Users size={24} />
              </div>
              <div>
                <div className="text-secondary small">Total students</div>
                <div className="fs-3 fw-bold">{totalElements}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <form
            onSubmit={handleSearch}
            className="row g-2 align-items-center mb-4"
          >
            <div className="col-lg">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <Search size={18} />
                </span>
                <input
                  className="form-control"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search by name, student number or email..."
                  aria-label="Search students"
                />
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <select
                className="form-select"
                value={status}
                onChange={(event) => handleStatusChange(event.target.value)}
                aria-label="Filter by student status"
              >
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="col-sm-auto">
              <button className="btn btn-outline-secondary" type="submit">
                Search
              </button>
            </div>

            <div className="col-sm-auto">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleRefresh}
                title="Refresh students"
              >
                <RefreshCw size={17} />
              </button>
            </div>
          </form>

          {error && (
            <div
              className="alert alert-danger d-flex justify-content-between align-items-center"
              role="alert"
            >
              <span>{error}</span>
              <button
                className="btn-close"
                type="button"
                aria-label="Dismiss error"
                onClick={() => dispatch(clearStudentsError())}
              />
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Student</th>
                  <th>Student number</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
                      <LoaderCircle
                        className="text-primary mb-2"
                        size={28}
                      />
                      <div className="text-secondary">Loading students...</div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
                      <Users
                        className="text-secondary mb-2"
                        size={32}
                      />
                      <div className="fw-semibold">No students found</div>
                      <div className="text-secondary small">
                        Try another search or add a student.
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="fw-semibold">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-secondary small">
                          ID: {student.id}
                        </div>
                      </td>
                      <td>{student.studentNumber}</td>
                      <td>{student.email}</td>
                      <td>{student.phone || '—'}</td>
                      <td>
                        <span
                          className={`badge ${
                            student.status === 'ACTIVE'
                              ? 'text-bg-success'
                              : 'text-bg-secondary'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          title={`Delete ${student.firstName} ${student.lastName}`}
                          aria-label={`Delete ${student.firstName} ${student.lastName}`}
                          disabled={saving}
                          onClick={() =>
                            handleDelete(
                              student.id,
                              `${student.firstName} ${student.lastName}`,
                            )
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <span className="text-secondary small">
              {totalElements === 0
                ? 'No records'
                : `Showing ${page * PAGE_SIZE + 1}–${Math.min(
                    (page + 1) * PAGE_SIZE,
                    totalElements,
                  )} of ${totalElements} students`}
            </span>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                disabled={loading || page <= 0}
                onClick={() => load(page - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={17} />
              </button>

              <span className="small">
                Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
              </span>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                disabled={loading || page + 1 >= totalPages}
                onClick={() => load(page + 1)}
                aria-label="Next page"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
