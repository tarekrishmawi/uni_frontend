
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
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Add Student</h1>
          <p>Create a new student record.</p>
        </div>
      </div>

      <div className="panel">
        <StudentForm
          onSubmit={handleSubmit}
          submitLabel="Create Student"
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
