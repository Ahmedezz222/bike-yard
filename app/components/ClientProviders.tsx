"use client";
import { CartProvider } from "../lib/CartContext";
import { StorageProvider } from "../lib/StorageContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <StorageProvider>
        {children}
      </StorageProvider>
    </CartProvider>
  );
}
