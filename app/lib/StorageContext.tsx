'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
  clearRecentProducts: () => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [savedFilters, setSavedFilters] = useState<StorageContextType['savedFilters']>({});
  const [recentProducts, setRecentProducts] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const savedFiltersData = localStorage.getItem('savedFilters');
      const recentProductsData = localStorage.getItem('recentProducts');

      if (savedFiltersData) {
        const parsedFilters = JSON.parse(savedFiltersData);
        if (parsedFilters && typeof parsedFilters === 'object') {
          setSavedFilters(parsedFilters);
        }
      }

      if (recentProductsData) {
        const parsedProducts = JSON.parse(recentProductsData);
        if (Array.isArray(parsedProducts)) {
          setRecentProducts(parsedProducts);
        }
      }
    } catch (error) {
      console.error('Error loading storage data from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('savedFilters');
      localStorage.removeItem('recentProducts');
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const saveFilters = useCallback((filters: StorageContextType['savedFilters']) => {
    setSavedFilters(filters);
    if (isInitialized) {
      try {
        localStorage.setItem('savedFilters', JSON.stringify(filters));
      } catch (error) {
        console.error('Error saving filters to localStorage:', error);
      }
    }
  }, [isInitialized]);

  const clearFilters = useCallback(() => {
    setSavedFilters({});
    if (isInitialized) {
      try {
        localStorage.removeItem('savedFilters');
      } catch (error) {
        console.error('Error clearing filters from localStorage:', error);
      }
    }
  }, [isInitialized]);

  const addRecentProduct = useCallback((productId: string) => {
    setRecentProducts(prev => {
      const updated = [productId, ...prev.filter(id => id !== productId)].slice(0, 5);
      if (isInitialized) {
        try {
          localStorage.setItem('recentProducts', JSON.stringify(updated));
        } catch (error) {
          console.error('Error saving recent products to localStorage:', error);
        }
      }
      return updated;
    });
  }, [isInitialized]);

  const clearRecentProducts = useCallback(() => {
    setRecentProducts([]);
    if (isInitialized) {
      try {
        localStorage.removeItem('recentProducts');
      } catch (error) {
        console.error('Error clearing recent products from localStorage:', error);
      }
    }
  }, [isInitialized]);

  const contextValue = React.useMemo(() => ({
    savedFilters,
    recentProducts,
    saveFilters,
    clearFilters,
    addRecentProduct,
    clearRecentProducts,
  }), [savedFilters, recentProducts, saveFilters, clearFilters, addRecentProduct, clearRecentProducts]);

  return (
    <StorageContext.Provider value={contextValue}>
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