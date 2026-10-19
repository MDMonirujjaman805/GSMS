import axios from 'axios';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
  errors?: unknown;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  uptimeSeconds: number;
  service: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({
      success: false,
      message: error.message || 'Network communication error',
      errorCode: 'NETWORK_ERROR',
    });
  }
);

export const checkHealth = async (): Promise<ApiResponse<HealthStatus>> => {
  const response = await apiClient.get<ApiResponse<HealthStatus>>('/health');
  return response.data;
};
