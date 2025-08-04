'use client';

import React, { useState, useEffect } from 'react';
import styles from './VariantSelector.module.css';
import { 
  VariantType, 
  VariantOption, 
  ProductVariant,
  findVariantByOptions,
  getVariantPrice,
  getVariantImage,
  isVariantAvailable,
  getVariantStock
} from '../lib/variants';

interface VariantSelectorProps {
  variantTypes: VariantType[];
  variants: ProductVariant[];
  basePrice: number;
  baseImages: string[];
  selectedOptions: Record<string, string>;
  onOptionChange: (typeId: string, value: string) => void;
  onVariantChange?: (variant: ProductVariant | null) => void;
  onImageChange?: (image: string) => void;
  onPriceChange?: (price: number) => void;
  showStock?: boolean;
  disabled?: boolean;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  variantTypes,
  variants,
  basePrice,
  baseImages,
  selectedOptions,
  onOptionChange,
  onVariantChange,
  onImageChange,
  onPriceChange,
  showStock = true,
  disabled = false
}) => {
  const [currentVariant, setCurrentVariant] = useState<ProductVariant | null>(null);

  // Sort variant types by display order
  const sortedVariantTypes = [...variantTypes].sort((a, b) => 
    (a.displayOrder || 0) - (b.displayOrder || 0)
  );

  // Update current variant when options change
  useEffect(() => {
    const variant = findVariantByOptions(variants, selectedOptions);
    setCurrentVariant(variant);
    
    if (onVariantChange) {
      onVariantChange(variant);
    }
  }, [selectedOptions, variants, onVariantChange]);

  // Update price when variant changes
  useEffect(() => {
    const price = getVariantPrice(basePrice, selectedOptions, variantTypes);
    if (onPriceChange) {
      onPriceChange(price);
    }
  }, [selectedOptions, basePrice, variantTypes, onPriceChange]);

  // Update image when variant changes
  useEffect(() => {
    const image = getVariantImage(selectedOptions, variantTypes, baseImages);
    if (onImageChange) {
      onImageChange(image);
    }
  }, [selectedOptions, variantTypes, baseImages, onImageChange]);

  const handleOptionClick = (typeId: string, value: string) => {
    if (disabled) return;
    onOptionChange(typeId, value);
  };

  const isOptionAvailable = (typeId: string, value: string): boolean => {
    const testOptions = { ...selectedOptions, [typeId]: value };
    return isVariantAvailable(testOptions, variants);
  };

  const getOptionStock = (typeId: string, value: string): number => {
    const testOptions = { ...selectedOptions, [typeId]: value };
    return getVariantStock(testOptions, variants);
  };

  const getPriceModifier = (typeId: string, value: string): number => {
    const variantType = variantTypes.find(vt => vt.id === typeId);
    if (!variantType) return 0;
    
    const option = variantType.options.find(opt => opt.value === value);
    return option?.priceModifier || 0;
  };

  if (variantTypes.length === 0) {
    return null;
  }

  return (
    <div className={styles.variantSelector}>
      {sortedVariantTypes.map((variantType) => (
        <div key={variantType.id} className={styles.variantGroup}>
          <div className={styles.variantHeader}>
            <label className={styles.variantLabel}>
              {variantType.name}
              {variantType.required && <span className={styles.required}>*</span>}
            </label>
            {currentVariant && selectedOptions[variantType.id] && (
              <span className={styles.selectedValue}>
                {variantType.options.find(opt => opt.value === selectedOptions[variantType.id])?.name}
              </span>
            )}
          </div>
          
          <div className={styles.optionsContainer}>
            {variantType.options.map((option) => {
              const isSelected = selectedOptions[variantType.id] === option.value;
              const isAvailable = isOptionAvailable(variantType.id, option.value);
              const stock = getOptionStock(variantType.id, option.value);
              const priceModifier = getPriceModifier(variantType.id, option.value);
              
              return (
                <button
                  key={option.id}
                  className={`${styles.optionButton} ${
                    isSelected ? styles.selected : ''
                  } ${
                    !isAvailable ? styles.unavailable : ''
                  } ${
                    disabled ? styles.disabled : ''
                  }`}
                  onClick={() => handleOptionClick(variantType.id, option.value)}
                  disabled={!isAvailable || disabled}
                  title={option.name}
                >
                  <span className={styles.optionName}>{option.name}</span>
                  
                  {priceModifier !== 0 && (
                    <span className={`${styles.priceModifier} ${
                      priceModifier > 0 ? styles.positive : styles.negative
                    }`}>
                      {priceModifier > 0 ? '+' : ''}{priceModifier > 0 ? '+' : ''}${Math.abs(priceModifier).toFixed(2)}
                    </span>
                  )}
                  
                  {showStock && stock !== undefined && (
                    <span className={`${styles.stockIndicator} ${
                      stock === 0 ? styles.outOfStock : 
                      stock < 5 ? styles.lowStock : styles.inStock
                    }`}>
                      {stock === 0 ? 'Out of Stock' : 
                       stock < 5 ? `Only ${stock} left` : 
                       stock < 20 ? `${stock} in stock` : 'In Stock'}
                    </span>
                  )}
                  
                  {!isAvailable && (
                    <span className={styles.unavailableText}>Unavailable</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      
      {currentVariant && (
        <div className={styles.variantInfo}>
          <div className={styles.variantDetails}>
            <span className={styles.sku}>
              SKU: {currentVariant.sku || 'N/A'}
            </span>
            {currentVariant.weight && (
              <span className={styles.weight}>
                Weight: {currentVariant.weight} {currentVariant.weightUnit || 'kg'}
              </span>
            )}
          </div>
          
          {currentVariant.compareAtPrice && currentVariant.compareAtPrice > currentVariant.price && (
            <div className={styles.priceComparison}>
              <span className={styles.compareAtPrice}>
                ${currentVariant.compareAtPrice.toFixed(2)}
              </span>
              <span className={styles.savings}>
                Save ${(currentVariant.compareAtPrice - currentVariant.price).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VariantSelector; 