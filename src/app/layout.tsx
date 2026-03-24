import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Header from "@/components/Header"; // Import the new Header
import Footer from "@/components/Footer"; // Import the new Footer
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "VOS Fragrance | Victorious Opulent Scents",
  description:
    "25% Extrait de Parfum collection including Sultanat and Musky Flora.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body className="antialiased">
        <CartProvider>
          {/* Header stays at the top of every page */}
          <Header />

          {children}

          {/* Footer stays at the bottom of every page */}
          <Footer />

          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
