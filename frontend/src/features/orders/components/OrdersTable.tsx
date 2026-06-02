import type { Customer } from '@/features/customers/types';
import type { Order } from '@/features/orders/types';

type OrdersTableProps = {
    orders: Order[];
    customers: Customer[];
    isLoading: boolean;
    selectedOrderId: number | null;
    onSelectOrder: (orderId: number) => void;
};

function resolveCustomerName(
    customerId: number,
    customers: Customer[],
): string {
    return (
        customers.find((customer) => customer.id === customerId)?.full_name ||
        `Customer #${customerId}`
    );
}

export function OrdersTable({
    orders,
    customers,
    isLoading,
    selectedOrderId,
    onSelectOrder,
}: OrdersTableProps): JSX.Element {
    return (
        <section className='product-panel'>
            <div className='product-panel__header'>
                <div>
                    <p className='section-eyebrow'>Orders</p>
                    <h2>View orders</h2>
                </div>
                <span className='product-count'>{orders.length} items</span>
            </div>

            {isLoading ? <p className='banner'>Loading orders...</p> : null}

            {!isLoading && orders.length === 0 ? (
                <div className='empty-state empty-state--compact'>
                    <p className='empty-state__eyebrow'>No orders</p>
                    <h2>Order list is empty</h2>
                    <p>
                        Create the first order using the form to begin tracking
                        sales.
                    </p>
                </div>
            ) : null}

            {!isLoading && orders.length > 0 ? (
                <div className='product-table-wrapper'>
                    <table className='product-table'>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td data-label='Order ID'>#{order.id}</td>
                                    <td data-label='Customer'>
                                        {resolveCustomerName(
                                            order.customer_id,
                                            customers,
                                        )}
                                    </td>
                                    <td data-label='Total'>
                                        ${Number(order.total_amount).toFixed(2)}
                                    </td>
                                    <td data-label='Created'>
                                        {new Date(
                                            order.created_at,
                                        ).toLocaleString()}
                                    </td>
                                    <td data-label='Actions'>
                                        <div className='table-actions'>
                                            <button
                                                className='button button--ghost'
                                                type='button'
                                                onClick={() =>
                                                    onSelectOrder(order.id)
                                                }
                                            >
                                                {selectedOrderId === order.id
                                                    ? 'Viewing'
                                                    : 'View details'}
                                            </button>
                                        </div>
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
