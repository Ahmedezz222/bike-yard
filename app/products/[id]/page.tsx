'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import styles from './page.module.css';
import Footer from '../../components/Footer';
import Message from '../../components/Message';
import VariantSelector from '../../components/VariantSelector';
import { useCart } from '../../lib/CartContext';
import { useStorage } from '../../lib/StorageContext';
import { formatPrice } from '../../lib/currency';
import { getProductById, Product } from '../../lib/sampleProducts';
import { 
  findVariantByOptions, 
  getVariantPrice, 
  getVariantImage,
  isVariantAvailable,
  getVariantStock,
  generateVariantCombinations
} from '../../lib/variants';

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentImage, setCurrentImage] = useState('');
  const [currentVariant, setCurrentVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const { addToCart } = useCart();
  const { addRecentProduct } = useStorage();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundProduct = getProductById(productId);
        if (foundProduct) {
          setProduct(foundProduct);
          setCurrentPrice(foundProduct.basePrice);
          setCurrentImage(foundProduct.baseImages[0]);
          
          // Initialize selected options with first available option for each variant type
          const initialOptions: Record<string, string> = {};
          foundProduct.variantTypes.forEach(variantType => {
            const firstAvailableOption = variantType.options.find(opt => opt.available !== false);
            if (firstAvailableOption) {
              initialOptions[variantType.id] = firstAvailableOption.value;
            }
          });
          setSelectedOptions(initialOptions);
          
          addRecentProduct(foundProduct._id);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setMessage({
          text: 'Error loading product details',
          type: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, addRecentProduct]);

  const handleOptionChange = (typeId: string, value: string) => {
    const newOptions = { ...selectedOptions, [typeId]: value };
    setSelectedOptions(newOptions);
  };

  const handleVariantChange = (variant: any) => {
    setCurrentVariant(variant);
  };

  const handleImageChange = (image: string) => {
    setCurrentImage(image);
  };

  const handlePriceChange = (price: number) => {
    setCurrentPrice(price);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product || !currentVariant) return;

    const isAvailable = isVariantAvailable(selectedOptions, product.variants);
    if (!isAvailable) {
      setMessage({
        text: 'This variant is not available',
        type: 'error'
      });
      return;
    }

    const stock = getVariantStock(selectedOptions, product.variants);
    if (quantity > stock) {
      setMessage({
        text: `Only ${stock} items available in stock`,
        type: 'error'
      });
      return;
    }

    // Add to cart with variant information
    addToCart({
      id: product._id,
      name: product.title,
      price: currentPrice,
      image: currentImage,
      variantId: currentVariant?.id,
      variantOptions: selectedOptions,
      sku: currentVariant?.sku,
    });

    setMessage({
      text: `${product.title} added to cart!`,
      type: 'success'
    });
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    if (product) {
      setCurrentImage(product.baseImages[index]);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.loading}>Loading product...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.pageWrapper}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.error}>Product not found</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isAvailable = isVariantAvailable(selectedOptions, product.variants);
  const stock = getVariantStock(selectedOptions, product.variants);
  const maxQuantity = Math.min(stock, 99);

  return (
    <div className={styles.pageWrapper}>
      {message && (
        <Message
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <a href="/products">Products</a>
            <span> / </span>
            <a href={`/products?category=${product.category}`}>{product.category}</a>
            <span> / </span>
            <span>{product.title}</span>
          </div>

          <div className={styles.productLayout}>
            {/* Product Images */}
            <div className={styles.imageSection}>
              <div className={styles.mainImage}>
                <Image
                  src={currentImage}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  style={{
                    objectFit: 'contain'
                  }}
                />
              </div>
              
              {product.baseImages.length > 1 && (
                <div className={styles.imageThumbnails}>
                  {product.baseImages.map((image, index) => (
                    <button
                      key={index}
                      className={`${styles.thumbnail} ${
                        selectedImageIndex === index ? styles.active : ''
                      }`}
                      onClick={() => handleImageClick(index)}
                    >
                      <Image
                        src={image}
                        alt={`${product.title} - Image ${index + 1}`}
                        fill
                        sizes="80px"
                        style={{
                          objectFit: 'cover'
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className={styles.detailsSection}>
              <div className={styles.productHeader}>
                <h1 className={styles.productTitle}>{product.title}</h1>
                <div className={styles.productMeta}>
                  <span className={styles.vendor}>by {product.vendor}</span>
                  <span className={styles.category}>{product.category}</span>
                </div>
              </div>

              <div className={styles.priceSection}>
                <div className={styles.priceDisplay}>
                  <span className={styles.currentPrice}>{formatPrice(currentPrice)}</span>
                  {product.baseCompareAtPrice && product.baseCompareAtPrice > currentPrice && (
                    <span className={styles.comparePrice}>
                      {formatPrice(product.baseCompareAtPrice)}
                    </span>
                  )}
                </div>
                {product.baseCompareAtPrice && product.baseCompareAtPrice > currentPrice && (
                  <div className={styles.savings}>
                    Save {formatPrice(product.baseCompareAtPrice - currentPrice)}
                  </div>
                )}
              </div>

              <div className={styles.description}>
                <p>{product.description}</p>
              </div>

              {/* Variant Selector */}
              {product.variantTypes.length > 0 && (
                <div className={styles.variantSection}>
                  <VariantSelector
                    variantTypes={product.variantTypes}
                    variants={product.variants}
                    basePrice={product.basePrice}
                    baseImages={product.baseImages}
                    selectedOptions={selectedOptions}
                    onOptionChange={handleOptionChange}
                    onVariantChange={handleVariantChange}
                    onImageChange={handleImageChange}
                    onPriceChange={handlePriceChange}
                    showStock={true}
                  />
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className={styles.actionSection}>
                <div className={styles.quantitySelector}>
                  <label htmlFor="quantity">Quantity:</label>
                  <div className={styles.quantityControls}>
                    <button
                      className={styles.quantityBtn}
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      min="1"
                      max={maxQuantity}
                      className={styles.quantityInput}
                    />
                    <button
                      className={styles.quantityBtn}
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= maxQuantity}
                    >
                      +
                    </button>
                  </div>
                  {stock > 0 && (
                    <span className={styles.stockInfo}>
                      {stock} available
                    </span>
                  )}
                </div>

                <button
                  className={`${styles.addToCartBtn} ${
                    !isAvailable || stock === 0 ? styles.disabled : ''
                  }`}
                  onClick={handleAddToCart}
                  disabled={!isAvailable || stock === 0}
                >
                  {!isAvailable || stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>

              {/* Product Information */}
              <div className={styles.productInfo}>
                <div className={styles.infoItem}>
                  <strong>SKU:</strong> {currentVariant?.sku || 'N/A'}
                </div>
                {currentVariant?.weight && (
                  <div className={styles.infoItem}>
                    <strong>Weight:</strong> {currentVariant.weight} {currentVariant.weightUnit}
                  </div>
                )}
                {product.tags && product.tags.length > 0 && (
                  <div className={styles.tags}>
                    {product.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetailPage; 