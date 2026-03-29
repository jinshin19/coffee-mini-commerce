import { SectionHeading } from "./SectionHeading";

const highlights = [
  {
    title: "Thoughtfully Curated Menu",
    description:
      "Each offering is designed to feel premium and consistent, making it easy to find a brew you’ll come back to again and again.",
  },
  {
    title: "Clean, Modern Experience",
    description:
      "From browsing to ordering, every detail is designed to be smooth, intuitive, and visually polished.",
  },
  {
    title: "Crafted for Everyday Moments",
    description:
      "Whether it’s your morning start or an afternoon reset, our coffee is made to fit naturally into your day.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-[#f4e7da] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-4">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Coffee-First Quality."
            description="Carefully selected beans and balanced roasting for a refined yet approachable taste."
          />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-mocha/10 bg-white p-7 shadow-soft"
            >
              <div className="mb-6 h-12 w-12 rounded-2xl bg-roast/90" />
              <h3 className="text-xl font-semibold text-roast">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-mocha/80">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
