import { notFound } from "next/navigation";
import { ApiCoffeeProduct, fetchProductBySlug, fetchProducts } from "@/lib/api";
import { formatCurrency } from "@/lib/currency";
import { ProductActions } from "@/components/ProductActions";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function CoffeeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    fetchProductBySlug(slug),
    fetchProducts<ApiCoffeeProduct>({ limit: 50 }),
  ]);

  if (!product) {
    notFound();
  }

  const related =
    allProducts.data.items.length > 0 &&
    (allProducts.data.items
      .filter((item) => item.slug !== product.slug)
      .slice(0, 3) as ApiCoffeeProduct[]);

  return (
    <div className="bg-oat py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem] border border-mocha/10 bg-white p-4 shadow-glow">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full rounded-[1.5rem] object-cover"
            />
          </div>

          <div className="flex flex-col justify-center space-y-7">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-latte">
                {product.category}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-roast sm:text-5xl">
                {product.name}
              </h1>
              <p className="text-lg leading-8 text-mocha/80">
                {product.description}
              </p>
            </div>

            <div className="grid gap-4 rounded-[2rem] border border-mocha/10 bg-white p-6 shadow-soft sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-mocha/45">
                  Roast
                </p>
                <p className="mt-2 font-semibold text-roast">
                  {product.roastLevel}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-mocha/45">
                  Origin
                </p>
                <p className="mt-2 font-semibold text-roast">
                  {product.origin}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-mocha/45">
                  Price
                </p>
                <p className="mt-2 font-semibold text-roast">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </div>

            {product.stock <= 0 ? (
              <div className="rounded-[2rem] border border-red-200 bg-red-50 px-6 py-4 text-center">
                <p className="text-sm font-semibold text-red-700">
                  Out of Stock
                </p>
                <p className="mt-1 text-sm text-red-600">
                  This product is currently unavailable.
                </p>
              </div>
            ) : (
              <ProductActions product={product} />
            )}
          </div>
        </div>

        <section className="mt-20">
          <div className="mb-8 max-w-2xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-latte">
              You May Also Like
            </p>
            <h2 className="text-3xl font-semibold text-roast">
              More drinks from Brew Reserve
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {typeof related !== "boolean" &&
              related.length > 0 &&
              related.map((item) => {
                return <ProductCard key={item._id} product={item} />;
              })}
          </div>
        </section>
      </div>
    </div>
  );
}
