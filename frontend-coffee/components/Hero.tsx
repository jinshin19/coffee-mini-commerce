import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-roast text-white">
      <div className="absolute inset-0 bg-hero-radial" />
      <div className="absolute inset-0 bg-[url('/images/hero-texture.svg')] bg-coffee-grid bg-[size:20px_20px] opacity-20" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
        <div className="space-y-8">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-crema/80">
            Premium Coffee Experience
          </span>
          <div className="space-y-6">
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl">
              Slow-brewed coffee, designed like a real modern café brand.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-crema/78">
              Discover signature lattes, bold cold brews, and elegant espresso drinks crafted for busy mornings, focused afternoons, and cozy nights.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/#featured"
              className="rounded-full bg-latte px-6 py-3 text-sm font-semibold text-roast transition hover:-translate-y-0.5 hover:bg-crema"
            >
              Explore Menu
            </Link>
            <Link
              href="/checkout"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Order Now
            </Link>
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-4 pt-4">
            {[
              { value: '10k+', label: 'cups served monthly' },
              { value: '4.9/5', label: 'customer reviews' },
              { value: 'Single', label: 'origin beans selected' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="mt-2 text-sm text-crema/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-x-10 bottom-6 top-10 rounded-[2rem] bg-gradient-to-b from-latte/15 to-transparent blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-glow">
            <img src="/images/hero-cup.svg" alt="Brew Reserve signature coffee" className="h-full w-full max-w-xl rounded-[1.5rem] object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
