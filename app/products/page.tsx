'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Footer from '../components/Footer';
import Message from '../components/Message';
import { useCart } from '../lib/CartContext';
import { useStorage } from '../lib/StorageContext';
import { formatPrice } from '../lib/currency';
import { sampleProducts, Product } from '../lib/sampleProducts';





const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const { addToCart } = useCart();
  const { 
    savedFilters, 
    saveFilters, 
    clearFilters: clearStorageFilters,
    addRecentProduct 
  } = useStorage();

  const [filters, setFilters] = useState(savedFilters);

  useEffect(() => {
    // Simulate API call with sample data
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(sampleProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filterProducts = useCallback(() => {
    let filtered = [...products];

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === (filters.category || '').toLowerCase()
      );
    }

    // Apply price filters
    if (filters.minPrice) {
      filtered = filtered.filter(product => 
        product.basePrice >= Number(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(product => 
        product.basePrice <= Number(filters.maxPrice)
      );
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { id, value } = e.target;
    const newFilters = {
      ...filters,
      [id]: value
    };
    setFilters(newFilters);
    saveFilters(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      category: '',
      minPrice: '',
      maxPrice: ''
    };
    setFilters(emptyFilters);
    clearStorageFilters();
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const closeFilters = () => {
    setIsFilterOpen(false);
  };

  const handleAddToCart = (product: Product) => {
    // For products with variants, redirect to product detail page
    if (product.variantTypes.length > 0) {
      window.location.href = `/products/${product._id}`;
      return;
    }
    
    // For simple products without variants, add directly to cart
    addToCart({
      id: product._id,
      name: product.title,
      price: product.basePrice,
      image: product.baseImages[0],
    });
    setMessage({
      text: `${product.title} added to cart!`,
      type: 'success'
    });
  };

  const handleImageClick = (product: Product) => {
    // Navigate to product detail page
    window.location.href = `/products/${product._id}`;
  };

  const closeImageModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* <Navigation /> removed */}
      
      {message && (
        <Message
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

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
                value={filters.category || ''}
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
                  <div 
                    className={styles.productImage}
                    onClick={() => handleImageClick(product)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Image
                      src={product.baseImages && product.baseImages.length > 0 ? product.baseImages[0] : '/images/placeholder.jpg'}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={false}
                      loading="lazy"
                      quality={85}
                      style={{
                        objectFit: 'cover'
                      }}
                    />
                    {product.baseImages && product.baseImages.length > 1 && (
                      <div className={styles.imageCount}>
                        +{product.baseImages.length - 1} more
                      </div>
                    )}
                    {product.variantTypes.length > 0 && (
                      <div className={styles.variantBadge}>
                        {product.variantTypes.length} Options
                      </div>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <h3>{product.title}</h3>
                    <p className={styles.price}>{formatPrice(product.basePrice)}</p>
                    <p className={styles.description}>{product.description}</p>
                    <div className={styles.productMeta}>
                      <span className={styles.category}>{product.category}</span>
                      <span className={styles.stock}>
                        {product.variants.some(v => v.inventoryQuantity > 0) ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <button
                      className={styles.addToCartButton}
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.variants.some(v => v.inventoryQuantity > 0)}
                    >
                      {product.variants.some(v => v.inventoryQuantity > 0) ? 'View Options' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className={styles.imageModal} onClick={closeImageModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeImageModal}>×</button>
            <div className={styles.modalGrid}>
              <div className={styles.modalImageContainer}>
                <div className={styles.imageGallery}>
                  {selectedProduct.images.map((image, index) => (
                    <div key={index} className={styles.galleryImage}>
                      <Image
                        src={image}
                        alt={`${selectedProduct.name} - Image ${index + 1}`}
                        width={600}
                        height={400}
                        style={{
                          objectFit: 'contain',
                          maxWidth: '100%',
                          maxHeight: '70vh'
                        }}
                      />
                    </div>
                  ))}
                </div>
                {selectedProduct.images.length > 1 && (
                  <div className={styles.galleryThumbnails}>
                    {selectedProduct.images.map((image, index) => (
                      <div
                        key={index}
                        className={styles.thumbnail}
                        onClick={() => {
                          const gallery = document.querySelector(`.${styles.imageGallery}`);
                          if (gallery) {
                            gallery.scrollTo({
                              left: index * gallery.clientWidth,
                              behavior: 'smooth'
                            });
                          }
                        }}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          width={80}
                          height={80}
                          style={{
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.modalDetails}>
                <h2 className={styles.modalTitle}>{selectedProduct.name}</h2>
                <p className={styles.modalPrice}>{formatPrice(selectedProduct.price)}</p>
                <p className={styles.modalDescription}>{selectedProduct.description}</p>
                <div className={styles.modalMeta}>
                  <span className={styles.modalCategory}>Category: {selectedProduct.category}</span>
                  <span className={styles.modalStock}>
                    {selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock})` : 'Out of Stock'}
                  </span>
                </div>
                <button
                  className={styles.modalAddToCart}
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    closeImageModal();
                  }}
                  disabled={selectedProduct.stock === 0}
                >
                  {selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default ProductsPage;
