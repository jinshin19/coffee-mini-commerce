import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Jinshin19 Brew Reserve Coffee House",
  description:
    "Jinshin19 Brew Reserve Coffee House offers carefully selected coffee beans, expertly roasted to deliver a rich and refined experience in every cup.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div className="min-h-screen bg-oat text-roast">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
