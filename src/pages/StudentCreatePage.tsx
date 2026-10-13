
import { useNavigate } from 'react-router-dom';

import StudentForm from '../components/students/StudentForm';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addStudent } from '../features/students/studentsSlice';
import type { StudentRequest } from '../features/students/studentsTypes';

export default function StudentCreatePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isSubmitting = useAppSelector(
    (state) => state.students.saving,
  );

  async function handleSubmit(data: StudentRequest) {
    await dispatch(addStudent(data)).unwrap();

    navigate('/students', { replace: true });
  }

  return (
    <div className="page-content student-page">
      <div className="page-header student-page-header">
        <div>
          <span className="student-page-eyebrow">STUDENT MANAGEMENT</span>
          <h1>Add Student</h1>
          <p>Set up a student profile and add them to the university records.</p>
        </div>
      </div>

      <div className="panel student-form-panel">
        <StudentForm
          onSubmit={handleSubmit}
          submitLabel="Create Student"
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
