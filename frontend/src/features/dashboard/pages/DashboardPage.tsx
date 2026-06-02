import { useEffect, useState } from 'react';
import {
    getDashboard,
    getDashboardApiErrorMessage,
} from '@/features/dashboard/api';
import { LowStockProductsTable } from '@/features/dashboard/components/LowStockProductsTable';
import { SummaryCards } from '@/features/dashboard/components/SummaryCards';
import type { DashboardData } from '@/features/dashboard/types';

export function DashboardPage(): JSX.Element {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    async function loadDashboard(showRefreshMessage = false): Promise<void> {
        setIsLoading(true);
        setLoadError(null);

        if (showRefreshMessage) {
            setSuccessMessage(null);
        }

        try {
            const nextData = await getDashboard();
            setData(nextData);

            if (showRefreshMessage) {
                setSuccessMessage('Dashboard refreshed successfully.');
            }
        } catch (error) {
            setLoadError(getDashboardApiErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void loadDashboard();
    }, []);

    return (
        <div className='product-page'>
            <section className='hero-card'>
                <div>
                    <p className='section-eyebrow'>Dashboard</p>
                    <h1>Operations overview</h1>
                    <p>
                        Track business totals and quickly identify products that
                        are running low in inventory.
                    </p>
                </div>
            </section>

            {loadError ? (
                <div className='banner-row'>
                    <p className='banner banner--error'>{loadError}</p>
                    <button
                        className='button button--ghost'
                        type='button'
                        onClick={() => void loadDashboard(true)}
                    >
                        Retry
                    </button>
                </div>
            ) : null}

            {successMessage ? (
                <div className='banner-row'>
                    <p className='banner banner--success'>{successMessage}</p>
                    <button
                        className='button button--ghost'
                        type='button'
                        onClick={() => void loadDashboard(true)}
                    >
                        Refresh
                    </button>
                </div>
            ) : null}

            {!loadError && !successMessage ? (
                <div className='banner-row'>
                    <p className='banner'>
                        Live metrics are shown from the backend.
                    </p>
                    <button
                        className='button button--ghost'
                        type='button'
                        onClick={() => void loadDashboard(true)}
                    >
                        Refresh
                    </button>
                </div>
            ) : null}

            <SummaryCards
                totalProducts={data?.total_products ?? 0}
                totalCustomers={data?.total_customers ?? 0}
                totalOrders={data?.total_orders ?? 0}
                isLoading={isLoading}
            />

            <LowStockProductsTable
                products={data?.low_stock_products ?? []}
                isLoading={isLoading}
            />
        </div>
    );
}
