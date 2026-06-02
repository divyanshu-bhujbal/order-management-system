import type {
    CustomerFormErrors,
    CustomerFormValues,
    CustomerPayload,
} from '@/features/customers/types';

export const defaultCustomerFormValues: CustomerFormValues = {
    full_name: '',
    email: '',
    phone_number: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCustomerForm(
    values: CustomerFormValues,
): CustomerFormErrors {
    const errors: CustomerFormErrors = {};
    const fullName = values.full_name.trim();
    const email = values.email.trim();
    const phoneNumber = values.phone_number.trim();

    if (!fullName) {
        errors.full_name = 'Customer name is required.';
    } else if (fullName.length > 255) {
        errors.full_name = 'Customer name must be 255 characters or fewer.';
    }

    if (!email) {
        errors.email = 'Email address is required.';
    } else if (!emailPattern.test(email)) {
        errors.email = 'Enter a valid email address.';
    }

    if (!phoneNumber) {
        errors.phone_number = 'Phone number is required.';
    } else if (phoneNumber.length > 30) {
        errors.phone_number = 'Phone number must be 30 characters or fewer.';
    }

    return errors;
}

export function toCustomerPayload(values: CustomerFormValues): CustomerPayload {
    return {
        full_name: values.full_name.trim(),
        email: values.email.trim(),
        phone_number: values.phone_number.trim(),
    };
}
