import type { Product } from '@/features/products/types';
import type {
    OrderFormErrors,
    OrderFormItem,
    OrderFormValues,
    OrderPayload,
} from '@/features/orders/types';

export const defaultOrderItem: OrderFormItem = {
    product_id: '',
    quantity: '1',
};

export const defaultOrderFormValues: OrderFormValues = {
    customer_id: '',
    items: [{ ...defaultOrderItem }],
};

export function validateOrderForm(
    values: OrderFormValues,
    products: Product[],
): OrderFormErrors {
    const errors: OrderFormErrors = {
        itemErrors: values.items.map(() => ({})),
    };

    if (!values.customer_id) {
        errors.customer_id = 'Customer selection is required.';
    }

    if (values.items.length === 0) {
        errors.items = 'At least one product is required.';
        return errors;
    }

    const selectedProductIds = new Set<number>();

    values.items.forEach((item, index) => {
        const itemError = errors.itemErrors[index];
        const productId = Number(item.product_id);
        const quantity = Number(item.quantity);
        const product = products.find((entry) => entry.id === productId);

        if (!item.product_id) {
            itemError.product_id = 'Select a product.';
        } else if (Number.isNaN(productId) || !product) {
            itemError.product_id = 'Selected product is invalid.';
        } else if (selectedProductIds.has(productId)) {
            itemError.product_id = 'Each product can only appear once.';
        } else {
            selectedProductIds.add(productId);
        }

        if (!item.quantity) {
            itemError.quantity = 'Enter a quantity.';
        } else if (!Number.isInteger(quantity) || quantity <= 0) {
            itemError.quantity = 'Quantity must be greater than 0.';
        } else if (product && quantity > product.quantity_in_stock) {
            itemError.quantity = `Only ${product.quantity_in_stock} units available.`;
        }
    });

    return errors;
}

export function hasOrderFormErrors(errors: OrderFormErrors): boolean {
    return Boolean(
        errors.customer_id ||
        errors.items ||
        errors.itemErrors.some(
            (itemError) => itemError.product_id || itemError.quantity,
        ),
    );
}

export function toOrderPayload(values: OrderFormValues): OrderPayload {
    return {
        customer_id: Number(values.customer_id),
        items: values.items.map((item) => ({
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
        })),
    };
}

export function calculateOrderTotal(
    items: OrderFormItem[],
    products: Product[],
): number {
    return items.reduce((total, item) => {
        const product = products.find(
            (entry) => entry.id === Number(item.product_id),
        );
        const quantity = Number(item.quantity);

        if (!product || !Number.isFinite(quantity) || quantity <= 0) {
            return total;
        }

        return total + Number(product.price) * quantity;
    }, 0);
}
