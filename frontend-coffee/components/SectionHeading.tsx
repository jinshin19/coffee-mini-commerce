export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-latte">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-roast sm:text-4xl">{title}</h2>
      <p className="text-base leading-7 text-mocha/80">{description}</p>
    </div>
  );
}
