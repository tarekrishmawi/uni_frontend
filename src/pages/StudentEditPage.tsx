
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
        <div className="panel">
          <p>Loading student information...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1>Edit Student</h1>
            <p>Unable to open this student record.</p>
          </div>
        </div>

        <div className="panel">
          <div className="form-error" role="alert">
            {error || 'Student not found.'}
          </div>

          <Link to="/students" className="btn btn-secondary">
            Back to Students
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Edit Student</h1>
          <p>
            Update {student.firstName} {student.lastName}'s information.
          </p>
        </div>
      </div>

      <div className="panel">
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
