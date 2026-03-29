import { CartItem, CoffeeProduct } from '@/lib/types';

export const DELIVERY_FEE = 120;

export function buildCartItem(product: CoffeeProduct, quantity: number): CartItem {
  return {
    productId: product._id,  // backend requires _id (ULID), not the short business id
    slug: product.slug,
    name: product.name,
    category: product.category,
    image: product.image,
    price: product.price,
    quantity,
  };
}

export function getSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getTotal(items: CartItem[]) {
  return getSubtotal(items) + (items.length ? DELIVERY_FEE : 0);
}
