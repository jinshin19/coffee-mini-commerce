'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { CartItem, CoffeeProduct } from '@/lib/types';
import { buildCartItem, getSubtotal, getTotal } from '@/lib/cart';

type CartContextValue = {
  items: CartItem[];
  instantCheckout: CartItem[];
  addItem: (product: CoffeeProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setBuyNowItem: (product: CoffeeProduct, quantity: number) => void;
  clearInstantCheckout: () => void;
  cartSubtotal: number;
  cartTotal: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = 'coffee-next-store-cart';
const INSTANT_STORAGE_KEY = 'coffee-next-store-instant';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [instantCheckout, setInstantCheckout] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      const storedInstant = window.localStorage.getItem(INSTANT_STORAGE_KEY);

      if (storedCart) setItems(JSON.parse(storedCart));
      if (storedInstant) setInstantCheckout(JSON.parse(storedInstant));
    } catch (error) {
      console.error('Failed to hydrate cart state', error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(INSTANT_STORAGE_KEY, JSON.stringify(instantCheckout));
  }, [instantCheckout, hydrated]);

  function addItem(product: CoffeeProduct, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.productId === product._id);
      if (existing) {
        return current.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...current, buildCartItem(product, quantity)];
    });
  }

  function removeItem(productId: string) {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;
    setItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  }

  function clearCart() {
    setItems([]);
  }

  function setBuyNowItem(product: CoffeeProduct, quantity: number) {
    setInstantCheckout([buildCartItem(product, quantity)]);
  }

  function clearInstantCheckout() {
    setInstantCheckout([]);
  }

  const value = useMemo(
    () => ({
      items,
      instantCheckout,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      setBuyNowItem,
      clearInstantCheckout,
      cartSubtotal: getSubtotal(items),
      cartTotal: getTotal(items),
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    [items, instantCheckout],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
}
