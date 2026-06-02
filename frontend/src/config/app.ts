const appName = import.meta.env.VITE_APP_NAME?.trim();
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

function getDefaultApiBaseUrl(): string {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}/api/v1`;
}

export const appConfig = {
    name: appName || 'Order Management System',
    apiBaseUrl: apiBaseUrl || getDefaultApiBaseUrl(),
} as const;
