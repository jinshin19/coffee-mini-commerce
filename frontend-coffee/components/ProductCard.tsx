'use client';

import Link from 'next/link';
import { CoffeeProduct } from '@/lib/types';
import { formatCurrency } from '@/lib/currency';
import { useCart } from '@/context/CartContext';

export function ProductCard({ product }: { product: CoffeeProduct }) {
  const { addItem } = useCart();

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-mocha/10 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-glow">
      <Link href={`/coffee/${product.slug}`} className="block overflow-hidden bg-oat">
        <img
          src={product.image}
          alt={product.name}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-latte">{product.category}</p>
          <Link href={`/coffee/${product.slug}`} className="block text-2xl font-semibold text-roast transition hover:text-mocha">
            {product.name}
          </Link>
          <p className="text-sm leading-7 text-mocha/75">{product.shortDescription}</p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-mocha/45">Starting at</p>
            <p className="text-xl font-semibold text-roast">{formatCurrency(product.price)}</p>
          </div>

          <button
            type="button"
            onClick={() => addItem(product, 1)}
            className="rounded-full bg-roast px-5 py-3 text-sm font-semibold text-white transition hover:bg-mocha"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
