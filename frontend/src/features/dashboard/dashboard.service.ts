import { apiClient, ApiResponse } from '../../services/api.service';
import { DashboardData } from '../../types/dashboard.types';

export const fetchDashboard = async (): Promise<DashboardData> => {
  const res = await apiClient.get<ApiResponse<DashboardData>>('/dashboard');
  if (!res.data.success || !res.data.data) throw new Error(res.data.message);
  return res.data.data;
};
