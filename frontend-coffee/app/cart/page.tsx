"use client";

import Link from "next/link";
import { CartItemRow } from "@/components/CartItemRow";
import { FormatCurrencyU } from "@/lib/currency";
import { DELIVERY_FEE } from "@/lib/cart";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, cartSubtotal, cartTotal } =
    useCart();

  return (
    <div className="bg-oat py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-latte">
            Cart
          </p>
          <h1 className="text-4xl font-semibold text-roast">
            Review your order before checkout.
          </h1>
          <p className="text-base leading-7 text-mocha/80">
            Update quantities, remove items, and confirm totals before placing
            your coffee order.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[2rem] border border-mocha/10 bg-white p-10 text-center shadow-soft">
            <h2 className="text-2xl font-semibold text-roast">
              Your cart is empty.
            </h2>
            <p className="mt-3 text-mocha/75">
              Start with a signature coffee and come back when you’re ready to
              check out.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-roast px-6 py-3 text-sm font-semibold text-white transition hover:bg-mocha"
            >
              Browse Coffees
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              {items.map((item) => (
                <CartItemRow
                  key={item.productId}
                  item={item}
                  onRemove={() => removeItem(item.productId)}
                  onQuantityChange={(quantity) =>
                    updateQuantity(item.productId, quantity)
                  }
                />
              ))}
            </div>

            <aside className="h-fit rounded-[2rem] border border-mocha/10 bg-white p-6 shadow-soft">
              <h2 className="text-2xl font-semibold text-roast">
                Order Summary
              </h2>
              <div className="mt-6 space-y-4 text-sm text-mocha/80">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-roast">
                    {FormatCurrencyU(cartSubtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-roast">
                    {FormatCurrencyU(DELIVERY_FEE)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-mocha/10 pt-4 text-base">
                  <span className="font-semibold text-roast">Total</span>
                  <span className="font-semibold text-roast">
                    {FormatCurrencyU(cartTotal)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-roast px-6 py-3 text-sm font-semibold text-white transition hover:bg-mocha"
              >
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
