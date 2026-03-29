export function BrandStory() {
  return (
    <section id="story" className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-mocha/10 bg-oat p-4 shadow-soft">
          <img
            src="/images/story-cafe.svg"
            alt="Coffee brewing story"
            className="h-full w-full rounded-[1.5rem] object-cover"
          />
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-latte">
            Our Story
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-roast">
            Jinshin Brew Reserve Coffee House was created as a calm space in the
            middle of busy days
          </h2>
          <p className="text-base leading-8 text-mocha/80">
            — a place where good coffee slows things down. From bean sourcing to
            the final pour, the focus is simple: make every cup feel
            intentional. The brand combines modern café aesthetics with
            approachable drinks that still feel elevated.
          </p>
          <p className="text-base leading-8 text-mocha/80">
            Whether you're starting your morning, taking a midday break, or
            winding down in the evening, Jinshin Brew Reserve Coffee House is
            crafted to make every moment a little more memorable.
          </p>
        </div>
      </div>
    </section>
  );
}
