type SummaryCardsProps = {
    totalProducts: number;
    totalCustomers: number;
    totalOrders: number;
    isLoading: boolean;
};

export function SummaryCards({
    totalProducts,
    totalCustomers,
    totalOrders,
    isLoading,
}: SummaryCardsProps): JSX.Element {
    const productsValue = isLoading ? '--' : totalProducts.toLocaleString();
    const customersValue = isLoading ? '--' : totalCustomers.toLocaleString();
    const ordersValue = isLoading ? '--' : totalOrders.toLocaleString();

    return (
        <section className='dashboard-cards'>
            <article className='dashboard-card'>
                <p className='section-eyebrow'>Products</p>
                <h2>{productsValue}</h2>
                <p className='dashboard-card__meta'>
                    Total products in catalog
                </p>
            </article>

            <article className='dashboard-card'>
                <p className='section-eyebrow'>Customers</p>
                <h2>{customersValue}</h2>
                <p className='dashboard-card__meta'>
                    Registered customer records
                </p>
            </article>

            <article className='dashboard-card'>
                <p className='section-eyebrow'>Orders</p>
                <h2>{ordersValue}</h2>
                <p className='dashboard-card__meta'>
                    Orders captured in the system
                </p>
            </article>
        </section>
    );
}
