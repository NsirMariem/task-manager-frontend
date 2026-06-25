import axiosInstance from '../api/axiosInstance';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  createdAt: string;
  updatedAt: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export const taskApi = {
  getTasks: () => axiosInstance.get<Task[]>('/tasks'),
  createTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) =>
    axiosInstance.post<Task>('/tasks', data),
  updateTask: (id: number, data: Partial<Task>) =>
    axiosInstance.put<Task>(`/tasks/${id}`, data),
  deleteTask: (id: number) =>
    axiosInstance.delete(`/tasks/${id}`),
};

export const authApi = {
  getCsrfToken: () => axiosInstance.get('/auth/csrf'),
  login: (data: AuthRequest) => axiosInstance.post('/auth/login', data),
  register: (data: AuthRequest) => axiosInstance.post('/auth/register', data),
  logout: () => axiosInstance.post('/auth/logout'),
  checkAuth: () => axiosInstance.get('/auth/check'),
};
