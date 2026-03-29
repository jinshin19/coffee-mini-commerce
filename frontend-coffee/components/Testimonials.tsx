const testimonials = [
  {
    name: 'Ariana M.',
    role: 'Remote Designer',
    quote: 'The site feels like a real boutique coffee brand, and the drinks feel curated instead of generic.',
  },
  {
    name: 'Miguel T.',
    role: 'Creative Lead',
    quote: 'The buy-now and GCash flow actually feels ready for real-world use, which makes the whole experience stronger.',
  },
  {
    name: 'Leah S.',
    role: 'Weekend Café Hopper',
    quote: 'Warm, premium, and polished. It looks like something I would genuinely order from.',
  },
];

export function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-latte">Customer Highlights</p>
          <h2 className="text-4xl font-semibold tracking-tight text-roast">Loved for the flavor and the feeling.</h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-[2rem] border border-mocha/10 bg-oat p-7 shadow-soft">
              <p className="text-base leading-8 text-mocha/85">“{item.quote}”</p>
              <div className="mt-8 border-t border-mocha/10 pt-5">
                <p className="font-semibold text-roast">{item.name}</p>
                <p className="text-sm text-mocha/65">{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
