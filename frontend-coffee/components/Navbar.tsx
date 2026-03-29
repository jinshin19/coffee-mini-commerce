"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/#featured", label: "Featured" },
  { href: "/#story", label: "Story" },
  { href: "/checkout", label: "Checkout" },
];

export function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-roast/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-oat sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-gradient-to-br from-latte to-mocha text-sm font-semibold shadow-glow">
            JH
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-crema/70">
              Jinshin19 Brew Reserve
            </p>
            <h1 className="text-lg font-semibold">Coffee House</h1>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition ${
                  active ? "text-white" : "text-crema/75 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/cart"
          className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Cart
          <span className="grid h-7 min-w-7 place-items-center rounded-full bg-latte px-2 text-xs font-semibold text-roast">
            {itemCount}
          </span>
        </Link>
      </div>
    </header>
  );
}
