
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import {
  createStudent,
  deleteStudent,
  fetchStudents,
  updateStudent,
} from './studentsApi';

import type {
  PageResponse,
  Student,
  StudentQuery,
  StudentRequest,
} from './studentsTypes';

interface StudentsState {
  data: Student[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: StudentsState = {
  data: [],
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  loading: false,
  saving: false,
  error: null,
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 400) {
      return error.response.data?.message ?? 'Please check the submitted data.';
    }

    if (error.response?.status === 409) {
      return error.response.data?.message ?? 'A student with this number or email already exists.';
    }

    return error.response?.data?.message ?? 'The request could not be completed.';
  }

  return 'An unexpected error occurred.';
}

export const loadStudents = createAsyncThunk<
  PageResponse<Student>,
  StudentQuery,
  { rejectValue: string }
>('students/load', async (query, { rejectWithValue }) => {
  try {
    return await fetchStudents(query);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const addStudent = createAsyncThunk<
  Student,
  StudentRequest,
  { rejectValue: string }
>('students/add', async (request, { rejectWithValue }) => {
  try {
    return await createStudent(request);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const editStudent = createAsyncThunk<
  Student,
  { id: number; request: StudentRequest },
  { rejectValue: string }
>('students/edit', async ({ id, request }, { rejectWithValue }) => {
  try {
    return await updateStudent(id, request);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const removeStudent = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('students/remove', async (id, { rejectWithValue }) => {
  try {
    await deleteStudent(id);
    return id;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearStudentsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.content;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(loadStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load students.';
      })
      .addCase(addStudent.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.saving = false;
        state.data.unshift(action.payload);
        state.totalElements += 1;
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Failed to create student.';
      })
      .addCase(editStudent.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(editStudent.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.data.findIndex(
          (student) => student.id === action.payload.id,
        );

        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(editStudent.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Failed to update student.';
      })
      .addCase(removeStudent.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(removeStudent.fulfilled, (state, action) => {
        state.saving = false;
        state.data = state.data.filter(
          (student) => student.id !== action.payload,
        );
        state.totalElements = Math.max(0, state.totalElements - 1);
      })
      .addCase(removeStudent.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Failed to delete student.';
      });
  },
});

export const { clearStudentsError } = studentsSlice.actions;
export default studentsSlice.reducer;
