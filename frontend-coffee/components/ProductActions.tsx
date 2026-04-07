'use client';

// Next Imports
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// Services
import { ProductI } from '@/services';
// Context
import { useCart } from '@/context/CartContext';
// Components
import { QuantitySelector } from '@/components/QuantitySelector';

export function ProductActions({ product }: { product: ProductI }) {
  const router = useRouter();
  const { addItem, setBuyNowItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState('');

  function handleAddToCart() {
    addItem(product, quantity);
    setFeedback(`${quantity} item${quantity > 1 ? 's' : ''} added to cart.`);
    window.setTimeout(() => setFeedback(''), 2500);
  }

  function handleBuyNow() {
    setBuyNowItem(product, quantity);
    router.push('/checkout?mode=buy-now');
  }

  return (
    <div className="rounded-[2rem] border border-mocha/10 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-roast">Select quantity</p>
          <p className="mt-1 text-sm text-mocha/70">Quantity stays at 1 minimum and updates cart totals accurately.</p>
        </div>
        <QuantitySelector quantity={quantity} onChange={setQuantity} />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          className="rounded-full bg-roast px-6 py-3 text-sm font-semibold text-white transition hover:bg-mocha"
        >
          Add to Cart
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="rounded-full border border-mocha/15 bg-oat px-6 py-3 text-sm font-semibold text-roast transition hover:bg-crema"
        >
          Buy Now
        </button>
      </div>

      {feedback ? <p className="mt-4 text-sm font-medium text-green-700">{feedback}</p> : null}
    </div>
  );
}
