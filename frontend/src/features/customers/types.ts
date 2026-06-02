export type Customer = {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
};

export type CustomerFormValues = {
    full_name: string;
    email: string;
    phone_number: string;
};

export type CustomerPayload = CustomerFormValues;

export type CustomerFormErrors = Partial<
    Record<keyof CustomerFormValues, string>
>;
