// Next Imports
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-[2rem] border border-mocha/10 bg-white p-10 text-center shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-latte">
        Not Found
      </p>
      <h1 className="mt-4 text-4xl font-semibold text-roast">
        This admin page does not exist.
      </h1>
      <p className="mt-4 text-base leading-7 text-mocha/80">
        The page may have been moved or the route is incorrect.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-roast px-6 py-3 text-sm font-semibold text-white transition hover:bg-mocha"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
