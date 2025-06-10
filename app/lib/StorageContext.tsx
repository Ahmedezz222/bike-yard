'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Filters {
  category: string;
  minPrice: string;
  maxPrice: string;
}

interface StorageContextType {
  savedFilters: Filters;
  recentProducts: string[];
  saveFilters: (filters: Filters) => void;
  clearFilters: () => void;
  addRecentProduct: (productId: string) => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedFilters, setSavedFilters] = useState<Filters>({
    category: '',
    minPrice: '',
    maxPrice: ''
  });
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

  const saveFilters = (filters: Filters) => {
    setSavedFilters(filters);
    localStorage.setItem('savedFilters', JSON.stringify(filters));
  };

  const clearFilters = () => {
    const emptyFilters = {
      category: '',
      minPrice: '',
      maxPrice: ''
    };
    setSavedFilters(emptyFilters);
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
        addRecentProduct
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
}; 