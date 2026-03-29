import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-mocha/15 bg-roast text-crema">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-crema/55">
            Jinshin19 Brew Reserve Coffee House
          </p>
          <h2 className="text-2xl font-semibold text-white">
            Crafted coffee for slower, better days.
          </h2>
          <p className="max-w-xl text-sm leading-7 text-crema/75">
            A premium coffee e-commerce concept built with a modern café
            aesthetic, warm palettes, and a realistic shopping flow.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-crema/55">
            Explore
          </h3>
          <div className="space-y-3 text-sm text-crema/75">
            <Link href="/#featured" className="block hover:text-white">
              Featured Coffees
            </Link>
            <Link href="/#story" className="block hover:text-white">
              Brand Story
            </Link>
            <Link href="/cart" className="block hover:text-white">
              Cart
            </Link>
            <Link href="/checkout" className="block hover:text-white">
              Checkout
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-crema/55">
            Visit
          </h3>
          <div className="space-y-3 text-sm text-crema/75 flex flex-col">
            <Link
              className="hover:text-white"
              href={
                "https://www.linkedin.com/in/joshua-philip-unilongo-9b29892b6/"
              }
              target="_blank"
            >
              Linkedin
            </Link>
            <Link
              className="hover:text-white"
              href={"https://jp-unilongo.site/"}
              target="_blank"
            >
              Portfolio Website
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
