"use client";

// Next Imports
// Next Imports
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
// Components
import { StatCard } from "@/components/admin/StatCard";
// Components
import { StatCard } from "@/components/admin/StatCard";
import { SectionCard } from "@/components/admin/SectionCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
// Services
import {
  OrderI,
  ApiService,
  DashboardService,
  DashboardOverviewI,
} from "@/services";
// Lib
import { FormatCurrencyU, FormatDateU } from "@/lib/utils";

const apiService = new ApiService();
const dashboardService = new DashboardService(apiService);

export function DashboardOverview() {
  const [overview, setOverview] = useState<DashboardOverviewI | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderI[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [overviewData, ordersData] = await Promise.all([
        dashboardService.getOverview(),
        dashboardService.getOrders({
          page: 1,
          limit: 5,
          sortBy: "createdAt",
          sortOrder: "desc",
        }),
      ]);
      setOverview(overviewData.data);
      setOverview(overviewData.data);
      setRecentOrders(ordersData.data.items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-latte">
          Loading dashboard…
        </p>
      </div>
    );
  }

  const data = overview;

  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-5 md:grid-cols-2">
        <StatCard
          label="Total Products"
          value={String(data?.totalProducts ?? "—")}
          hint="Active product records in the catalog."
          icon="☕"
        />
        <StatCard
          label="Low Stock"
          value={String(data?.lowStockProducts ?? "—")}
          hint="Products at 10 units or below that may need restocking."
          tone="danger"
          icon="!"
        />
        <StatCard
          label="Incoming Orders"
          value={String(data?.incomingOrders ?? "—")}
          hint="Orders waiting for admin review and decision."
          tone="warm"
          icon="◎"
        />
        <StatCard
          label="Confirmed"
          value={String(data?.confirmedOrders ?? "—")}
          hint="Closed orders that were approved successfully."
          tone="success"
          icon="✓"
        />
        <StatCard
          label="Sales"
          value={FormatCurrencyU(data?.totalSales ?? 0)}
          hint="Total revenue from confirmed orders."
          icon="₱"
        />
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          title="Recent order activity"
          description="Quick access to the latest incoming, confirmed, and rejected orders."
          action={
            <Link href="/orders" className="btn-secondary">
              Go to Orders
            </Link>
          }
        >
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-mocha/20 bg-oat px-6 py-10 text-center text-sm text-mocha/75">
                No orders yet. Storefront orders will appear here.
              </div>
            ) : (
              recentOrders.map((order, i) => (
                <Link
                  key={order._id || i}
                  href={`/orders/${order._id}`}
                  className="flex flex-col gap-4 rounded-[1.5rem] border border-mocha/10 bg-oat/55 p-5 transition hover:border-latte/50 hover:bg-oat md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-roast">
                        {order._id}
                      </h3>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-2 text-sm text-mocha/75">
                      {order.name} • {order.contactNumber}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-mocha/70">
                      {order.address}
                    </p>
                  </div>
                  <div className="space-y-1 text-sm text-mocha/75 md:text-right">
                    <p className="font-semibold text-roast">
                      {FormatCurrencyU(order.total)}
                    </p>
                    <p>{FormatDateU(order.createdAt)}</p>
                    <p className="uppercase">{order.paymentMethod}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Inventory watchlist"
          description="Products most likely to need restocking soon."
          action={
            <Link href="/products" className="btn-secondary text-center">
              Manage Products
            </Link>
          }
        >
          <div className="rounded-[1.5rem] border border-dashed border-mocha/20 bg-oat px-6 py-10 text-center text-sm text-mocha/75">
            {(data?.lowStockProducts ?? 0) > 0
              ? `${data?.lowStockProducts} products are low on stock. Go to Products tab to restock.`
              : "No low-stock products right now. Inventory looks healthy."}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
