"use client";

// Next Imports
import Link from "next/link";
// Services
import { OrderCartItemI } from "@/services";
// import { CartItem } from "@/lib/types";
import { FormatCurrencyU } from "@/lib/currency";
import { QuantitySelector } from "@/components/QuantitySelector";

type Props = {
  item: OrderCartItemI;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
};

export function CartItemRow({ item, onRemove, onQuantityChange }: Props) {
  return (
    <div className="flex flex-col gap-5 rounded-[2rem] border border-mocha/10 bg-white p-5 shadow-soft md:flex-row md:items-center">
      <img
        src={item.image}
        alt={item.name}
        className="h-32 w-full rounded-[1.5rem] object-cover md:w-36"
      />

      <div className="flex-1 space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-latte">
            {item.category}
          </p>
          <Link
            href={`/coffee/${item.slug}`}
            className="mt-1 block text-2xl font-semibold text-roast"
          >
            {item.name}
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <QuantitySelector
            quantity={item.quantity}
            onChange={onQuantityChange}
          />
          <button
            type="button"
            onClick={onRemove}
            className="text-sm font-semibold text-mocha hover:text-roast"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="text-left md:text-right">
        <p className="text-xs uppercase tracking-[0.3em] text-mocha/45">
          Item total
        </p>
        <p className="mt-2 text-2xl font-semibold text-roast">
          {FormatCurrencyU(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
