// 'use client';
import type { Metadata, Viewport } from "next";
import { Inter, Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CartProvider } from "./lib/CartContext";
import { StorageProvider } from "./lib/StorageContext";
import ClientProviders from "./components/ClientProviders";
import Navigation from "./components/Navigation";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Bike Yard",
  description: "Your One-Stop Shop for All Things Cycling",
  icons: {
    icon: "/img/bike-yard-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#007bff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} ${roboto.className}`}>
        <ClientProviders>
          <Navigation />
          {/* <Header /> */}
          {children}
        </ClientProviders>
        <Analytics />
      </body>
    </html>
  );
}
