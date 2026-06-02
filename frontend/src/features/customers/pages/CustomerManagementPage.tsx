import { useEffect, useState } from 'react';
import {
    createCustomer,
    deleteCustomer,
    getCustomerApiErrorMessage,
    listCustomers,
} from '@/features/customers/api';
import { CustomerForm } from '@/features/customers/components/CustomerForm';
import { CustomerTable } from '@/features/customers/components/CustomerTable';
import type { Customer, CustomerPayload } from '@/features/customers/types';

export function CustomerManagementPage(): JSX.Element {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingCustomerId, setDeletingCustomerId] = useState<number | null>(
        null,
    );

    async function loadCustomers(): Promise<void> {
        setIsLoading(true);
        setLoadError(null);

        try {
            const nextCustomers = await listCustomers();
            setCustomers(nextCustomers);
        } catch (error) {
            setLoadError(getCustomerApiErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void loadCustomers();
    }, []);

    async function handleSubmit(payload: CustomerPayload): Promise<boolean> {
        setIsSubmitting(true);
        setSubmitError(null);
        setSuccessMessage(null);

        try {
            const createdCustomer = await createCustomer(payload);
            setCustomers((currentCustomers) => [
                ...currentCustomers,
                createdCustomer,
            ]);
            setSuccessMessage('Customer added successfully.');
            return true;
        } catch (error) {
            setSubmitError(getCustomerApiErrorMessage(error));
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(customer: Customer): Promise<void> {
        const confirmed = window.confirm(
            `Delete ${customer.full_name} (${customer.email})?`,
        );
        if (!confirmed) {
            return;
        }

        setDeletingCustomerId(customer.id);
        setLoadError(null);
        setSuccessMessage(null);

        try {
            await deleteCustomer(customer.id);
            setCustomers((currentCustomers) =>
                currentCustomers.filter((item) => item.id !== customer.id),
            );
            setSuccessMessage('Customer deleted successfully.');
        } catch (error) {
            setLoadError(getCustomerApiErrorMessage(error));
        } finally {
            setDeletingCustomerId(null);
        }
    }

    return (
        <div className='product-page'>
            <section className='hero-card'>
                <div>
                    <p className='section-eyebrow'>Customer management</p>
                    <h1>Manage customer records</h1>
                    <p>
                        Create, review, and delete customers against the backend
                        API with form validation and visible loading feedback.
                    </p>
                </div>
            </section>

            {loadError ? (
                <div className='banner-row'>
                    <p className='banner banner--error'>{loadError}</p>
                    <button
                        className='button button--ghost'
                        type='button'
                        onClick={() => void loadCustomers()}
                    >
                        Retry
                    </button>
                </div>
            ) : null}

            {successMessage ? (
                <p className='banner banner--success'>{successMessage}</p>
            ) : null}

            <div className='product-layout'>
                <CustomerForm
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                    onSubmit={handleSubmit}
                />

                <CustomerTable
                    customers={customers}
                    isLoading={isLoading}
                    deletingCustomerId={deletingCustomerId}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
