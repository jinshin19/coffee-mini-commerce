export type CoffeeProduct = {
  _id: string;
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  price: number;
  image: string;
  roastLevel: string;
  origin: string;
  bestSeller?: boolean;
  featured?: boolean;
  stock: number;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
};

export type PaymentMethod = 'gcash' | 'cod' | '';

export type CheckoutFormValues = {
  fullName: string;
  contactNumber: string;
  address: string;
  paymentMethod: PaymentMethod;
  proofOfPayment: File | null;
};

export type OrderPayload = {
  items: CartItem[];
  billing: Omit<CheckoutFormValues, 'proofOfPayment'> & { proofOfPaymentName?: string };
  subtotal: number;
  deliveryFee: number;
  total: number;
  source: 'cart' | 'buy-now';
};

export type OrderResult = {
  orderId: string;
  message: string;
};
