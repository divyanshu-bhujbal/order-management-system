import { apiClient } from '@/lib/api';
import { extractApiErrorMessage } from '@/lib/httpError';
import type { Order, OrderPayload } from '@/features/orders/types';

export async function listOrders(): Promise<Order[]> {
    const response = await apiClient.get<Order[]>('/orders');
    return response.data;
}

export async function getOrder(orderId: number): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/${orderId}`);
    return response.data;
}

export async function createOrder(payload: OrderPayload): Promise<Order> {
    const response = await apiClient.post<Order>('/orders', payload);
    return response.data;
}

export function getOrderApiErrorMessage(error: unknown): string {
    return extractApiErrorMessage(error);
}
