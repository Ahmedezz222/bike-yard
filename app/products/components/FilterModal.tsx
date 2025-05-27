'use client';

import { useEffect, useState } from 'react';
import styles from '../page.module.css';

const FilterModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get DOM elements
    const modal = document.getElementById('filterModal');
    const openBtn = document.querySelector(`.${styles.mobileFilterBtn}`);
    const closeBtn = document.querySelector(`.${styles.modalClose}`);

    // Open modal function
    const openModal = () => {
      if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        setIsOpen(true);
      }
    };

    // Close modal function
    const closeModal = () => {
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        setIsOpen(false);
      }
    };

    // Click outside to close
    const handleOutsideClick = (e: MouseEvent) => {
      if (modal && e.target === modal) {
        closeModal();
      }
    };

    // Add event listeners
    openBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', handleOutsideClick);

    // Cleanup
    return () => {
      openBtn?.removeEventListener('click', openModal);
      closeBtn?.removeEventListener('click', closeModal);
      modal?.removeEventListener('click', handleOutsideClick);
      document.body.style.overflow = ''; // Ensure scrolling is restored
    };
  }, []);

  // Handle filter application
  const handleApplyFilters = () => {
    const category = (document.getElementById('categoryMobile') as HTMLSelectElement)?.value;
    const minPrice = (document.getElementById('minPriceMobile') as HTMLInputElement)?.value;
    const maxPrice = (document.getElementById('maxPriceMobile') as HTMLInputElement)?.value;

    // TODO: Implement filter logic
    console.log('Applying filters:', { category, minPrice, maxPrice });

    // Close modal after applying filters
    const modal = document.getElementById('filterModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      setIsOpen(false);
    }
  };

  // Handle filter clearing
  const handleClearFilters = () => {
    const categorySelect = document.getElementById('categoryMobile') as HTMLSelectElement;
    const minPriceInput = document.getElementById('minPriceMobile') as HTMLInputElement;
    const maxPriceInput = document.getElementById('maxPriceMobile') as HTMLInputElement;

    if (categorySelect) categorySelect.value = '';
    if (minPriceInput) minPriceInput.value = '';
    if (maxPriceInput) maxPriceInput.value = '';

    // TODO: Implement clear filter logic
    console.log('Clearing filters');

    // Close modal after clearing filters
    const modal = document.getElementById('filterModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <button 
        className={styles.mobileFilterBtn} 
        aria-label="Open filters"
        aria-expanded={isOpen}
      >
        <i className="fas fa-filter"></i>
      </button>

      {/* Filter Modal */}
      <div 
        className={styles.modal} 
        id="filterModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filterModalTitle"
      >
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2 id="filterModalTitle">Filter Products</h2>
            <button 
              className={styles.modalClose} 
              aria-label="Close filters"
              onClick={() => {
                const modal = document.getElementById('filterModal');
                if (modal) {
                  modal.style.display = 'none';
                  document.body.style.overflow = '';
                  setIsOpen(false);
                }
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className={styles.modalBody}>
            <div className={styles.filterGroup}>
              <label htmlFor="categoryMobile">Category</label>
              <select id="categoryMobile" className={styles.select}>
                <option value="">All Categories</option>
                <option value="mountain">Mountain Bikes</option>
                <option value="road">Road Bikes</option>
                <option value="electric">Electric Bikes</option>
                <option value="accessories">Accessories</option>
                <option value="parts">Parts</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="priceMobile">Price Range</label>
              <div className={styles.priceInputs}>
                <input 
                  type="number" 
                  id="minPriceMobile" 
                  placeholder="Min" 
                  className={styles.priceInput}
                  min="0"
                />
                <span className={styles.priceSeparator}>to</span>
                <input 
                  type="number" 
                  id="maxPriceMobile" 
                  placeholder="Max" 
                  className={styles.priceInput}
                  min="0"
                />
              </div>
            </div>

            <div className={styles.filterActions}>
              <button 
                className={`${styles.button} ${styles.primary}`}
                onClick={handleApplyFilters}
              >
                Apply Filters
              </button>
              <button 
                className={`${styles.button} ${styles.secondary}`}
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterModal; 