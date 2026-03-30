// const BASE_URL = "http://localhost:30011/api";
const BASE_URL =
  typeof window !== "undefined" ? "/api/v1" : "http://backend:3000/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("brew-reserve-admin-token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) return { "Content-Type": "application/json" };
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers ?? {}) },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body?.message ?? `Request failed: ${res.status}`;
    throw new Error(Array.isArray(message) ? message.join(". ") : message);
  }

  return res.json() as Promise<T>;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export function loginAdmin(username: string, password: string) {
  return request<{ token: string; expiresIn: string }>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

// ─── Products ────────────────────────────────────────────────────────────────

export type ApiProduct = {
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

export type ResponseService<T> = {
  data: T;
};

export type ProductsQueryParams = {
  search?: string;
  filter?: "all" | "featured" | "bestseller" | "lowstock";
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export function getProducts(params: ProductsQueryParams = {}) {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.filter && params.filter !== "all") qs.set("filter", params.filter);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.sortBy) qs.set("sortBy", params.sortBy);
  if (params.sortOrder) qs.set("sortOrder", params.sortOrder);
  return request<ResponseService<{ items: ApiProduct[]; metadata: any }>>(
    `/products?${qs}`,
  );
}

export function getProduct(id: string) {
  return request<ApiProduct>(`/products/${id}`);
}

export type CreateProductPayload = {
  slug?: string;
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
};

export function createProduct(payload: CreateProductPayload) {
  return request<ApiProduct>("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProduct(
  id: string,
  payload: Partial<CreateProductPayload>,
) {
  return request<ApiProduct>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function addStockApi(id: string, amount: number) {
  return request<ApiProduct>(`/products/${id}/stock`, {
    method: "PATCH",
    body: JSON.stringify({ amount }),
  });
}

export function deleteProduct(id: string) {
  return request<{ message: string; id: string }>(`/products/${id}`, {
    method: "DELETE",
  });
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export type ApiOrderItem = {
  _id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type ApiOrder = {
  _id: string;
  id: string;
  name: string;
  contactNumber: string;
  address: string;
  paymentMethod: "gcash" | "cod";
  proofOfPayment: string | null;
  status: "pending" | "confirmed" | "rejected";
  items: ApiOrderItem[];
  subtotal: number;
  total: number;
  createdAt: string;
};

export type OrdersQueryParams = {
  search?: string;
  status?: "all" | "pending" | "confirmed" | "rejected";
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export function getOrders(params: OrdersQueryParams = {}) {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.status && params.status !== "all") qs.set("status", params.status);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.sortBy) qs.set("sortBy", params.sortBy);
  if (params.sortOrder) qs.set("sortOrder", params.sortOrder);
  return request<ResponseService<{ items: ApiOrder[]; metadata: any }>>(
    `/orders?${qs}`,
  );
}

export function getOrder(id: string) {
  return request<ApiOrder>(`/orders/${id}`);
}

export function confirmOrder(id: string) {
  return request<ApiOrder>(`/orders/${id}/confirm`, { method: "PATCH" });
}

export function rejectOrder(id: string) {
  return request<ApiOrder>(`/orders/${id}/reject`, { method: "PATCH" });
}

export function deleteOrder(id: string) {
  return request<{ message: string; id: string }>(`/orders/${id}`, {
    method: "DELETE",
  });
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export type DashboardOverview = {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  featuredProducts: number;
  bestSellerProducts: number;
  incomingOrders: number;
  confirmedOrders: number;
  rejectedOrders: number;
  totalOrders: number;
  totalSales: number;
};

export function getDashboardOverview() {
  return request<DashboardOverview>("/dashboard/overview");
}
