// const BASE_URL = "http://localhost:30011/api/v1";
const BASE_URL =
  typeof window !== "undefined" ? "/api/v1" : "http://backend:3000/api/v1";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body?.message ?? `Request failed: ${res.status}`;
    throw new Error(Array.isArray(message) ? message.join(". ") : message);
  }

  return res.json() as Promise<T>;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type ApiCoffeeProduct = {
  _id: string;
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  price: number;
  image: string;
  roastLevel: string;
  origin: string;
  bestSeller: boolean;
  featured: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedResponseService<T> = {
  data: {
    items: T[];
    metadata: {
      page: number;
      limit: number;
      count: number;
      totalPages: number;
    };
  };
};

export type ResponseService<T> = {
  data: T;
};

export type ApiOrderItem = {
  productId: string;
  quantity: number;
};

export type CreateOrderPayload = {
  name: string;
  contactNumber: string;
  address: string;
  paymentMethod: "gcash" | "cod";
  proofOfPayment?: string | null;
  items: ApiOrderItem[];
};

export type ApiOrderResult = {
  id: string;
  _id: string;
  status: string;
};

// ─── Products ────────────────────────────────────────────────────────────────

export async function fetchProducts<T>(
  params: {
    filter?: "all" | "featured" | "bestseller";
    limit?: number;
    search?: string;
  } = {},
): Promise<PaginatedResponseService<T>> {
  const qs = new URLSearchParams();
  if (params.filter && params.filter !== "all") qs.set("filter", params.filter);
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.search) qs.set("search", params.search);
  qs.set("sortBy", "updatedAt");
  qs.set("sortOrder", "desc");

  const res = await request<PaginatedResponseService<T>>(`/products?${qs}`);
  return res;
}

export async function fetchProductBySlug(
  slug: string,
): Promise<ApiCoffeeProduct | null> {
  const res = await request<PaginatedResponseService<ApiCoffeeProduct>>(
    `/products?search=${encodeURIComponent(slug)}&limit=20`,
  );
  return res.data.items.find((p) => p.slug === slug) ?? null;
}

// ─── Uploads ─────────────────────────────────────────────────────────────────

export async function uploadProofOfPayment(
  file: File,
): Promise<{ fileUrl: string; fileName: string }> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE_URL}/uploads/proof`, {
    method: "POST",
    body: form,
    // No Content-Type header — browser sets it with boundary for multipart
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body?.message ?? "Upload failed.";
    throw new Error(Array.isArray(message) ? message.join(". ") : message);
  }

  return res.json();
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<ApiOrderResult> {
  return request<ApiOrderResult>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
