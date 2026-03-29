export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-mocha/20 bg-oat/70 px-6 py-12 text-center">
      <h3 className="text-xl font-semibold text-roast">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-mocha/75">{description}</p>
    </div>
  );
}
