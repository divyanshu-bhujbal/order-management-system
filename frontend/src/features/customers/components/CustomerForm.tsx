import { useState } from 'react';
import type {
    CustomerFormErrors,
    CustomerFormValues,
    CustomerPayload,
} from '@/features/customers/types';
import {
    defaultCustomerFormValues,
    toCustomerPayload,
    validateCustomerForm,
} from '@/features/customers/validation';

type CustomerFormProps = {
    isSubmitting: boolean;
    submitError: string | null;
    onSubmit: (values: CustomerPayload) => Promise<boolean>;
};

export function CustomerForm({
    isSubmitting,
    submitError,
    onSubmit,
}: CustomerFormProps): JSX.Element {
    const [values, setValues] = useState<CustomerFormValues>(
        defaultCustomerFormValues,
    );
    const [errors, setErrors] = useState<CustomerFormErrors>({});

    function updateValue(field: keyof CustomerFormValues, value: string): void {
        setValues((currentValues) => ({
            ...currentValues,
            [field]: value,
        }));

        setErrors((currentErrors) => {
            if (!currentErrors[field]) {
                return currentErrors;
            }

            return {
                ...currentErrors,
                [field]: undefined,
            };
        });
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        const nextErrors = validateCustomerForm(values);
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        const success = await onSubmit(toCustomerPayload(values));
        if (success) {
            setValues(defaultCustomerFormValues);
            setErrors({});
        }
    }

    return (
        <section className='product-panel'>
            <div className='product-panel__header'>
                <div>
                    <p className='section-eyebrow'>Customer form</p>
                    <h2>Add customer</h2>
                </div>
            </div>

            <form
                className='product-form'
                onSubmit={handleSubmit}
                noValidate
            >
                <div className='product-form__grid'>
                    <label className='field'>
                        <span className='field__label'>Full name</span>
                        <input
                            value={values.full_name}
                            onChange={(event) =>
                                updateValue('full_name', event.target.value)
                            }
                            placeholder='Jordan Smith'
                            disabled={isSubmitting}
                        />
                        {errors.full_name ? (
                            <span className='field__error'>
                                {errors.full_name}
                            </span>
                        ) : null}
                    </label>

                    <label className='field'>
                        <span className='field__label'>Email</span>
                        <input
                            type='email'
                            value={values.email}
                            onChange={(event) =>
                                updateValue('email', event.target.value)
                            }
                            placeholder='jordan@example.com'
                            disabled={isSubmitting}
                        />
                        {errors.email ? (
                            <span className='field__error'>{errors.email}</span>
                        ) : null}
                    </label>

                    <label className='field'>
                        <span className='field__label'>Phone number</span>
                        <input
                            value={values.phone_number}
                            onChange={(event) =>
                                updateValue('phone_number', event.target.value)
                            }
                            placeholder='+1 555 0100'
                            disabled={isSubmitting}
                        />
                        {errors.phone_number ? (
                            <span className='field__error'>
                                {errors.phone_number}
                            </span>
                        ) : null}
                    </label>
                </div>

                {submitError ? (
                    <p className='banner banner--error'>{submitError}</p>
                ) : null}

                <div className='product-form__actions'>
                    <button
                        className='button button--primary'
                        type='submit'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Add customer'}
                    </button>
                </div>
            </form>
        </section>
    );
}
