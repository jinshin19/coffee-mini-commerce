import { CheckoutFormValues } from '@/lib/types';

export type CheckoutErrors = Partial<Record<keyof CheckoutFormValues, string>>;

const phoneRegex = /^(\+63|0)?9\d{9}$/;

export function validateCheckout(values: CheckoutFormValues): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  }

  if (!values.contactNumber.trim()) {
    errors.contactNumber = 'Contact number is required.';
  } else if (!phoneRegex.test(values.contactNumber.replace(/\s+/g, ''))) {
    errors.contactNumber = 'Enter a valid Philippine mobile number.';
  }

  if (!values.address.trim()) {
    errors.address = 'Address is required.';
  }

  if (!values.paymentMethod) {
    errors.paymentMethod = 'Please select a payment method.';
  }

  if (values.paymentMethod === 'gcash' && !values.proofOfPayment) {
    errors.proofOfPayment = 'Proof of payment is required for GCash.';
  }

  return errors;
}
