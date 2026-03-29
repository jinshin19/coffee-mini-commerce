import { OrderStatus } from '@/lib/types';

export function StatusBadge({ status }: { status: OrderStatus }) {
  const classes: Record<OrderStatus, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return <span className={`badge-base ${classes[status]}`}>{status}</span>;
}
