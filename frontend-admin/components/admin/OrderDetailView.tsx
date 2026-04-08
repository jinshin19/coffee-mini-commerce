"use client";

// Next Imports
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
// Components
import { SectionCard } from "@/components/admin/SectionCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
// Services
import { ApiService, OrderI, OrdersService, OrderStatusT } from "@/services";
// Lib
import {
  FormatCurrencyU,
  FormatDateU,
  GetOrderItemCountU,
  ResolveImageUrlU,
} from "@/lib/utils";

const apiService = new ApiService();
const orderService = new OrdersService(apiService);

export function OrderDetailView({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const [order, setOrder] = useState<OrderI | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [action, setAction] = useState<"confirm" | "reject" | "delete" | null>(
    null,
  );

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await orderService.getOrderById(id);
      setOrder(data.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Order not found.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  async function handleConfirm() {
    setActionLoading(true);
    setActionError("");
    try {
      const updated = await orderService.confirmOrderById(id);
      setOrder(updated.data);
      setAction(null);
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Failed to confirm order.",
      );
      setAction(null);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    setActionLoading(true);
    setActionError("");
    try {
      const updated = await orderService.rejectOrderById(id);
      setOrder(updated.data);
      setAction(null);
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Failed to reject order.",
      );
      setAction(null);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    setActionLoading(true);
    setActionError("");
    try {
      await orderService.deleteOrderById(id);
      setAction(null);
      router.push("/orders");
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete order.",
      );
      setAction(null);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-card p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-latte">
          Loading
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-roast">
          Preparing order detail…
        </h2>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="admin-card p-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-latte">
          Order Not Found
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-roast">
          The order record is unavailable.
        </h2>
        <p className="mt-3 text-sm leading-6 text-mocha/75">
          {error || "It may have already been deleted."}
        </p>
        <div className="mt-6">
          <Link href="/orders" className="btn-secondary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const isClosed = order.status !== "pending";
  const proofUrl = ResolveImageUrlU(order.proofOfPayment); 

  return (
    <>
      {actionError ? (
        <div className="mb-6 rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {actionError}
        </div>
      ) : null}

      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/orders" className="btn-secondary">
            ← Back to Orders
          </Link>
          <div className="flex flex-wrap gap-3">
            {order.status === "pending" ? (
              <>
                <button
                  onClick={() => setAction("reject")}
                  className="btn-danger"
                  disabled={actionLoading}
                >
                  Reject Order
                </button>
                <button
                  onClick={() => setAction("confirm")}
                  className="btn-primary"
                  disabled={actionLoading}
                >
                  Confirm Order
                </button>
              </>
            ) : (
              <button
                onClick={() => setAction("delete")}
                className="btn-danger"
                disabled={actionLoading}
              >
                Delete Closed Order
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr]">
          <SectionCard
            title={`Order - ${order?._id || order.id}`}
            description="Review customer details, payment method, proof of payment, and line items before making a final decision."
            action={<StatusBadge status={order.status as OrderStatusT} />}
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-mocha/10 bg-oat/55 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mocha/45">
                  Customer
                </p>
                <h3 className="mt-3 text-xl font-semibold text-roast">
                  {order.name}
                </h3>
                <p className="mt-3 text-sm text-mocha/75">
                  {order.contactNumber}
                </p>
                <p className="mt-3 text-sm leading-6 text-mocha/75">
                  {order.address}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-mocha/10 bg-oat/55 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mocha/45">
                  Order Summary
                </p>
                <div className="mt-4 space-y-3 text-sm text-mocha/75">
                  <div className="flex items-center justify-between">
                    <span>Created</span>
                    <span className="font-semibold text-roast">
                      {FormatDateU(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment</span>
                    <span className="font-semibold uppercase text-roast">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Quantity Ordered</span>
                    <span className="font-semibold text-roast">
                      {GetOrderItemCountU(order)} item(s)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-roast">
                      {FormatCurrencyU(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-mocha/10 pt-3">
                    <span>Total</span>
                    <span className="font-semibold text-roast">
                      {FormatCurrencyU(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-mocha/10 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-roast">
                  Ordered Items
                </h3>
                <span className="badge-base bg-crema text-roast">
                  {GetOrderItemCountU(order)} units
                </span>
              </div>
              <div
                className="mt-5 space-y-4"
                style={{
                  overflowY: "auto",
                  maxHeight: "500px",
                }}
              >
                {order.items.map((item) => (
                  <div
                    key={item?._id || item.id}
                    className="flex flex-col gap-4 rounded-[1.5rem] border border-mocha/10 bg-oat/55 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          item.image.includes("/admin")
                            ? item.image
                            : `/admin/${item.image}`
                        }
                        alt={item.name}
                        className="h-16 w-16 rounded-2xl border border-mocha/10 bg-white object-cover"
                      />
                      <div>
                        <p className="font-semibold text-roast">{item.name}</p>
                        <p className="mt-2 text-sm text-mocha/75">
                          {FormatCurrencyU(item.price)} each
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm md:text-right">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-mocha/45">
                          Qty
                        </p>
                        <p className="mt-1 font-semibold text-roast">
                          {item.quantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-mocha/45">
                          Price
                        </p>
                        <p className="mt-1 font-semibold text-roast">
                          {FormatCurrencyU(item.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-mocha/45">
                          Subtotal
                        </p>
                        <p className="mt-1 font-semibold text-roast">
                          {FormatCurrencyU(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Payment and decision"
            description={
              isClosed
                ? "This order is already closed. No further decision changes are allowed."
                : "Pending orders can still be confirmed or rejected from this page."
            }
          >
            <div className="space-y-5">
              <div className="rounded-[1.5rem] border border-mocha/10 bg-oat/55 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mocha/45">
                  Payment Method
                </p>
                <h3 className="mt-3 text-xl font-semibold uppercase text-roast">
                  {order.paymentMethod}
                </h3>
                <p className="mt-3 text-sm leading-6 text-mocha/75">
                  {order.paymentMethod === "gcash"
                    ? "Proof of payment is required and shown below for admin review."
                    : "Cash on Delivery orders do not require proof of payment."}
                </p>
              </div>

              {order.paymentMethod === "gcash" && proofUrl ? (
                <div className="rounded-[1.5rem] border border-mocha/10 bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-roast">
                      Proof of Payment
                    </h3>
                    <a
                      href={proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary px-4 py-2 text-xs"
                    >
                      Open Proof
                    </a>
                  </div>
                  <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-mocha/10 bg-oat p-3">
                    <img
                      src={proofUrl}
                      alt={`Proof of payment for ${order._id}`}
                      className="w-full rounded-[1.2rem]"
                    />
                  </div>
                </div>
              ) : order.paymentMethod === "cod" ? (
                <div className="rounded-[1.5rem] border border-dashed border-mocha/15 bg-oat px-6 py-8 text-center text-sm text-mocha/75">
                  This is a COD order. No proof-of-payment section is required.
                </div>
              ) : null}

              <div className="rounded-[1.5rem] border border-mocha/10 bg-gradient-to-br from-white to-oat p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mocha/45">
                  Decision State
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <StatusBadge status={order.status} />
                  <p className="text-sm text-mocha/75">
                    {order.status === "pending"
                      ? "Still open. Admin can confirm or reject this order."
                      : "Closed. Confirm/reject actions are disabled and only delete remains available."}
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <ConfirmDialog
        open={action === "confirm"}
        title="Confirm this order"
        description="Please make sure the payment and order details are correct before confirming. Confirming will deduct stock from the catalog. Closed orders can no longer be edited."
        confirmLabel="Confirm Order"
        tone="default"
        onClose={() => setAction(null)}
        onConfirm={handleConfirm}
        loading={actionLoading}
      />

      <ConfirmDialog
        open={action === "reject"}
        title="Reject this order"
        description="Rejecting this order will close it and prevent any further status changes."
        confirmLabel="Reject Order"
        onClose={() => setAction(null)}
        onConfirm={handleReject}
        loading={actionLoading}
      />

      <ConfirmDialog
        open={action === "delete"}
        title="Delete closed order"
        description="This will permanently remove the closed order record from the admin dashboard."
        confirmLabel="Delete Order"
        onClose={() => setAction(null)}
        onConfirm={handleDelete}
        loading={actionLoading}
      />
    </>
  );
}
