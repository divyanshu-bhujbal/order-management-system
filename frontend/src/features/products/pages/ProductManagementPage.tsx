import { useEffect, useState } from 'react';
import {
    createProduct,
    deleteProduct,
    getApiErrorMessage,
    listProducts,
    updateProduct,
} from '@/features/products/api';
import { ProductForm } from '@/features/products/components/ProductForm';
import { ProductTable } from '@/features/products/components/ProductTable';
import type { Product, ProductPayload } from '@/features/products/types';

export function ProductManagementPage(): JSX.Element {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProductId, setDeletingProductId] = useState<number | null>(
        null,
    );

    async function loadProducts(): Promise<void> {
        setIsLoading(true);
        setLoadError(null);

        try {
            const nextProducts = await listProducts();
            setProducts(nextProducts);
        } catch (error) {
            setLoadError(getApiErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void loadProducts();
    }, []);

    async function handleSubmit(payload: ProductPayload): Promise<boolean> {
        setIsSubmitting(true);
        setSubmitError(null);
        setSuccessMessage(null);

        try {
            if (editingProduct) {
                const updatedProduct = await updateProduct(
                    editingProduct.id,
                    payload,
                );
                setProducts((currentProducts) =>
                    currentProducts.map((product) =>
                        product.id === updatedProduct.id
                            ? updatedProduct
                            : product,
                    ),
                );
                setEditingProduct(null);
                setSuccessMessage('Product updated successfully.');
                return true;
            }

            const createdProduct = await createProduct(payload);
            setProducts((currentProducts) => [
                ...currentProducts,
                createdProduct,
            ]);
            setSuccessMessage('Product added successfully.');
            return true;
        } catch (error) {
            setSubmitError(getApiErrorMessage(error));
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(product: Product): Promise<void> {
        const confirmed = window.confirm(
            `Delete ${product.name} (${product.sku})?`,
        );
        if (!confirmed) {
            return;
        }

        setDeletingProductId(product.id);
        setLoadError(null);
        setSuccessMessage(null);

        try {
            await deleteProduct(product.id);
            setProducts((currentProducts) =>
                currentProducts.filter((item) => item.id !== product.id),
            );
            setSuccessMessage('Product deleted successfully.');

            if (editingProduct?.id === product.id) {
                setEditingProduct(null);
            }
        } catch (error) {
            setLoadError(getApiErrorMessage(error));
        } finally {
            setDeletingProductId(null);
        }
    }

    return (
        <div className='product-page'>
            <section className='hero-card'>
                <div>
                    <p className='section-eyebrow'>Product management</p>
                    <h1>Manage inventory products</h1>
                    <p>
                        Create, update, review, and delete products against the
                        backend API with client-side validation and clear
                        loading feedback.
                    </p>
                </div>
            </section>

            {loadError ? (
                <div className='banner-row'>
                    <p className='banner banner--error'>{loadError}</p>
                    <button
                        className='button button--ghost'
                        type='button'
                        onClick={() => void loadProducts()}
                    >
                        Retry
                    </button>
                </div>
            ) : null}

            {successMessage ? (
                <p className='banner banner--success'>{successMessage}</p>
            ) : null}

            <div className='product-layout'>
                <ProductForm
                    initialProduct={editingProduct}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                    onCancelEdit={() => {
                        setEditingProduct(null);
                        setSubmitError(null);
                        setSuccessMessage(null);
                    }}
                    onSubmit={handleSubmit}
                />

                <ProductTable
                    products={products}
                    isLoading={isLoading}
                    deletingProductId={deletingProductId}
                    onEdit={(product) => {
                        setEditingProduct(product);
                        setSubmitError(null);
                        setSuccessMessage(null);
                    }}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
