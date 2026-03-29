export type PaymentMethod = 'gcash' | 'cod';
export type OrderStatus = 'pending' | 'confirmed' | 'rejected';

export type AdminProduct = {
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
  bestSeller: boolean;
  featured: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type AdminOrder = {
  id: string;
  name: string;
  contactNumber: string;
  address: string;
  paymentMethod: PaymentMethod;
  proofOfPayment: string | null;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  total: number;
  createdAt: string;
};

export type ProductFormValues = {
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  price: string;
  image: string;
  roastLevel: string;
  origin: string;
  featured: boolean;
  bestSeller: boolean;
  stock: string;
};
