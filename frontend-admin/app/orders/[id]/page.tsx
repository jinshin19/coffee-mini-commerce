import { OrderDetailView } from "@/components/admin/OrderDetailView";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("ID", id);
  return <OrderDetailView id={id} />;
}
