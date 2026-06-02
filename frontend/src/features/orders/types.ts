export type OrderItemPayload = {
    product_id: number;
    quantity: number;
};

export type OrderPayload = {
    customer_id: number;
    items: OrderItemPayload[];
};

export type OrderItem = {
    id: number;
    product_id: number;
    quantity: number;
    price_at_purchase: string;
};

export type Order = {
    id: number;
    customer_id: number;
    total_amount: string;
    created_at: string;
    order_items: OrderItem[];
};

export type OrderFormItem = {
    product_id: string;
    quantity: string;
};

export type OrderFormValues = {
    customer_id: string;
    items: OrderFormItem[];
};

export type OrderFormErrors = {
    customer_id?: string;
    items?: string;
    itemErrors: Array<{
        product_id?: string;
        quantity?: string;
    }>;
};
