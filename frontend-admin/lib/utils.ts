// Services
import { OrderI, ProductFormValuesI } from "@/services";

export function FormatCurrencyU(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function FormatDateU(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function SlugifyU(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function GetOrderItemCountU(order: OrderI) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function GetProductFormDefaultsU(): ProductFormValuesI {
  return {
    name: "",
    slug: "",
    category: "",
    shortDescription: "",
    description: "",
    price: "",
    image: "/images/coffee-1.svg",
    roastLevel: "light",
    origin: "",
    featured: false,
    bestSeller: false,
    stock: "0",
  };
}

export function ResolveImageUrlU(
  url: string | null | undefined,
): string | null {
  if (!url) return null;
  return url
}
