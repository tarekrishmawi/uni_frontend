
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';

import StudentForm from '../components/students/StudentForm';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { editStudent } from '../features/students/studentsSlice';
import { fetchStudent } from '../features/students/studentsApi';

import type {
  Student,
  StudentRequest,
} from '../features/students/studentsTypes';

export default function StudentEditPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isSubmitting = useAppSelector(
    (state) => state.students.saving,
  );

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const studentId = Number(idParam);

  const validId =
    Boolean(idParam) &&
    Number.isSafeInteger(studentId) &&
    studentId > 0;

  useEffect(() => {
    let cancelled = false;

    async function loadStudent() {
      if (!validId) {
        setError('Invalid student ID.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setStudent(null);

      try {
        const result = await fetchStudent(studentId);

        if (!cancelled) {
          setStudent(result);
        }
      } catch (err: unknown) {
        if (cancelled) return;

        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError('Student not found.');
          } else {
            setError(
              err.response?.data?.message ??
                'Unable to load this student. Please try again.',
            );
          }
        } else {
          setError('Unable to load this student. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadStudent();

    return () => {
      cancelled = true;
    };
  }, [studentId, validId]);

  async function handleSubmit(data: StudentRequest) {
    await dispatch(
      editStudent({
        id: studentId,
        request: data,
      }),
    ).unwrap();

    navigate('/students', { replace: true });
  }

  if (loading) {
    return (
      <div className="page-content">
        <div className="panel student-load-panel" role="status">
          <div className="student-loading-indicator">
            <span className="student-loading-spinner" aria-hidden="true" />
            <div>
              <strong>Loading student profile</strong>
              <p>Getting the latest student information…</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="page-content student-page">
        <div className="page-header student-page-header">
          <div>
            <span className="student-page-eyebrow">STUDENT MANAGEMENT</span>
            <h1>Edit Student</h1>
            <p>We couldn’t open this student profile.</p>
          </div>
        </div>

        <div className="panel student-form-panel">
          <div className="student-alert student-alert-error" role="alert" aria-live="assertive">
            <AlertCircle className="student-alert-icon" size={19} aria-hidden="true" />
            <div>
              <strong>Student profile unavailable</strong>
              <p>{error || 'Student not found.'}</p>
            </div>
          </div>

          <div className="student-error-actions">
            <Link to="/students" className="btn btn-secondary">
              <ArrowLeft size={16} />
              Back to Students
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content student-page">
      <div className="page-header student-page-header">
        <div>
          <span className="student-page-eyebrow">STUDENT MANAGEMENT</span>
          <h1>Edit Student</h1>
          <p>
            Update {student.firstName} {student.lastName}'s information.
          </p>
        </div>
      </div>

      <div className="panel student-form-panel">
        <StudentForm
          key={student.id}
          initialStudent={student}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
