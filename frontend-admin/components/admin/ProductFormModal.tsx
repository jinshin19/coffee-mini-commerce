"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { ApiProduct } from "@/lib/api";
import { ProductFormValues } from "@/lib/types";
import { getProductFormDefaults, slugify } from "@/lib/utils";
import { validateProductForm } from "@/lib/validation";

export function ProductFormModal({
  open,
  mode,
  initialProduct,
  onClose,
  onSubmit,
  loading = false,
}: {
  open: boolean;
  mode: "add" | "edit";
  initialProduct?: ApiProduct | null;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void;
  loading?: boolean;
}) {
  const [slugTouched, setSlugTouched] = useState(false);
  const [values, setValues] = useState<ProductFormValues>(
    getProductFormDefaults(),
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormValues, string>>
  >({});

  const roastLevels = [
    "light",
    "medium-light",
    "medium",
    "medium-dark",
    "dark",
    "espresso",
  ] as const;

  useEffect(() => {
    if (!open) return;

    if (initialProduct) {
      setValues({
        name: initialProduct.name,
        slug: initialProduct.slug,
        category: initialProduct.category,
        shortDescription: initialProduct.shortDescription,
        description: initialProduct.description,
        price: String(initialProduct.price),
        image: initialProduct.image,
        roastLevel: initialProduct.roastLevel,
        origin: initialProduct.origin,
        featured: initialProduct.featured,
        bestSeller: initialProduct.bestSeller,
        stock: String(initialProduct.stock),
      });
    } else {
      setValues(getProductFormDefaults());
    }
    setErrors({});
  }, [initialProduct, open]);

  function update<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) {
    setValues((current) => {
      const next = { ...current, [key]: value };

      if (key === "name" && !slugTouched) {
        next.slug = slugify(String(value));
      }

      return next;
    });

    if (key === "slug") setSlugTouched(true);

    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = {
      ...values,
      slug: slugify(values.slug || values.name),
    };
    const nextErrors = validateProductForm(cleaned);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;
    onSubmit(cleaned);
  }

  return (
    <Modal
      open={open}
      title={mode === "add" ? "Add new coffee product" : "Edit coffee product"}
      description="All required product information is validated before saving."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="label-base">Name</label>
            <input
              className="input-base"
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Signature Spanish Latte"
            />
            {errors.name ? <p className="error-text">{errors.name}</p> : null}
          </div>
          <div>
            <label className="label-base">Slug</label>
            <input
              className="input-base"
              value={values.slug}
              onChange={(event) => update("slug", slugify(event.target.value))}
              placeholder="signature-spanish-latte"
            />
            {errors.slug ? <p className="error-text">{errors.slug}</p> : null}
          </div>
          <div>
            <label className="label-base">Category</label>
            <input
              className="input-base"
              value={values.category}
              onChange={(event) => update("category", event.target.value)}
              placeholder="Creamy Espresso Blend"
            />
            {errors.category ? (
              <p className="error-text">{errors.category}</p>
            ) : null}
          </div>
          <div>
            <label className="label-base">Price</label>
            <input
              className="input-base"
              type="number"
              min="1"
              step="1"
              value={values.price}
              onChange={(event) => update("price", event.target.value)}
              placeholder="195"
            />
            {errors.price ? <p className="error-text">{errors.price}</p> : null}
          </div>
          <div>
            <label className="label-base">Roast level</label>

            <select
              className="input-base"
              value={values.roastLevel}
              onChange={(event) => update("roastLevel", event.target.value)}
            >
              <option value="">Select roast level</option>

              {roastLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            {errors.roastLevel ? (
              <p className="error-text">{errors.roastLevel}</p>
            ) : null}
          </div>
          <div>
            <label className="label-base">Origin</label>
            <input
              className="input-base"
              value={values.origin}
              onChange={(event) => update("origin", event.target.value)}
              placeholder="Benguet + Brazil Blend"
            />
            {errors.origin ? (
              <p className="error-text">{errors.origin}</p>
            ) : null}
          </div>
          <div>
            <label className="label-base">Image path</label>
            <input
              className="input-base"
              value={values.image}
              onChange={(event) => update("image", event.target.value)}
              placeholder="/images/coffee-1.svg"
            />
            {errors.image ? <p className="error-text">{errors.image}</p> : null}
          </div>
          <div>
            <label className="label-base">Opening stock</label>
            <input
              className="input-base"
              type="number"
              min="0"
              step="1"
              value={values.stock}
              onChange={(event) => update("stock", event.target.value)}
              placeholder="18"
            />
            {errors.stock ? <p className="error-text">{errors.stock}</p> : null}
          </div>
        </div>

        <div>
          <label className="label-base">Short description</label>
          <input
            className="input-base"
            value={values.shortDescription}
            onChange={(event) => update("shortDescription", event.target.value)}
            placeholder="Velvety espresso layered with milk and caramel sweetness."
          />
          {errors.shortDescription ? (
            <p className="error-text">{errors.shortDescription}</p>
          ) : null}
        </div>

        <div>
          <label className="label-base">Full description</label>
          <textarea
            className="input-base min-h-[130px]"
            value={values.description}
            onChange={(event) => update("description", event.target.value)}
            placeholder="Detailed product description..."
          />
          {errors.description ? (
            <p className="error-text">{errors.description}</p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl border border-mocha/10 bg-oat px-4 py-3 text-sm font-semibold text-roast">
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(event) => update("featured", event.target.checked)}
            />
            Featured product
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-mocha/10 bg-oat px-4 py-3 text-sm font-semibold text-roast">
            <input
              type="checkbox"
              checked={values.bestSeller}
              onChange={(event) => update("bestSeller", event.target.checked)}
            />
            Best seller
          </label>
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading
              ? "Saving…"
              : mode === "add"
                ? "Save Product"
                : "Update Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
