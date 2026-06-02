export type LowStockProduct = {
    id: number;
    name: string;
    sku: string;
    quantity_in_stock: number;
};

export type DashboardData = {
    total_products: number;
    total_customers: number;
    total_orders: number;
    low_stock_products: LowStockProduct[];
};
