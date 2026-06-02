import { apiClient } from '@/lib/api';
import { extractApiErrorMessage } from '@/lib/httpError';
import type { DashboardData } from '@/features/dashboard/types';

export async function getDashboard(): Promise<DashboardData> {
    const response = await apiClient.get<DashboardData>('/dashboard');
    return response.data;
}

export function getDashboardApiErrorMessage(error: unknown): string {
    return extractApiErrorMessage(error);
}
