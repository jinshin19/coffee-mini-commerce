// Services
import { OrderCartItemI, OrderItemI, ProductI } from "@/services";

export const DELIVERY_FEE = 120;

export function buildCartItem(
  product: ProductI,
  quantity: number,
): OrderCartItemI {
  return {
    productId: product._id || product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    image: product.image,
    price: product.price,
    quantity,
  };
}

export function getSubtotal(items: OrderCartItemI[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getTotal(items: OrderCartItemI[]) {
  return getSubtotal(items) + (items.length ? DELIVERY_FEE : 0);
}
