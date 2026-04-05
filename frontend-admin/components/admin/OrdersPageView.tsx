"use client";

// Next Imports
import { useCallback, useEffect, useState } from "react";
// Components
import { OrdersTable } from "@/components/admin/OrdersTable";
import { SectionCard } from "@/components/admin/SectionCard";
// Services
import { ApiService, OrderI, OrdersService, OrderStatusT } from "@/services";

const apiService = new ApiService();
const orderService = new OrdersService(apiService);

export function OrdersPageView() {
  const [orders, setOrders] = useState<{
    items: OrderI[];
    metadata: any;
  }>({
    items: [],
    metadata: {},
  });
  const [limit] = useState(5);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [filter, setFilter] = useState<"all" | OrderStatusT>("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await orderService.getOrders({
        page,
        limit,
        search: debouncedSearch,
        status: filter,
      });
      setOrders(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <SectionCard
      title="Orders management"
      description="Incoming orders can be reviewed, confirmed, or rejected. Closed orders remain read-only and can only be deleted from their detail page."
    >
      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_220px]">
        <div>
          <label className="label-base">Search orders</label>
          <input
            className="input-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer, address, payment method"
          />
        </div>
        <div>
          <label className="label-base">Status filter</label>
          <select
            className="input-base"
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
          >
            <option value="all">All orders</option>
            <option value="pending">Pending / Incoming</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-latte">
            Loading orders…
          </p>
        </div>
      ) : error ? (
        <div className="rounded-[1.5rem] bg-red-50 px-6 py-10 text-center">
          <p className="text-sm font-medium text-red-700">{error}</p>
          <button onClick={fetchOrders} className="btn-secondary mt-4">
            Retry
          </button>
        </div>
      ) : (
        <OrdersTable
          data={{
            items: orders.items as OrderI[],
            metadata: orders.metadata,
          }}
          onPage={setPage}
        />
      )}
    </SectionCard>
  );
}
