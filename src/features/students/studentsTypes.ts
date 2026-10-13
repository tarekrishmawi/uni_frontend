
export interface Student {
  id: number;
  studentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string | null;
  phone: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentRequest {
  studentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string | null;
  phone: string | null;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface StudentQuery {
  search: string;
  status: string;
  page: number;
  size: number;
  sortBy: string;
  direction: 'asc' | 'desc';
}
