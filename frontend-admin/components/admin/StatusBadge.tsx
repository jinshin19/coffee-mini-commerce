// Services
import { OrderStatusT } from "@/services";

export function StatusBadge({ status }: { status: OrderStatusT }) {
  const classes: Record<OrderStatusT, string> = {
    all: "",
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };

  return <span className={`badge-base ${classes[status]}`}>{status}</span>;
}
