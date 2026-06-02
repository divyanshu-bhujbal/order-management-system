export type Product = {
    id: number;
    name: string;
    sku: string;
    price: string;
    quantity_in_stock: number;
};

export type ProductFormValues = {
    name: string;
    sku: string;
    price: string;
    quantity_in_stock: string;
};

export type ProductPayload = {
    name: string;
    sku: string;
    price: string;
    quantity_in_stock: number;
};

export type ProductFormErrors = Partial<
    Record<keyof ProductFormValues, string>
>;
