'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/admin/BrandLogo';

const links = [
  { href: '/', label: 'Overview' },
  { href: '/products', label: 'Products' },
  { href: '/orders', label: 'Orders' },
];

export function MobileTopbar() {
  const pathname = usePathname();

  return (
    <div className="border-b border-mocha/10 bg-white/95 px-4 py-4 backdrop-blur lg:hidden">
      <BrandLogo />
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${active ? 'bg-roast text-white' : 'bg-oat text-roast'}`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
