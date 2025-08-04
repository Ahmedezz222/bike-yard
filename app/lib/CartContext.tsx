'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variantId?: string;
  variantOptions?: Record<string, string>;
  sku?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // Clear corrupted cart data
      localStorage.removeItem('cart');
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('cart', JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [items, isInitialized]);

  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      // For variant products, we need to match both product ID and variant options
      const existingItem = currentItems.find(item => {
        if (item.id !== product.id) return false;
        
        // If both items have variant options, compare them
        if (item.variantOptions && product.variantOptions) {
          const itemKeys = Object.keys(item.variantOptions).sort();
          const productKeys = Object.keys(product.variantOptions).sort();
          
          if (itemKeys.length !== productKeys.length) return false;
          
          return itemKeys.every(key => 
            item.variantOptions![key] === product.variantOptions![key]
          );
        }
        
        // If neither has variant options, they're the same
        return !item.variantOptions && !product.variantOptions;
      });
      
      if (existingItem) {
        return currentItems.map(item => {
          if (item.id === existingItem.id && 
              JSON.stringify(item.variantOptions) === JSON.stringify(product.variantOptions)) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const contextValue = React.useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  }), [items, addToCart, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 