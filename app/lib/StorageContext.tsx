'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface StorageContextType {
  savedFilters: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  };
  recentProducts: string[];
  saveFilters: (filters: { category?: string; minPrice?: string; maxPrice?: string }) => void;
  clearFilters: () => void;
  addRecentProduct: (productId: string) => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [savedFilters, setSavedFilters] = useState<StorageContextType['savedFilters']>({});
  const [recentProducts, setRecentProducts] = useState<string[]>([]);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedFiltersData = localStorage.getItem('savedFilters');
    const recentProductsData = localStorage.getItem('recentProducts');

    if (savedFiltersData) {
      setSavedFilters(JSON.parse(savedFiltersData));
    }

    if (recentProductsData) {
      setRecentProducts(JSON.parse(recentProductsData));
    }
  }, []);

  const saveFilters = (filters: StorageContextType['savedFilters']) => {
    setSavedFilters(filters);
    localStorage.setItem('savedFilters', JSON.stringify(filters));
  };

  const clearFilters = () => {
    setSavedFilters({});
    localStorage.removeItem('savedFilters');
  };

  const addRecentProduct = (productId: string) => {
    setRecentProducts(prev => {
      const updated = [productId, ...prev.filter(id => id !== productId)].slice(0, 5);
      localStorage.setItem('recentProducts', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <StorageContext.Provider
      value={{
        savedFilters,
        recentProducts,
        saveFilters,
        clearFilters,
        addRecentProduct,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
} 