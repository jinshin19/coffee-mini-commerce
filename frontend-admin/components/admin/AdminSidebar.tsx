"use client";

// Next Imports
import Link from "next/link";
import { usePathname } from "next/navigation";
// Components
import { BrandLogo } from "@/components/admin/BrandLogo";

const links = [
  { href: "/", label: "Overview", icon: "◻" },
  { href: "/products", label: "Products", icon: "◫" },
  { href: "/orders", label: "Orders", icon: "◎" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-80 shrink-0 border-r border-mocha/10 bg-white/80 px-6 py-8 backdrop-blur lg:flex lg:flex-col">
      <BrandLogo />

      <nav className="mt-10 space-y-2">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-[1.4rem] px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-roast text-white shadow-soft"
                  : "text-mocha hover:bg-oat"
              }`}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-base">
                {link.icon}
              </span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[1.75rem] bg-gradient-to-br from-roast to-mocha p-5 text-white shadow-glow">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
          Single Admin Mode
        </p>
        <h3 className="mt-3 text-xl font-semibold">
          Built for quick daily operations.
        </h3>
        <p className="mt-3 text-sm leading-6 text-white/75">
          Manage products, approve incoming coffee orders, and keep inventory
          healthy without leaving the dashboard.
        </p>
      </div>
    </aside>
  );
}
