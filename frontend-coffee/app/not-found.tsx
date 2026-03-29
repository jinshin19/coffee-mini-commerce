import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-oat py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-mocha/10 bg-white p-10 text-center shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-latte">Not Found</p>
          <h1 className="mt-4 text-4xl font-semibold text-roast">This coffee page does not exist.</h1>
          <p className="mt-4 text-base leading-7 text-mocha/80">The product may have been removed or the URL may be incorrect.</p>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-roast px-6 py-3 text-sm font-semibold text-white transition hover:bg-mocha">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
