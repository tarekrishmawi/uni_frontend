
import { useRef, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  Save,
  UserRoundPlus,
} from 'lucide-react';
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

type FieldName = keyof FormValues;
type FieldErrors = Partial<Record<FieldName, string>>;

const fieldNames: FieldName[] = [
  'studentNumber',
  'firstName',
  'lastName',
  'email',
  'dateOfBirth',
  'phone',
];

const fieldLabels: Record<FieldName, string> = {
  studentNumber: 'Student number',
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email address',
  dateOfBirth: 'Date of birth',
  phone: 'Phone number',
};

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
  const formRef = useRef<HTMLFormElement>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState('');

  function validateField(name: FieldName): string {
    const input = formRef.current?.elements.namedItem(name);

    if (!(input instanceof HTMLInputElement)) return '';
    if (input.required && !form[name].trim()) {
      return `${fieldLabels[name]} is required.`;
    }
    if (input.validity.valueMissing) return `${fieldLabels[name]} is required.`;
    if (input.validity.typeMismatch) return 'Enter a valid email address.';
    if (input.validity.tooLong) {
      return `${fieldLabels[name]} must be ${input.maxLength} characters or fewer.`;
    }

    return '';
  }

  function validateForm(): FieldErrors {
    return fieldNames.reduce<FieldErrors>((errors, name) => {
      const message = validateField(name);
      if (message) errors[name] = message;
      return errors;
    }, {});
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
    setFieldErrors((previous) => ({ ...previous, [name]: undefined }));
    setError('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const validationErrors = validateForm();
    setFieldErrors(validationErrors);

    const firstInvalidField = fieldNames.find((name) => validationErrors[name]);
    if (firstInvalidField) {
      formRef.current
        ?.querySelector<HTMLInputElement>(`[name="${firstInvalidField}"]`)
        ?.focus();
      return;
    }

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
    <form
      ref={formRef}
      className="student-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="form-heading">
        <div className="form-heading-icon" aria-hidden="true">
          {initialStudent ? <CheckCircle2 size={22} /> : <UserRoundPlus size={22} />}
        </div>
        <div className="form-heading-copy">
          <span className="form-eyebrow">
            {initialStudent ? 'STUDENT PROFILE' : 'NEW ENROLLMENT'}
          </span>
          <h2>{initialStudent ? 'Student information' : 'Create student record'}</h2>
          <p>
            {initialStudent
              ? 'Make changes to the student details below.'
              : 'Add the student details to create their university record.'}
          </p>
        </div>
      </div>

      {error && (
        <div className="student-alert student-alert-error" role="alert" aria-live="assertive">
          <AlertCircle size={19} aria-hidden="true" />
          <div>
            <strong>We couldn’t save this student</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="studentNumber">Student Number *</label>
          <input
            id="studentNumber"
            name="studentNumber"
            aria-invalid={Boolean(fieldErrors.studentNumber)}
            aria-describedby={fieldErrors.studentNumber ? 'studentNumber-error' : undefined}
            value={form.studentNumber}
            onChange={handleChange}
            onBlur={() => setFieldErrors((previous) => ({
              ...previous,
              studentNumber: validateField('studentNumber') || undefined,
            }))}
            maxLength={20}
            required
            autoComplete="off"
            placeholder="e.g. STU-2026-001"
          />
          {fieldErrors.studentNumber && (
            <span className="field-error" id="studentNumber-error" role="status">
              {fieldErrors.studentNumber}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="firstName">First Name *</label>
          <input
            id="firstName"
            name="firstName"
            aria-invalid={Boolean(fieldErrors.firstName)}
            aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
            value={form.firstName}
            onChange={handleChange}
            onBlur={() => setFieldErrors((previous) => ({
              ...previous,
              firstName: validateField('firstName') || undefined,
            }))}
            maxLength={100}
            required
            autoComplete="given-name"
            placeholder="Enter first name"
          />
          {fieldErrors.firstName && (
            <span className="field-error" id="firstName-error" role="status">
              {fieldErrors.firstName}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="lastName">Last Name *</label>
          <input
            id="lastName"
            name="lastName"
            aria-invalid={Boolean(fieldErrors.lastName)}
            aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
            value={form.lastName}
            onChange={handleChange}
            onBlur={() => setFieldErrors((previous) => ({
              ...previous,
              lastName: validateField('lastName') || undefined,
            }))}
            maxLength={100}
            required
            autoComplete="family-name"
            placeholder="Enter last name"
          />
          {fieldErrors.lastName && (
            <span className="field-error" id="lastName-error" role="status">
              {fieldErrors.lastName}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            value={form.email}
            onChange={handleChange}
            onBlur={() => setFieldErrors((previous) => ({
              ...previous,
              email: validateField('email') || undefined,
            }))}
            maxLength={150}
            required
            autoComplete="email"
            placeholder="student@example.com"
          />
          {fieldErrors.email && (
            <span className="field-error" id="email-error" role="status">
              {fieldErrors.email}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            aria-invalid={Boolean(fieldErrors.dateOfBirth)}
            aria-describedby={fieldErrors.dateOfBirth ? 'dateOfBirth-error' : undefined}
            value={form.dateOfBirth}
            onChange={handleChange}
            onBlur={() => setFieldErrors((previous) => ({
              ...previous,
              dateOfBirth: validateField('dateOfBirth') || undefined,
            }))}
          />
          {fieldErrors.dateOfBirth && (
            <span className="field-error" id="dateOfBirth-error" role="status">
              {fieldErrors.dateOfBirth}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
            value={form.phone}
            onChange={handleChange}
            onBlur={() => setFieldErrors((previous) => ({
              ...previous,
              phone: validateField('phone') || undefined,
            }))}
            maxLength={30}
            autoComplete="tel"
            placeholder="Enter phone number"
          />
          {fieldErrors.phone && (
            <span className="field-error" id="phone-error" role="status">
              {fieldErrors.phone}
            </span>
          )}
        </div>
      </div>

      <p className="form-required-note">
        <span aria-hidden="true">*</span> Required fields
      </p>

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
          {isSubmitting ? (
            <LoaderCircle className="animate-spin" size={17} />
          ) : (
            <Save size={16} />
          )}
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
