import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { BrandStory } from "@/components/BrandStory";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Testimonials } from "@/components/Testimonials";
import { ApiCoffeeProduct, fetchProducts } from "@/lib/api";

export default async function HomePage() {
  const [allProducts, featuredProducts, bestSellers] = await Promise.all([
    fetchProducts<ApiCoffeeProduct>({ limit: 50 }),
    fetchProducts<ApiCoffeeProduct>({ filter: "featured", limit: 20 }),
    fetchProducts<ApiCoffeeProduct>({ filter: "bestseller", limit: 20 }),
  ]);

  return (
    <>
      <Hero />

      <section id="featured" className="bg-oat py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Featured Coffees"
            title="Signature drinks made to look good and taste even better."
            description="A curated lineup of premium coffee picks designed for people who want a believable modern café experience."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featuredProducts.data.items.length > 0 &&
              featuredProducts.data.items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Best Sellers"
            title="The most-loved orders from our everyday regulars."
            description="Smooth, crowd-pleasing, and easy to order again. These best sellers are built for comfort with a premium edge."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {bestSellers.data.items.length > 0 &&
              bestSellers.data.items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </div>
      </section>

      <BrandStory />
      <WhyChooseUs />

      <section className="bg-oat py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Full Menu"
            title="Explore the full range of our coffee offerings."
            description="Discover flavor profiles, origins, and roast details, and order your favorites with just a few clicks."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {allProducts.data.items.length > 0 &&
              allProducts.data.items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </div>
      </section>

      <Testimonials />
    </>
  );
}
