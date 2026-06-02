import type { Customer } from '@/features/customers/types';
import type { Product } from '@/features/products/types';
import type { Order } from '@/features/orders/types';

type OrderDetailsPanelProps = {
    order: Order | null;
    customers: Customer[];
    products: Product[];
    isLoading: boolean;
    error: string | null;
};

function resolveCustomer(customerId: number, customers: Customer[]): string {
    return (
        customers.find((customer) => customer.id === customerId)?.full_name ||
        `Customer #${customerId}`
    );
}

function resolveProduct(productId: number, products: Product[]): string {
    const product = products.find((entry) => entry.id === productId);
    if (!product) {
        return `Product #${productId}`;
    }

    return `${product.name} (${product.sku})`;
}

export function OrderDetailsPanel({
    order,
    customers,
    products,
    isLoading,
    error,
}: OrderDetailsPanelProps): JSX.Element {
    return (
        <section className='product-panel'>
            <div className='product-panel__header'>
                <div>
                    <p className='section-eyebrow'>Order details</p>
                    <h2>{order ? `Order #${order.id}` : 'Select an order'}</h2>
                </div>
            </div>

            {isLoading ? (
                <p className='banner'>Loading order details...</p>
            ) : null}
            {error ? <p className='banner banner--error'>{error}</p> : null}

            {!isLoading && !error && !order ? (
                <div className='empty-state empty-state--compact'>
                    <p className='empty-state__eyebrow'>No order selected</p>
                    <h2>Choose an order to inspect</h2>
                    <p>
                        Select an order from the list to review customer, line
                        items, quantities, and total amount.
                    </p>
                </div>
            ) : null}

            {!isLoading && !error && order ? (
                <div className='order-details'>
                    <div className='order-details__summary'>
                        <div>
                            <p className='section-eyebrow'>Customer</p>
                            <h3>
                                {resolveCustomer(order.customer_id, customers)}
                            </h3>
                        </div>
                        <div>
                            <p className='section-eyebrow'>Total</p>
                            <h3>${Number(order.total_amount).toFixed(2)}</h3>
                        </div>
                        <div>
                            <p className='section-eyebrow'>Created</p>
                            <h3>
                                {new Date(order.created_at).toLocaleString()}
                            </h3>
                        </div>
                    </div>

                    <div className='product-table-wrapper'>
                        <table className='product-table'>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price at purchase</th>
                                    <th>Line total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.order_items.map((item) => (
                                    <tr key={item.id}>
                                        <td data-label='Product'>
                                            {resolveProduct(
                                                item.product_id,
                                                products,
                                            )}
                                        </td>
                                        <td data-label='Quantity'>
                                            {item.quantity}
                                        </td>
                                        <td data-label='Price at purchase'>
                                            $
                                            {Number(
                                                item.price_at_purchase,
                                            ).toFixed(2)}
                                        </td>
                                        <td data-label='Line total'>
                                            $
                                            {(
                                                Number(item.price_at_purchase) *
                                                item.quantity
                                            ).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
