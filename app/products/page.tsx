import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import Navigation from '../components/Navigation';
import FilterModal from './components/FilterModal';
import Footer from '../components/Footer'; 
const ProductsPage = () => {    
  return (
    <div className={styles.pageWrapper}>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Our Products</h1>
          
          {/* Desktop Filters Section */}
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label htmlFor="category">Category</label>
              <select id="category" className={styles.select}>
                <option value="">All Categories</option>
                <option value="mountain">Mountain Bikes</option>
                <option value="road">Road Bikes</option>
                <option value="electric">Electric Bikes</option>
                <option value="accessories">Accessories</option>
                <option value="parts">Parts</option>
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
                />
                <span className={styles.priceSeparator}>to</span>
                <input 
                  type="number" 
                  id="maxPrice" 
                  placeholder="Max" 
                  className={styles.priceInput}
                  min="0"
                />
              </div>
            </div>

            <div className={styles.filterActions}>
              <button className={`${styles.button} ${styles.primary}`}>
                Apply Filters
              </button>
              <button className={`${styles.button} ${styles.secondary}`}>
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className={styles.productsGrid}>
            {/* Placeholder for products */}
            <div className={styles.placeholder}>
              Products coming soon...
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Modal Component */}
      <FilterModal />
      <Footer />
    </div>
  );
};

export default ProductsPage;
