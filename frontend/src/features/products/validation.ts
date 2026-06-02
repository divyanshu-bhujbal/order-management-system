import type {
    ProductFormErrors,
    ProductFormValues,
    ProductPayload,
} from '@/features/products/types';

export const defaultProductFormValues: ProductFormValues = {
    name: '',
    sku: '',
    price: '',
    quantity_in_stock: '',
};

export function validateProductForm(
    values: ProductFormValues,
): ProductFormErrors {
    const errors: ProductFormErrors = {};
    const normalizedName = values.name.trim();
    const normalizedSku = values.sku.trim();
    const price = Number(values.price);
    const quantity = Number(values.quantity_in_stock);

    if (!normalizedName) {
        errors.name = 'Product name is required.';
    } else if (normalizedName.length > 255) {
        errors.name = 'Product name must be 255 characters or fewer.';
    }

    if (!normalizedSku) {
        errors.sku = 'SKU is required.';
    } else if (normalizedSku.length > 100) {
        errors.sku = 'SKU must be 100 characters or fewer.';
    }

    if (values.price.trim() === '') {
        errors.price = 'Price is required.';
    } else if (Number.isNaN(price) || price < 0) {
        errors.price = 'Price must be a number greater than or equal to 0.';
    } else if (!/^\d+(\.\d{1,2})?$/.test(values.price.trim())) {
        errors.price = 'Price can have up to 2 decimal places.';
    }

    if (values.quantity_in_stock.trim() === '') {
        errors.quantity_in_stock = 'Quantity in stock is required.';
    } else if (!Number.isInteger(quantity) || quantity < 0) {
        errors.quantity_in_stock =
            'Quantity in stock must be a whole number greater than or equal to 0.';
    }

    return errors;
}

export function toProductPayload(values: ProductFormValues): ProductPayload {
    return {
        name: values.name.trim(),
        sku: values.sku.trim(),
        price: Number(values.price).toFixed(2),
        quantity_in_stock: Number(values.quantity_in_stock),
    };
}

export function toProductFormValues(payload?: {
    name: string;
    sku: string;
    price: string;
    quantity_in_stock: number;
}): ProductFormValues {
    if (!payload) {
        return defaultProductFormValues;
    }

    return {
        name: payload.name,
        sku: payload.sku,
        price: payload.price,
        quantity_in_stock: String(payload.quantity_in_stock),
    };
}
