"use client";

// Next Imports
import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
// Context
import { useAuth } from "@/context/AuthContext";
// Componets
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileTopbar } from "@/components/admin/MobileTopbar";
import { AdminTopHeader } from "@/components/admin/AdminTopHeader";

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const isLoginPage = pathname.includes("/login");

  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fbf7f2,transparent_38%),linear-gradient(180deg,#f7efe7_0%,#f2e8de_100%)] text-roast">
      <MobileTopbar />
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <AdminSidebar />
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <AdminTopHeader />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
