"use client";

// Next Imports
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
// Context
import { useCart } from "@/context/CartContext";
// Libs
import { FormatCurrencyU } from "@/lib/currency";
import { validateCheckout } from "@/lib/validation";
import { DELIVERY_FEE, getSubtotal } from "@/lib/cart";
// Helpers
import { UploadProofOfPaymentH } from "@/helpers/src/upload-pop.helper";
// Services
import { ApiService, OrderCheckoutFormValuesI, OrdersService } from "@/services";

const apiService = new ApiService();
const orderService = new OrdersService(apiService);

const initialValues: OrderCheckoutFormValuesI = {
  fullName: "",
  contactNumber: "",
  address: "",
  paymentMethod: "gcash",
  proofOfPayment: null,
};

export default function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, instantCheckout, clearCart, clearInstantCheckout } = useCart();
  const [values, setValues] = useState<OrderCheckoutFormValuesI>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof OrderCheckoutFormValuesI, string>>
  >({});
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mode = searchParams.get("mode") === "buy-now" ? "buy-now" : "cart";

  const checkoutItems =
    mode === "buy-now" && instantCheckout.length ? instantCheckout : items;
  const subtotal = useMemo(() => getSubtotal(checkoutItems), [checkoutItems]);
  const deliveryFee = checkoutItems.length ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function setField<K extends keyof OrderCheckoutFormValuesI>(
    key: K,
    value: OrderCheckoutFormValuesI[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function handlePaymentChange(event: ChangeEvent<HTMLSelectElement>) {
    const paymentMethod = event.target
      .value as OrderCheckoutFormValuesI["paymentMethod"];
    setField("paymentMethod", paymentMethod);

    if (paymentMethod === "cod") {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      setField("proofOfPayment", null);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setField("proofOfPayment", file);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateCheckout(values);
    if (checkoutItems.length === 0) {
      alert("Add at least one item before placing an order.");
      return;
    }
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload proof of payment if GCash
      let proofOfPaymentUrl: string | null = null;
      if (values.paymentMethod === "gcash" && values.proofOfPayment) {
        // const uploaded = await orderService.uploadOrderPOP(
        //   values.proofOfPayment,
        // );
        // proofOfPaymentUrl = uploaded.data?.fileUrl;
        const uploaded = await UploadProofOfPaymentH(values.proofOfPayment);
        proofOfPaymentUrl = uploaded?.data?.fileUrl;
      }

      if (!proofOfPaymentUrl) {
        console.log("no data", proofOfPaymentUrl);
        return;
      }

      // 2. Place the order using the backend API
      const order = await orderService.createOrder({
        name: values.fullName.trim(), // FE calls it fullName, BE expects name
        contactNumber: values.contactNumber.trim(),
        address: values.address.trim(),
        paymentMethod: values.paymentMethod as "gcash" | "cod",
        proofOfPayment: proofOfPaymentUrl,
        items: checkoutItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      // 3. Clear cart and redirect
      if (mode === "buy-now") {
        clearInstantCheckout();
      } else {
        clearCart();
      }

      router.push(
        `/order-success?orderId=${order.data?._id || order.data?.id}`,
      );
    } catch (error: unknown) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while placing the order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-oat py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-latte">
            Checkout
          </p>
          <h1 className="text-4xl font-semibold text-roast">
            Finish your coffee order.
          </h1>
          <p className="text-base leading-7 text-mocha/80">
            Complete your billing details, choose a payment method, and place a
            valid order. GCash requires proof of payment while COD keeps things
            simple.
          </p>
        </div>

        {checkoutItems.length === 0 ? (
          <div className="rounded-[2rem] border border-mocha/10 bg-white p-10 text-center shadow-soft">
            <h2 className="text-2xl font-semibold text-roast">
              Nothing to check out yet.
            </h2>
            <p className="mt-3 text-mocha/75">
              Add items to your cart or use Buy Now from a product page first.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-roast px-6 py-3 text-sm font-semibold text-white transition hover:bg-mocha"
            >
              Go to Homepage
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] border border-mocha/10 bg-white p-6 shadow-soft sm:p-8"
            >
              <div className="grid gap-6">
                <div>
                  <label htmlFor="fullName" className="label">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    className="field"
                    placeholder="Enter your full name"
                    value={values.fullName}
                    onChange={(e) => setField("fullName", e.target.value)}
                  />
                  {errors.fullName ? (
                    <p className="error-text">{errors.fullName}</p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="contactNumber" className="label">
                    Contact Number
                  </label>
                  <input
                    id="contactNumber"
                    className="field"
                    placeholder="09171234567"
                    value={values.contactNumber}
                    onChange={(e) => setField("contactNumber", e.target.value)}
                  />
                  {errors.contactNumber ? (
                    <p className="error-text">{errors.contactNumber}</p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="address" className="label">
                    Address
                  </label>
                  <textarea
                    id="address"
                    rows={4}
                    className="field resize-none"
                    placeholder="Complete delivery address"
                    value={values.address}
                    onChange={(e) => setField("address", e.target.value)}
                  />
                  {errors.address ? (
                    <p className="error-text">{errors.address}</p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="paymentMethod" className="label">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    className="field"
                    value={values.paymentMethod}
                    onChange={handlePaymentChange}
                  >
                    <option value="">Select payment method</option>
                    <option value="gcash">GCash</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                  {errors.paymentMethod ? (
                    <p className="error-text">{errors.paymentMethod}</p>
                  ) : null}
                </div>

                {values.paymentMethod === "gcash" ? (
                  <div className="rounded-[2rem] border border-mocha/10 bg-oat p-5">
                    <div className="grid gap-6 lg:grid-cols-[200px_1fr] lg:items-start">
                      <div>
                        <p className="text-sm font-semibold text-roast">
                          GCash QR Code
                        </p>
                        <img
                          src="/images/gcash-qr.svg"
                          alt="GCash payment QR"
                          className="mt-3 h-auto w-full max-w-[200px] rounded-2xl border border-mocha/10 bg-white p-3"
                        />
                      </div>

                      <div>
                        <label htmlFor="proofOfPayment" className="label">
                          Attach Proof of Payment
                        </label>
                        <input
                          id="proofOfPayment"
                          type="file"
                          accept="image/*"
                          className="field"
                          onChange={handleFileChange}
                        />
                        <p className="mt-2 text-sm text-mocha/70">
                          Upload a screenshot of your GCash payment
                          confirmation.
                        </p>
                        {errors.proofOfPayment ? (
                          <p className="error-text">{errors.proofOfPayment}</p>
                        ) : null}

                        {values.proofOfPayment ? (
                          <div className="mt-4 rounded-2xl border border-mocha/10 bg-white p-4">
                            <p className="text-sm font-semibold text-roast">
                              Selected file
                            </p>
                            <p className="mt-1 text-sm text-mocha/75">
                              {values.proofOfPayment.name}
                            </p>
                            <p className="text-sm text-mocha/60">
                              {Math.ceil(values.proofOfPayment.size / 1024)} KB
                            </p>
                            {previewUrl &&
                            values.proofOfPayment.type.startsWith("image/") ? (
                              <img
                                src={previewUrl}
                                alt="Proof preview"
                                className="mt-4 max-h-52 rounded-2xl border border-mocha/10 object-cover"
                              />
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-full bg-roast px-6 py-3 text-sm font-semibold text-white transition hover:bg-mocha disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Placing Order…" : "Place Order"}
                </button>
              </div>
            </form>

            <aside className="h-fit rounded-[2rem] border border-mocha/10 bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold text-roast">
                  Order Summary
                </h2>
                <span className="rounded-full bg-oat px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-mocha">
                  {mode === "buy-now" ? "Buy Now" : "Cart"}
                </span>
              </div>

              <div
                className="order-summary-checkout mt-6 space-y-4"
                style={{
                  maxHeight: "350px",
                  overflowY: "auto",
                  paddingRight: "2px",
                }}
              >
                {checkoutItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 rounded-2xl bg-oat p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-roast">{item.name}</p>
                      <p className="text-sm text-mocha/70">
                        Qty {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-roast">
                      {FormatCurrencyU(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4 border-t border-mocha/10 pt-6 text-sm text-mocha/80">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-roast">
                    {FormatCurrencyU(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-roast">
                    {FormatCurrencyU(deliveryFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-base">
                  <span className="font-semibold text-roast">Total</span>
                  <span className="font-semibold text-roast">
                    {FormatCurrencyU(total)}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
