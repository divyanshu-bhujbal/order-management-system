import type { Customer } from '@/features/customers/types';

type CustomerTableProps = {
    customers: Customer[];
    isLoading: boolean;
    deletingCustomerId: number | null;
    onDelete: (customer: Customer) => Promise<void>;
};

export function CustomerTable({
    customers,
    isLoading,
    deletingCustomerId,
    onDelete,
}: CustomerTableProps): JSX.Element {
    return (
        <section className='product-panel'>
            <div className='product-panel__header'>
                <div>
                    <p className='section-eyebrow'>Customers</p>
                    <h2>View customers</h2>
                </div>
                <span className='product-count'>{customers.length} items</span>
            </div>

            {isLoading ? <p className='banner'>Loading customers...</p> : null}

            {!isLoading && customers.length === 0 ? (
                <div className='empty-state empty-state--compact'>
                    <p className='empty-state__eyebrow'>No customers</p>
                    <h2>Customer list is empty</h2>
                    <p>
                        Add the first customer using the form to start managing
                        customer records.
                    </p>
                </div>
            ) : null}

            {!isLoading && customers.length > 0 ? (
                <div className='product-table-wrapper'>
                    <table className='product-table'>
                        <thead>
                            <tr>
                                <th>Full name</th>
                                <th>Email</th>
                                <th>Phone number</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => {
                                const isDeleting =
                                    deletingCustomerId === customer.id;

                                return (
                                    <tr key={customer.id}>
                                        <td data-label='Full name'>
                                            {customer.full_name}
                                        </td>
                                        <td data-label='Email'>
                                            {customer.email}
                                        </td>
                                        <td data-label='Phone number'>
                                            {customer.phone_number}
                                        </td>
                                        <td data-label='Actions'>
                                            <div className='table-actions'>
                                                <button
                                                    className='button button--danger'
                                                    type='button'
                                                    onClick={() =>
                                                        onDelete(customer)
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
