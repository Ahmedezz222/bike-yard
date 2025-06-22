"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "../lib/CartContext";
import { StorageProvider } from "../lib/StorageContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <StorageProvider>
          {children}
        </StorageProvider>
      </CartProvider>
    </SessionProvider>
  );
}
