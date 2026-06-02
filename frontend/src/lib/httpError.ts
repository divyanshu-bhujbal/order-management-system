import { AxiosError } from 'axios';

type ApiValidationError = {
    detail?: string;
    errors?: Array<{
        msg?: string;
    }>;
};

export function extractApiErrorMessage(
    error: unknown,
    fallback = 'Something went wrong while communicating with the API.',
): string {
    if (error instanceof AxiosError) {
        const responseData = error.response?.data as
            | ApiValidationError
            | undefined;

        if (responseData?.detail) {
            return responseData.detail;
        }

        if (responseData?.errors?.length) {
            const messages = responseData.errors
                .map((item) => item.msg)
                .filter(Boolean);

            if (messages.length > 0) {
                return messages.join(' ');
            }
        }

        if (error.message) {
            return error.message;
        }
    }

    return fallback;
}
