import type { Product } from '@/features/products/types';

type ProductTableProps = {
    products: Product[];
    isLoading: boolean;
    deletingProductId: number | null;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => Promise<void>;
};

export function ProductTable({
    products,
    isLoading,
    deletingProductId,
    onEdit,
    onDelete,
}: ProductTableProps): JSX.Element {
    return (
        <section className='product-panel'>
            <div className='product-panel__header'>
                <div>
                    <p className='section-eyebrow'>Inventory</p>
                    <h2>View products</h2>
                </div>
                <span className='product-count'>{products.length} items</span>
            </div>

            {isLoading ? <p className='banner'>Loading products...</p> : null}

            {!isLoading && products.length === 0 ? (
                <div className='empty-state empty-state--compact'>
                    <p className='empty-state__eyebrow'>No products</p>
                    <h2>Inventory is empty</h2>
                    <p>
                        Add the first product using the form to start managing
                        inventory.
                    </p>
                </div>
            ) : null}

            {!isLoading && products.length > 0 ? (
                <div className='product-table-wrapper'>
                    <table className='product-table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>SKU</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => {
                                const isDeleting =
                                    deletingProductId === product.id;

                                return (
                                    <tr key={product.id}>
                                        <td data-label='Name'>
                                            {product.name}
                                        </td>
                                        <td data-label='SKU'>{product.sku}</td>
                                        <td data-label='Price'>
                                            ${product.price}
                                        </td>
                                        <td data-label='Stock'>
                                            {product.quantity_in_stock}
                                        </td>
                                        <td data-label='Actions'>
                                            <div className='table-actions'>
                                                <button
                                                    className='button button--ghost'
                                                    type='button'
                                                    onClick={() =>
                                                        onEdit(product)
                                                    }
                                                    disabled={isDeleting}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className='button button--danger'
                                                    type='button'
                                                    onClick={() =>
                                                        onDelete(product)
                                                    }
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting
                                                        ? 'Deleting...'
                                                        : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : null}
        </section>
    );
}
