"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { ProductTable } from "@/components/admin/ProductTable";
import { SectionCard } from "@/components/admin/SectionCard";
import { StockModal } from "@/components/admin/StockModal";
import {
  addStockApi,
  ApiProduct,
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/lib/api";
import { ProductFormValues } from "@/lib/types";

export function ProductsPageView() {
  const [products, setProducts] = useState<{
    items: ApiProduct[];
    metadata: any;
  }>({
    items: [],
    metadata: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "featured" | "bestseller" | "lowstock"
  >("all");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState(5);
  const [editingProduct, setEditingProduct] = useState<ApiProduct | null>(null);
  const [stockProduct, setStockProduct] = useState<ApiProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiProduct | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getProducts({
        page,
        limit,
        search: debouncedSearch,
        filter,
      });
      setProducts(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load products.");
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
    fetchProducts();
  }, [fetchProducts]);

  async function submitNewProduct(values: ProductFormValues) {
    setActionLoading(true);
    setActionError("");
    try {
      await createProduct({
        slug: values.slug || undefined,
        name: values.name.trim(),
        category: values.category.trim(),
        shortDescription: values.shortDescription.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        image: values.image.trim(),
        roastLevel: values.roastLevel.trim(),
        origin: values.origin.trim(),
        featured: values.featured,
        bestSeller: values.bestSeller,
        stock: Number(values.stock),
      });
      setIsCreateOpen(false);
      await fetchProducts();
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Failed to create product.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function submitEditProduct(values: ProductFormValues) {
    if (!editingProduct) return;
    setActionLoading(true);
    setActionError("");
    try {
      await updateProduct(editingProduct._id, {
        slug: values.slug || undefined,
        name: values.name.trim(),
        category: values.category.trim(),
        shortDescription: values.shortDescription.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        image: values.image.trim(),
        roastLevel: values.roastLevel.trim(),
        origin: values.origin.trim(),
        featured: values.featured,
        bestSeller: values.bestSeller,
        stock: Number(values.stock),
      });
      setEditingProduct(null);
      await fetchProducts();
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Failed to update product.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function submitAddStock(amount: number) {
    if (!stockProduct) return;
    setActionLoading(true);
    setActionError("");
    try {
      await addStockApi(stockProduct._id, amount);
      setStockProduct(null);
      await fetchProducts();
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Failed to add stock.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function submitDeleteProduct() {
    if (!deleteTarget) return;
    setActionLoading(true);
    setActionError("");
    try {
      await deleteProduct(deleteTarget._id);
      setDeleteTarget(null);
      await fetchProducts();
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete product.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <>
      <SectionCard
        title="Product management"
        description="Maintain the product catalog with premium but practical admin controls."
        action={
          <button onClick={() => setIsCreateOpen(true)} className="btn-primary">
            Add Product
          </button>
        }
      >
        {actionError ? (
          <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {actionError}
          </p>
        ) : null}

        <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_220px]">
          <div>
            <label className="label-base">Search products</label>
            <input
              className="input-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, category, origin, roast, or slug"
            />
          </div>
          <div>
            <label className="label-base">Filter</label>
            <select
              className="input-base"
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
            >
              <option value="all">All products</option>
              <option value="featured">Featured only</option>
              <option value="bestseller">Best sellers</option>
              <option value="lowstock">Low stock</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-latte">
              Loading products…
            </p>
          </div>
        ) : error ? (
          <div className="rounded-[1.5rem] bg-red-50 px-6 py-10 text-center">
            <p className="text-sm font-medium text-red-700">{error}</p>
            <button onClick={fetchProducts} className="btn-secondary mt-4">
              Retry
            </button>
          </div>
        ) : (
          <ProductTable
            data={{
              items: products.items as ApiProduct[],
              metadata: products.metadata,
            }}
            onPage={setPage}
            onEdit={setEditingProduct}
            onAddStock={setStockProduct}
            onDelete={setDeleteTarget}
          />
        )}
      </SectionCard>

      <ProductFormModal
        open={isCreateOpen}
        mode="add"
        onClose={() => setIsCreateOpen(false)}
        onSubmit={submitNewProduct}
        loading={actionLoading}
      />

      <ProductFormModal
        open={Boolean(editingProduct)}
        mode="edit"
        initialProduct={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSubmit={submitEditProduct}
        loading={actionLoading}
      />

      <StockModal
        open={Boolean(stockProduct)}
        product={stockProduct}
        onClose={() => setStockProduct(null)}
        onSubmit={submitAddStock}
        loading={actionLoading}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete coffee product"
        description={
          deleteTarget
            ? `You are about to permanently remove ${deleteTarget.name} from the catalog.`
            : ""
        }
        confirmLabel="Delete Product"
        onClose={() => setDeleteTarget(null)}
        onConfirm={submitDeleteProduct}
        loading={actionLoading}
      />
    </>
  );
}
