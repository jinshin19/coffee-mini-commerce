"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileTopbar } from "@/components/admin/MobileTopbar";
import { AdminTopHeader } from "@/components/admin/AdminTopHeader";

export function AdminShell({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname.includes("/login");

  console.log("dawdwadwadaw", {
    isAuthenticated,
    isLoginPage,
  });

  // create new endpoint when in the login page it should call a request that checks if the user is logged in already or not
  // like checks the token attached to the request if valid then it's logged in, if not then delete that token and have the user to login manually again

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
