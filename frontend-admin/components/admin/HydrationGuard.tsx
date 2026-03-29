// HydrationGuard is deprecated — hydration is now handled by AuthProvider in AuthContext.
// This stub is kept to avoid import errors during transition.
import type { ReactNode } from 'react';

export function HydrationGuard({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
