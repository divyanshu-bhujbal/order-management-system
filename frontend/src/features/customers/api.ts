import { apiClient } from '@/lib/api';
import { extractApiErrorMessage } from '@/lib/httpError';
import type { Customer, CustomerPayload } from '@/features/customers/types';

export async function listCustomers(): Promise<Customer[]> {
    const response = await apiClient.get<Customer[]>('/customers');
    return response.data;
}

export async function createCustomer(
    payload: CustomerPayload,
): Promise<Customer> {
    const response = await apiClient.post<Customer>('/customers', payload);
    return response.data;
}

export async function deleteCustomer(customerId: number): Promise<void> {
    await apiClient.delete(`/customers/${customerId}`);
}

export function getCustomerApiErrorMessage(error: unknown): string {
    return extractApiErrorMessage(error);
}
