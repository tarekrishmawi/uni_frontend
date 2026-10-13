
import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

import type {
  Student,
  StudentRequest,
} from '../../features/students/studentsTypes';

interface StudentFormProps {
  initialStudent?: Student | null;
  onSubmit: (data: StudentRequest) => Promise<void>;
  submitLabel?: string;
  isSubmitting?: boolean;
}

interface FormValues {
  studentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phone: string;
}

function getInitialForm(student?: Student | null): FormValues {
  return {
    studentNumber: student?.studentNumber ?? '',
    firstName: student?.firstName ?? '',
    lastName: student?.lastName ?? '',
    email: student?.email ?? '',
    dateOfBirth: student?.dateOfBirth ?? '',
    phone: student?.phone ?? '',
  };
}

export default function StudentForm({
  initialStudent = null,
  onSubmit,
  submitLabel = 'Save Student',
  isSubmitting = false,
}: StudentFormProps) {
  const [form, setForm] = useState<FormValues>(
    () => getInitialForm(initialStudent),
  );

  const [error, setError] = useState('');

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    try {
      await onSubmit({
        studentNumber: form.studentNumber.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        dateOfBirth: form.dateOfBirth || null,
        phone: form.phone.trim() || null,
      });
    } catch (err: unknown) {
      setError(
        typeof err === 'string'
          ? err
          : err instanceof Error
            ? err.message
            : 'Unable to save the student. Please try again.',
      );
    }
  }

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <h2>{initialStudent ? 'Edit Student' : 'Add New Student'}</h2>
          <p>
            {initialStudent
              ? 'Update the student information below.'
              : 'Enter the student information below.'}
          </p>
        </div>
      </div>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="studentNumber">Student Number *</label>
          <input
            id="studentNumber"
            name="studentNumber"
            value={form.studentNumber}
            onChange={handleChange}
            maxLength={20}
            required
            autoComplete="off"
            placeholder="e.g. STU-2026-001"
          />
        </div>

        <div className="form-field">
          <label htmlFor="firstName">First Name *</label>
          <input
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            maxLength={100}
            required
            autoComplete="given-name"
            placeholder="Enter first name"
          />
        </div>

        <div className="form-field">
          <label htmlFor="lastName">Last Name *</label>
          <input
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            maxLength={100}
            required
            autoComplete="family-name"
            placeholder="Enter last name"
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            maxLength={150}
            required
            autoComplete="email"
            placeholder="student@example.com"
          />
        </div>

        <div className="form-field">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            maxLength={30}
            autoComplete="tel"
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div className="form-actions">
        <Link to="/students" className="btn btn-secondary">
          <ArrowLeft size={16} />
          Cancel
        </Link>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          <Save size={16} />
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
