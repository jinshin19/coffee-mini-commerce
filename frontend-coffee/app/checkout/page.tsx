// Next Imports
import { Suspense } from "react";
// Components
import CheckoutContent from "@/components/CheckoutContent";

function CheckoutFallback() {
  return (
    <div className="bg-oat py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-mocha/10 bg-white p-10 shadow-glow">
          <p className="text-base text-mocha/80">Loading checkout...</p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}