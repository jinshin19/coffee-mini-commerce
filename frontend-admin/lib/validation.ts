import { ProductFormValues } from "@/lib/types";
import { slugify } from "@/lib/utils";

export type ProductFormErrors = Partial<
  Record<keyof ProductFormValues, string>
>;

export function validateProductForm(
  values: ProductFormValues,
): ProductFormErrors {
  const errors: ProductFormErrors = {};

  if (!values.name.trim()) errors.name = "Product name is required.";
  if (!values.category.trim()) errors.category = "Category is required.";
  if (!values.shortDescription.trim())
    errors.shortDescription = "Short description is required.";
  // if (!values.description.trim()) errors.description = 'Description is required.';
  if (!values.roastLevel.trim()) errors.roastLevel = "Roast level is required.";
  if (!values.origin.trim()) errors.origin = "Origin is required.";
  if (!values.image.trim()) errors.image = "Image path is required.";

  const safeSlug = slugify(values.slug || values.name);
  if (!safeSlug) {
    errors.slug = "Slug is required.";
  }

  const price = Number(values.price);
  if (!values.price.trim()) {
    errors.price = "Price is required.";
  } else if (Number.isNaN(price) || price <= 0) {
    errors.price = "Price must be greater than 0.";
  }

  const stock = Number(values.stock);
  if (!values.stock.trim()) {
    errors.stock = "Stock is required.";
  } else if (Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    errors.stock = "Stock must be a whole number 0 or higher.";
  }

  return errors;
}

export function validateStockAmount(value: string) {
  if (!value.trim()) return "Stock amount is required.";
  const stock = Number(value);
  if (Number.isNaN(stock) || stock <= 0 || !Number.isInteger(stock)) {
    return "Add stock must be a whole number greater than 0.";
  }
  return "";
}
