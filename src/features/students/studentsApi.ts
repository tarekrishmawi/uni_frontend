
import axiosClient from '../../api/axiosClient';
import type {
  PageResponse,
  Student,
  StudentQuery,
  StudentRequest,
} from './studentsTypes';

export async function fetchStudents(
  query: StudentQuery,
): Promise<PageResponse<Student>> {
  const response = await axiosClient.get<PageResponse<Student>>(
    '/students',
    {
      params: {
        search: query.search || undefined,
        status: query.status || undefined,
        page: query.page,
        size: query.size,
        sortBy: query.sortBy,
        direction: query.direction,
      },
    },
  );

  return response.data;
}

export async function fetchStudent(id: number): Promise<Student> {
  const response = await axiosClient.get<Student>(`/students/${id}`);
  return response.data;
}

export async function createStudent(
  request: StudentRequest,
): Promise<Student> {
  const response = await axiosClient.post<Student>(
    '/students',
    request,
  );

  return response.data;
}

export async function updateStudent(
  id: number,
  request: StudentRequest,
): Promise<Student> {
  const response = await axiosClient.put<Student>(
    `/students/${id}`,
    request,
  );

  return response.data;
}

export async function deleteStudent(id: number): Promise<void> {
  await axiosClient.delete(`/students/${id}`);
}
