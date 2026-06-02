import { useMemo, useState } from 'react';
import type { Customer } from '@/features/customers/types';
import type { Product } from '@/features/products/types';
import type {
    OrderFormErrors,
    OrderFormItem,
    OrderFormValues,
    OrderPayload,
} from '@/features/orders/types';
import {
    calculateOrderTotal,
    defaultOrderFormValues,
    defaultOrderItem,
    hasOrderFormErrors,
    toOrderPayload,
    validateOrderForm,
} from '@/features/orders/validation';

type OrderFormProps = {
    customers: Customer[];
    products: Product[];
    isSubmitting: boolean;
    submitError: string | null;
    onSubmit: (payload: OrderPayload) => Promise<boolean>;
};

export function OrderForm({
    customers,
    products,
    isSubmitting,
    submitError,
    onSubmit,
}: OrderFormProps): JSX.Element {
    const [values, setValues] = useState<OrderFormValues>(
        defaultOrderFormValues,
    );
    const [errors, setErrors] = useState<OrderFormErrors>({ itemErrors: [{}] });

    const totalAmount = useMemo(
        () => calculateOrderTotal(values.items, products),
        [values.items, products],
    );

    function updateCustomer(customerId: string): void {
        setValues((currentValues) => ({
            ...currentValues,
            customer_id: customerId,
        }));

        setErrors((currentErrors) => ({
            ...currentErrors,
            customer_id: undefined,
        }));
    }

    function updateItem(
        index: number,
        field: keyof OrderFormItem,
        value: string,
    ): void {
        setValues((currentValues) => ({
            ...currentValues,
            items: currentValues.items.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: value } : item,
            ),
        }));

        setErrors((currentErrors) => ({
            ...currentErrors,
            items: undefined,
            itemErrors: currentErrors.itemErrors.map((itemError, itemIndex) =>
                itemIndex === index
                    ? {
                          ...itemError,
                          [field]: undefined,
                      }
                    : itemError,
            ),
        }));
    }

    function addItem(): void {
        setValues((currentValues) => ({
            ...currentValues,
            items: [...currentValues.items, { ...defaultOrderItem }],
        }));

        setErrors((currentErrors) => ({
            ...currentErrors,
            itemErrors: [...currentErrors.itemErrors, {}],
        }));
    }

    function removeItem(index: number): void {
        setValues((currentValues) => ({
            ...currentValues,
            items: currentValues.items.filter(
                (_, itemIndex) => itemIndex !== index,
            ),
        }));

        setErrors((currentErrors) => ({
            ...currentErrors,
            itemErrors: currentErrors.itemErrors.filter(
                (_, itemIndex) => itemIndex !== index,
            ),
        }));
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        const nextErrors = validateOrderForm(values, products);
        setErrors(nextErrors);

        if (hasOrderFormErrors(nextErrors)) {
            return;
        }

        const created = await onSubmit(toOrderPayload(values));
        if (created) {
            setValues(defaultOrderFormValues);
            setErrors({ itemErrors: [{}] });
        }
    }

    return (
        <section className='product-panel'>
            <div className='product-panel__header'>
                <div>
                    <p className='section-eyebrow'>Order form</p>
                    <h2>Create order</h2>
                </div>
                <span className='product-count'>${totalAmount.toFixed(2)}</span>
            </div>

            <form
                className='product-form'
                onSubmit={handleSubmit}
                noValidate
            >
                <label className='field'>
                    <span className='field__label'>Customer</span>
                    <select
                        value={values.customer_id}
                        onChange={(event) => updateCustomer(event.target.value)}
                        disabled={isSubmitting || customers.length === 0}
                    >
                        <option value=''>Select a customer</option>
                        {customers.map((customer) => (
                            <option
                                key={customer.id}
                                value={customer.id}
                            >
                                {customer.full_name} ({customer.email})
                            </option>
                        ))}
                    </select>
                    {errors.customer_id ? (
                        <span className='field__error'>
                            {errors.customer_id}
                        </span>
                    ) : null}
                </label>

                <div className='order-items'>
                    <div className='order-items__header'>
                        <p className='section-eyebrow'>Products</p>
                        <button
                            className='button button--ghost'
                            type='button'
                            onClick={addItem}
                            disabled={isSubmitting || products.length === 0}
                        >
                            Add item
                        </button>
                    </div>

                    {errors.items ? (
                        <p className='field__error'>{errors.items}</p>
                    ) : null}

                    {values.items.map((item, index) => {
                        const selectedProduct = products.find(
                            (product) => product.id === Number(item.product_id),
                        );
                        const itemError = errors.itemErrors[index] ?? {};

                        return (
                            <div
                                className='order-item-card'
                                key={`${index}-${item.product_id}`}
                            >
                                <label className='field'>
                                    <span className='field__label'>
                                        Product
                                    </span>
                                    <select
                                        value={item.product_id}
                                        onChange={(event) =>
                                            updateItem(
                                                index,
                                                'product_id',
                                                event.target.value,
                                            )
                                        }
                                        disabled={
                                            isSubmitting ||
                                            products.length === 0
                                        }
                                    >
                                        <option value=''>
                                            Select a product
                                        </option>
                                        {products.map((product) => (
                                            <option
                                                key={product.id}
                                                value={product.id}
                                            >
                                                {product.name} ({product.sku})
                                            </option>
                                        ))}
                                    </select>
                                    {itemError.product_id ? (
                                        <span className='field__error'>
                                            {itemError.product_id}
                                        </span>
                                    ) : null}
                                </label>

                                <label className='field'>
                                    <span className='field__label'>
                                        Quantity
                                    </span>
                                    <input
                                        value={item.quantity}
                                        onChange={(event) =>
                                            updateItem(
                                                index,
                                                'quantity',
                                                event.target.value,
                                            )
                                        }
                                        inputMode='numeric'
                                        placeholder='1'
                                        disabled={isSubmitting}
                                    />
                                    {itemError.quantity ? (
                                        <span className='field__error'>
                                            {itemError.quantity}
                                        </span>
                                    ) : null}
                                </label>

                                <div className='order-item-meta'>
                                    <p>
                                        Price:{' '}
                                        <strong>
                                            {selectedProduct
                                                ? `$${Number(
                                                      selectedProduct.price,
                                                  ).toFixed(2)}`
                                                : 'Select a product'}
                                        </strong>
                                    </p>
                                    <p>
                                        Available:{' '}
                                        <strong>
                                            {selectedProduct
                                                ? selectedProduct.quantity_in_stock
                                                : '--'}
                                        </strong>
                                    </p>
                                </div>

                                {values.items.length > 1 ? (
                                    <button
                                        className='button button--danger order-item__remove'
                                        type='button'
                                        onClick={() => removeItem(index)}
                                        disabled={isSubmitting}
                                    >
                                        Remove
                                    </button>
                                ) : null}
                            </div>
                        );
                    })}
                </div>

                <div className='order-summary'>
                    <div>
                        <p className='section-eyebrow'>Automatic total</p>
                        <h3>${totalAmount.toFixed(2)}</h3>
                    </div>
                    <p>
                        Total is calculated from selected products and
                        quantities.
                    </p>
                </div>

                {submitError ? (
                    <p className='banner banner--error'>{submitError}</p>
                ) : null}

                <div className='product-form__actions'>
                    <button
                        className='button button--primary'
                        type='submit'
                        disabled={
                            isSubmitting ||
                            customers.length === 0 ||
                            products.length === 0
                        }
                    >
                        {isSubmitting ? 'Creating...' : 'Create order'}
                    </button>
                </div>
            </form>
        </section>
    );
}
