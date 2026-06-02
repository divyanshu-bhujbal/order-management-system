import { apiClient } from '@/lib/api';
import { extractApiErrorMessage } from '@/lib/httpError';
import type { Product, ProductPayload } from '@/features/products/types';

export async function listProducts(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
    const response = await apiClient.post<Product>('/products', payload);
    return response.data;
}

export async function updateProduct(
    productId: number,
    payload: ProductPayload,
): Promise<Product> {
    const response = await apiClient.put<Product>(
        `/products/${productId}`,
        payload,
    );
    return response.data;
}

export async function deleteProduct(productId: number): Promise<void> {
    await apiClient.delete(`/products/${productId}`);
}

export function getApiErrorMessage(error: unknown): string {
    return extractApiErrorMessage(error);
}
