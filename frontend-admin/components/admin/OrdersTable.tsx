"use client";

import Link from "next/link";
import { ApiOrder } from "@/lib/api";
import { formatCurrency, formatDate, getOrderItemCount } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/EmptyState";
import { Dispatch, SetStateAction, useState } from "react";
export function OrdersTable({
  data,
  onPage,
}: {
  data: {
    items: ApiOrder[];
    metadata: {
      page: number;
      limit: number;
      count: number;
      totalPages: number;
    };
  };
  onPage: Dispatch<SetStateAction<number>>;
}) {
  const [loading, setLoading] = useState(false);
  if (!data.items.length) {
    return (
      <EmptyState
        title="No orders match this filter."
        description="Try switching the status filter or search for another customer/order ID."
      />
    );
  }

  return (
    <div className="table-wrap overflow-x-auto">
      <table className="min-w-full divide-y divide-mocha/10 text-center">
        <thead className="table-head">
          <tr>
            <th className="px-5 py-4">Order</th>
            <th className="px-5 py-4">Customer</th>
            <th className="px-5 py-4">Payment</th>
            <th className="px-5 py-4">Items</th>
            <th className="px-5 py-4">Total</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Created</th>
            <th className="px-5 py-4 text-right">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-mocha/8 text-sm text-mocha/85">
          {data.items.map((order, i) => (
            <tr key={order._id || i} className="hover:bg-oat/40">
              <td className="px-5 py-4">
                <div>
                  <p className="font-semibold text-roast">{order._id}</p>
                  <p className="mt-1 max-w-xs text-sm text-mocha/70">
                    {order.address}
                  </p>
                </div>
              </td>

              <td className="px-5 py-4">
                <p className="font-semibold text-roast">{order.name}</p>
                <p className="mt-1 text-sm text-mocha/70">
                  {order.contactNumber}
                </p>
              </td>

              <td className="px-5 py-4 uppercase">{order.paymentMethod}</td>

              <td className="px-5 py-4 text-center">
                {getOrderItemCount(order)} item(s)
              </td>

              <td className="px-5 py-4 font-semibold text-roast">
                {formatCurrency(order.total)}
              </td>

              <td className="px-5 py-4">
                <StatusBadge status={order.status} />
              </td>

              <td className="px-5 py-4">{formatDate(order.createdAt)}</td>

              <td className="px-5 py-4 text-right">
                <Link
                  href={`/orders/${order._id}`}
                  className="btn-secondary px-4 py-2 text-xs text-center"
                >
                  View Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-mocha/10 px-4 py-4">
        <div className="text-sm text-mocha/60">
          <p className="flex gap-1">
            Page
            <span className="font-semibold">{data.metadata.page}</span>
            of
            <span className="font-semibold">{data.metadata.totalPages}</span> —
            <span className="font-semibold">{data.metadata.count}</span> Orders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              onPage((page: number) => {
                if (page === 1) return 1;
                return page - 1;
              })
            }
            disabled={data.metadata.page <= 1 || loading}
            className="btn-secondary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={() => onPage((prev) => prev + 1)}
            disabled={
              loading || data.metadata.page === data.metadata.totalPages
            }
            className="btn-secondary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
