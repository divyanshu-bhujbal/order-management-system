import { useEffect, useState } from 'react';
import type {
    Product,
    ProductFormErrors,
    ProductFormValues,
} from '@/features/products/types';
import {
    defaultProductFormValues,
    toProductFormValues,
    toProductPayload,
    validateProductForm,
} from '@/features/products/validation';

type ProductFormProps = {
    initialProduct?: Product | null;
    isSubmitting: boolean;
    submitError: string | null;
    onCancelEdit: () => void;
    onSubmit: (values: ReturnType<typeof toProductPayload>) => Promise<boolean>;
};

export function ProductForm({
    initialProduct,
    isSubmitting,
    submitError,
    onCancelEdit,
    onSubmit,
}: ProductFormProps): JSX.Element {
    const [values, setValues] = useState<ProductFormValues>(
        defaultProductFormValues,
    );
    const [errors, setErrors] = useState<ProductFormErrors>({});

    useEffect(() => {
        setValues(toProductFormValues(initialProduct ?? undefined));
        setErrors({});
    }, [initialProduct]);

    function updateValue(field: keyof ProductFormValues, value: string): void {
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

        const nextErrors = validateProductForm(values);
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        const success = await onSubmit(toProductPayload(values));

        if (success && !initialProduct) {
            setValues(defaultProductFormValues);
            setErrors({});
        }
    }

    const isEditing = Boolean(initialProduct);

    return (
        <section className='product-panel'>
            <div className='product-panel__header'>
                <div>
                    <p className='section-eyebrow'>Product form</p>
                    <h2>{isEditing ? 'Edit product' : 'Add product'}</h2>
                </div>
            </div>

            <form
                className='product-form'
                onSubmit={handleSubmit}
                noValidate
            >
                <div className='product-form__grid'>
                    <label className='field'>
                        <span className='field__label'>Name</span>
                        <input
                            value={values.name}
                            onChange={(event) =>
                                updateValue('name', event.target.value)
                            }
                            placeholder='Wireless Mouse'
                            disabled={isSubmitting}
                        />
                        {errors.name ? (
                            <span className='field__error'>{errors.name}</span>
                        ) : null}
                    </label>

                    <label className='field'>
                        <span className='field__label'>SKU</span>
                        <input
                            value={values.sku}
                            onChange={(event) =>
                                updateValue('sku', event.target.value)
                            }
                            placeholder='WM-1001'
                            disabled={isSubmitting}
                        />
                        {errors.sku ? (
                            <span className='field__error'>{errors.sku}</span>
                        ) : null}
                    </label>

                    <label className='field'>
                        <span className='field__label'>Price</span>
                        <input
                            value={values.price}
                            onChange={(event) =>
                                updateValue('price', event.target.value)
                            }
                            inputMode='decimal'
                            placeholder='49.99'
                            disabled={isSubmitting}
                        />
                        {errors.price ? (
                            <span className='field__error'>{errors.price}</span>
                        ) : null}
                    </label>

                    <label className='field'>
                        <span className='field__label'>Quantity in stock</span>
                        <input
                            value={values.quantity_in_stock}
                            onChange={(event) =>
                                updateValue(
                                    'quantity_in_stock',
                                    event.target.value,
                                )
                            }
                            inputMode='numeric'
                            placeholder='25'
                            disabled={isSubmitting}
                        />
                        {errors.quantity_in_stock ? (
                            <span className='field__error'>
                                {errors.quantity_in_stock}
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
                        {isSubmitting
                            ? 'Saving...'
                            : isEditing
                              ? 'Update product'
                              : 'Add product'}
                    </button>
                    {isEditing ? (
                        <button
                            className='button button--ghost'
                            type='button'
                            onClick={onCancelEdit}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    ) : null}
                </div>
            </form>
        </section>
    );
}
