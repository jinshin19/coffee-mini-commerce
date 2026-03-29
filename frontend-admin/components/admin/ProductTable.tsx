"use client";

import { ApiProduct } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/admin/EmptyState";
import { Dispatch, SetStateAction, useState } from "react";

export function ProductTable({
  data,
  onPage,
  onEdit,
  onAddStock,
  onDelete,
}: {
  data: {
    items: ApiProduct[];
    metadata: {
      page: number;
      limit: number;
      count: number;
      totalPages: number;
    };
  };
  onPage: Dispatch<SetStateAction<number>>;
  onEdit: (product: ApiProduct) => void;
  onAddStock: (product: ApiProduct) => void;
  onDelete: (product: ApiProduct) => void;
}) {
  // const [products, setProducts] = useState<Product[]>([]);
  const [metadata, setMetadata] = useState({ page: 1, limit: 25 });
  const [loading, setLoading] = useState(false);

  if (!data.items.length) {
    return (
      <EmptyState
        title="No products match this filter."
        description="Try a different search or add a new coffee product."
      />
    );
  }

  return (
    <div className="table-wrap overflow-x-auto">
      <table className="min-w-full divide-y divide-mocha/10 text-center">
        <thead className="table-head">
          <tr>
            <th className="px-5 py-4">Product</th>
            <th className="px-5 py-4">Category</th>
            <th className="px-5 py-4">Price</th>
            <th className="px-5 py-4">Roast</th>
            <th className="px-5 py-4">Origin</th>
            <th className="px-5 py-4">Stock</th>
            <th className="px-5 py-4">Flags</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-mocha/8 text-sm text-mocha/85">
          {data.items.length > 0 ? (
            data.items.map((product, i) => {
              const lowStock = product.stock <= 10;

              return (
                <tr key={product._id || i} className="hover:bg-oat/40">
                  <td className="px-5 py-4 text-left">
                    <div className="flex min-w-[240px] items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 rounded-2xl border border-mocha/10 bg-oat object-cover"
                      />
                      <div>
                        <p className="font-semibold text-roast">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-mocha/45">
                          {product.slug}
                        </p>
                        <p className="mt-2 line-clamp-2 max-w-sm text-sm text-mocha/70">
                          {product.shortDescription}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">{product.category}</td>

                  <td className="px-5 py-4 font-semibold text-roast">
                    {formatCurrency(product.price)}
                  </td>

                  <td className="px-5 py-4">{product.roastLevel}</td>
                  <td className="px-5 py-4">{product.origin}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`badge-base ${
                        lowStock
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      } text-center`}
                    >
                      {product.stock} in stock
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {product.featured ? (
                        <span className="badge-base bg-crema text-roast">
                          Featured
                        </span>
                      ) : null}

                      {product.bestSeller ? (
                        <span className="badge-base bg-amber-100 text-amber-700">
                          Best Seller
                        </span>
                      ) : null}

                      {!product.featured && !product.bestSeller ? (
                        <span className="badge-base bg-oat text-mocha/70">
                          Standard
                        </span>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="btn-secondary w-full px-4 py-2 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onAddStock(product)}
                        className="btn-secondary w-full px-4 py-2 text-xs"
                      >
                        Add Stock
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="btn-danger w-full px-4 py-2 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8} className="px-5 py-10 text-center text-mocha/60">
                {loading ? "Loading products..." : "No products found."}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t border-mocha/10 px-4 py-4">
        <div className="text-sm text-mocha/60">
          <p className="flex gap-1">
            Page
            <span className="font-semibold">{data.metadata.page}</span>
            of
            <span className="font-semibold">{data.metadata.totalPages}</span> —
            <span className="font-semibold">{data.metadata.count}</span>{" "}
            Products
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
