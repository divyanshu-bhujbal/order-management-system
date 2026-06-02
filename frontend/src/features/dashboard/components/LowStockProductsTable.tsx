import type { LowStockProduct } from '@/features/dashboard/types';

type LowStockProductsTableProps = {
    products: LowStockProduct[];
    isLoading: boolean;
};

export function LowStockProductsTable({
    products,
    isLoading,
}: LowStockProductsTableProps): JSX.Element {
    return (
        <section className='product-panel'>
            <div className='product-panel__header'>
                <div>
                    <p className='section-eyebrow'>Inventory watch</p>
                    <h2>Low stock products</h2>
                </div>
                <span className='product-count'>{products.length} items</span>
            </div>

            {isLoading ? (
                <p className='banner'>Loading dashboard data...</p>
            ) : null}

            {!isLoading && products.length === 0 ? (
                <div className='empty-state empty-state--compact'>
                    <p className='empty-state__eyebrow'>All healthy</p>
                    <h2>No low stock products</h2>
                    <p>
                        Inventory levels are above the configured low stock
                        threshold.
                    </p>
                </div>
            ) : null}

            {!isLoading && products.length > 0 ? (
                <div className='product-table-wrapper'>
                    <table className='product-table'>
                        <thead>
                            <tr>
                                <th>Product name</th>
                                <th>SKU</th>
                                <th>Quantity in stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td data-label='Product name'>
                                        {product.name}
                                    </td>
                                    <td data-label='SKU'>{product.sku}</td>
                                    <td data-label='Quantity in stock'>
                                        <span className='stock-chip'>
                                            {product.quantity_in_stock}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : null}
        </section>
    );
}
