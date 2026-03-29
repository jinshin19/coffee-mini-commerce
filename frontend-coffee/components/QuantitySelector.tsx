'use client';

type Props = {
  quantity: number;
  onChange: (next: number) => void;
};

export function QuantitySelector({ quantity, onChange }: Props) {
  return (
    <div className="inline-flex items-center rounded-full border border-mocha/15 bg-oat p-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="grid h-11 w-11 place-items-center rounded-full text-xl text-roast transition hover:bg-white"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="min-w-12 text-center text-base font-semibold text-roast">{quantity}</span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        className="grid h-11 w-11 place-items-center rounded-full text-xl text-roast transition hover:bg-white"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
