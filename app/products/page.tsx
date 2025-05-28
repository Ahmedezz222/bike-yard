'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useCart } from '../lib/CartContext';
import { formatPrice } from '../lib/currency';

// Add this configuration for Next.js Image component
const imageLoader = ({ src }: { src: string }) => {
  return src;
};

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  featured: boolean;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const { addToCart } = useCart();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filterProducts = useCallback(() => {
    let filtered = [...products];

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Apply price filters
    if (filters.minPrice) {
      filtered = filtered.filter(product => 
        product.price >= Number(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(product => 
        product.price <= Number(filters.maxPrice)
      );
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { id, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const closeFilters = () => {
    setIsFilterOpen(false);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  return (
    <div className={styles.pageWrapper}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Our Products</h1>
          
          {/* Filter Toggle Button */}
          <button 
            className={styles.filterToggle}
            onClick={toggleFilters}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filters
          </button>

          {/* Filter Overlay */}
          <div 
            className={`${styles.filterOverlay} ${isFilterOpen ? styles.open : ''}`}
            onClick={closeFilters}
          />

          {/* Filters Panel */}
          <div className={`${styles.filters} ${isFilterOpen ? styles.open : ''}`}>
            <div className={styles.filterGroup}>
              <label htmlFor="category">Category</label>
              <select 
                id="category" 
                className={styles.select}
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                <option value="Mountain Bikes">Mountain Bikes</option>
                <option value="Road Bikes">Road Bikes</option>
                <option value="Electric Bikes">Electric Bikes</option>
                <option value="Accessories">Accessories</option>
                <option value="Parts">Parts</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="price">Price Range</label>
              <div className={styles.priceInputs}>
                <input 
                  type="number" 
                  id="minPrice" 
                  placeholder="Min" 
                  className={styles.priceInput}
                  min="0"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
                <span className={styles.priceSeparator}>to</span>
                <input 
                  type="number" 
                  id="maxPrice" 
                  placeholder="Max" 
                  className={styles.priceInput}
                  min="0"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className={styles.filterActions}>
              <button 
                className={`${styles.button} ${styles.primary}`}
                onClick={() => {
                  filterProducts();
                  closeFilters();
                }}
              >
                Apply Filters
              </button>
              <button 
                className={`${styles.button} ${styles.secondary}`}
                onClick={() => {
                  clearFilters();
                  closeFilters();
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className={styles.productsGrid}>
            {isLoading ? (
              <div className={styles.loading}>Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className={styles.emptyState}>No products found</div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product._id} className={styles.productCard}>
                  <div className={styles.productImage}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ 
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/bike-yard-logo.png';
                          target.alt = 'Product image not available';
                          target.onerror = null; // Prevent infinite loop
                        }}
                      />
                    ) : (
                      <img
                        src="/bike-yard-logo.png"
                        alt="No image available"
                        style={{ 
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          opacity: 0.5
                        }}
                      />
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <h3>{product.name}</h3>
                    <p className={styles.price}>{formatPrice(product.price)}</p>
                    <p className={styles.description}>{product.description}</p>
                    <div className={styles.productMeta}>
                      <span className={styles.category}>{product.category}</span>
                      <span className={styles.stock}>
                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                      </span>
                    </div>
                    <button
                      className={styles.addToCartButton}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      
      <Footer />
    </div>
  );
};

export default ProductsPage;
