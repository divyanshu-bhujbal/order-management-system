import { useEffect, useState } from 'react';
import {
    getOrder,
    getOrderApiErrorMessage,
    listOrders,
    createOrder,
} from '@/features/orders/api';
import { OrderDetailsPanel } from '@/features/orders/components/OrderDetailsPanel';
import { OrderForm } from '@/features/orders/components/OrderForm';
import { OrdersTable } from '@/features/orders/components/OrdersTable';
import type { Customer } from '@/features/customers/types';
import { listCustomers } from '@/features/customers/api';
import type { Product } from '@/features/products/types';
import { listProducts } from '@/features/products/api';
import type { Order, OrderPayload } from '@/features/orders/types';

export function OrderManagementPage(): JSX.Element {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [detailsError, setDetailsError] = useState<string | null>(null);

    async function loadData(): Promise<void> {
        setIsLoading(true);
        setLoadError(null);

        try {
            const [nextCustomers, nextProducts, nextOrders] = await Promise.all(
                [listCustomers(), listProducts(), listOrders()],
            );

            setCustomers(nextCustomers);
            setProducts(nextProducts);
            setOrders(nextOrders);
        } catch (error) {
            setLoadError(getOrderApiErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void loadData();
    }, []);

    async function handleCreateOrder(payload: OrderPayload): Promise<boolean> {
        setIsSubmitting(true);
        setSubmitError(null);
        setSuccessMessage(null);

        try {
            const createdOrder = await createOrder(payload);
            setOrders((currentOrders) => [createdOrder, ...currentOrders]);

            const refreshedProducts = await listProducts();
            setProducts(refreshedProducts);

            setSelectedOrderId(createdOrder.id);
            setSelectedOrder(createdOrder);
            setDetailsError(null);
            setSuccessMessage('Order created successfully.');
            return true;
        } catch (error) {
            setSubmitError(getOrderApiErrorMessage(error));
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleSelectOrder(orderId: number): Promise<void> {
        setSelectedOrderId(orderId);
        setIsLoadingDetails(true);
        setDetailsError(null);
        setSuccessMessage(null);

        try {
            const order = await getOrder(orderId);
            setSelectedOrder(order);
            setSuccessMessage(`Loaded details for order #${order.id}.`);
        } catch (error) {
            setDetailsError(getOrderApiErrorMessage(error));
        } finally {
            setIsLoadingDetails(false);
        }
    }

    return (
        <div className='product-page'>
            <section className='hero-card'>
                <div>
                    <p className='section-eyebrow'>Order management</p>
                    <h1>Create and inspect orders</h1>
                    <p>
                        Build orders from live customers and products, validate
                        item selections, review totals automatically, and
                        inspect completed order details.
                    </p>
                </div>
            </section>

            {loadError ? (
                <div className='banner-row'>
                    <p className='banner banner--error'>{loadError}</p>
                    <button
                        className='button button--ghost'
                        type='button'
                        onClick={() => void loadData()}
                    >
                        Retry
                    </button>
                </div>
            ) : null}

            {successMessage ? (
                <p className='banner banner--success'>{successMessage}</p>
            ) : null}

            <div className='order-layout'>
                <OrderForm
                    customers={customers}
                    products={products}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                    onSubmit={handleCreateOrder}
                />

                <div className='order-layout__content'>
                    <OrdersTable
                        orders={orders}
                        customers={customers}
                        isLoading={isLoading}
                        selectedOrderId={selectedOrderId}
                        onSelectOrder={(orderId) => {
                            void handleSelectOrder(orderId);
                        }}
                    />

                    <OrderDetailsPanel
                        order={selectedOrder}
                        customers={customers}
                        products={products}
                        isLoading={isLoadingDetails}
                        error={detailsError}
                    />
                </div>
            </div>
        </div>
    );
}
