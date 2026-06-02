import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';
import { CustomerManagementPage } from '@/features/customers/pages/CustomerManagementPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { OrderManagementPage } from '@/features/orders/pages/OrderManagementPage';
import { ProductManagementPage } from '@/features/products/pages/ProductManagementPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppShell />,
        children: [
            {
                index: true,
                element: (
                    <Navigate
                        to='/dashboard'
                        replace
                    />
                ),
            },
            {
                path: 'products',
                element: <ProductManagementPage />,
            },
            {
                path: 'dashboard',
                element: <DashboardPage />,
            },
            {
                path: 'customers',
                element: <CustomerManagementPage />,
            },
            {
                path: 'orders',
                element: <OrderManagementPage />,
            },
        ],
    },
]);
