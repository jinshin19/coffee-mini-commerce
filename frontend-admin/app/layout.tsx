// Next Imports
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
// Context
import { AuthProvider } from "@/context/AuthContext";
// Components
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Brew Reserve Admin Dashboard",
  description: "Modern coffee-branded admin dashboard built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AdminShell>{children}</AdminShell>
        </AuthProvider>
      </body>
    </html>
  );
}
