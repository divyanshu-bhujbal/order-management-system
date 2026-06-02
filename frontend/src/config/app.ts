const appName = import.meta.env.VITE_APP_NAME?.trim();
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is required.');
}

export const appConfig = {
    name: appName || 'Order Management System',
    apiBaseUrl,
} as const;
