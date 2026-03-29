"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "BRW-DEMO01";

  return (
    <div className="bg-oat py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-mocha/10 bg-white p-10 text-center shadow-glow">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-2xl text-green-700">
            ✓
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-latte">
            Order Confirmed
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-roast">
            Thanks for ordering from Brew Reserve.
          </h1>
          <p className="mt-4 text-base leading-7 text-mocha/80">
            Your order was placed successfully!.
          </p>
          <div className="mt-8 rounded-2xl bg-oat p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-mocha/50">
              Order ID
            </p>
            <p
              className="mt-2 text-2xl font-semibold text-roast"
              style={{
                lineBreak: "anywhere",
              }}
            >
              {orderId}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-roast px-6 py-3 text-sm font-semibold text-white transition hover:bg-mocha"
            >
              Back to Home
            </Link>
            <Link
              href="/cart"
              className="rounded-full border border-mocha/15 bg-oat px-6 py-3 text-sm font-semibold text-roast transition hover:bg-crema"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
