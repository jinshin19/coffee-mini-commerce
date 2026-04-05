// Packages
import { ulid } from "ulidx";

export function generateCoffeeId() {
  return `coffee-${Math.random().toString(36).slice(2, 8)}`;
}

export function generateOrderId() {
  return `BRW-${Date.now().toString().slice(-6)}`;
}

export const SYSTEM_ID = () => {
  return `CO${ulid()}`;
};
