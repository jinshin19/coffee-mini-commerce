'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const titles: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Coffee operations at a glance',
    description: 'Monitor products, inventory pressure, and incoming orders from one polished workspace.',
  },
  '/products': {
    title: 'Manage coffee products',
    description: 'Add, edit, restock, and maintain the product lineup without losing the brand feel.',
  },
  '/orders': {
    title: 'Review incoming orders',
    description: 'See pending, confirmed, and rejected orders with clear status handling.',
  },
};

export function AdminTopHeader() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const key = pathname.startsWith('/orders/') ? '/orders' : pathname;
  const meta = titles[key] ?? titles['/'];

  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-latte">Brew Reserve Internal</p>
        <h1 className="text-3xl font-semibold tracking-tight text-roast sm:text-4xl">{meta.title}</h1>
        <p className="max-w-3xl text-base leading-7 text-mocha/80">{meta.description}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={logout}
          className="btn-secondary"
          title="Sign out of admin dashboard"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
