// Shopify-like Variant System for Bike Yard

export interface VariantOption {
  id: string;
  name: string;
  value: string;
  priceModifier?: number; // Price adjustment for this option
  stock?: number; // Stock for this specific variant
  image?: string; // Specific image for this variant
  available?: boolean; // Whether this variant is available
}

export interface VariantType {
  id: string;
  name: string; // e.g., "Size", "Color", "Material"
  options: VariantOption[];
  required?: boolean; // Whether this variant type is required
  displayOrder?: number; // Order of display
}

export interface ProductVariant {
  id: string;
  sku?: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number; // Original price for sale items
  cost?: number; // Cost price for profit calculation
  weight?: number;
  weightUnit?: 'kg' | 'lb' | 'g' | 'oz';
  inventoryQuantity: number;
  inventoryPolicy?: 'deny' | 'continue'; // Whether to allow overselling
  inventoryManagement?: 'shopify' | 'manual'; // How inventory is managed
  optionValues: Record<string, string>; // Map of variant type ID to option value
  image?: string;
  available: boolean;
  taxable?: boolean;
  requiresShipping?: boolean;
  trackQuantity?: boolean;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  handle?: string; // URL-friendly version of title
  vendor?: string;
  productType?: string;
  tags?: string[];
  category: string;
  featured: boolean;
  status?: 'active' | 'draft' | 'archived';
  
  // Base product info
  basePrice: number;
  baseCompareAtPrice?: number;
  baseImages: string[];
  
  // Variant system
  variantTypes: VariantType[];
  variants: ProductVariant[];
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  
  // Additional fields
  weight?: number;
  weightUnit?: 'kg' | 'lb' | 'g' | 'oz';
  taxable?: boolean;
  requiresShipping?: boolean;
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

// Utility functions for variant management

export function generateVariantCombinations(variantTypes: VariantType[]): Record<string, string>[] {
  if (variantTypes.length === 0) return [{}];
  
  const combinations: Record<string, string>[] = [];
  
  function generateCombinations(
    currentCombination: Record<string, string>,
    typeIndex: number
  ) {
    if (typeIndex === variantTypes.length) {
      combinations.push({ ...currentCombination });
      return;
    }
    
    const currentType = variantTypes[typeIndex];
    for (const option of currentType.options) {
      if (option.available !== false) {
        generateCombinations(
          { ...currentCombination, [currentType.id]: option.value },
          typeIndex + 1
        );
      }
    }
  }
  
  generateCombinations({}, 0);
  return combinations;
}

export function findVariantByOptions(
  variants: ProductVariant[],
  optionValues: Record<string, string>
): ProductVariant | null {
  return variants.find(variant => {
    return Object.keys(optionValues).every(key => 
      variant.optionValues[key] === optionValues[key]
    );
  }) || null;
}

export function getVariantPrice(
  basePrice: number,
  optionValues: Record<string, string>,
  variantTypes: VariantType[]
): number {
  let finalPrice = basePrice;
  
  Object.entries(optionValues).forEach(([typeId, value]) => {
    const variantType = variantTypes.find(vt => vt.id === typeId);
    if (variantType) {
      const option = variantType.options.find(opt => opt.value === value);
      if (option?.priceModifier) {
        finalPrice += option.priceModifier;
      }
    }
  });
  
  return finalPrice;
}

export function getVariantImage(
  optionValues: Record<string, string>,
  variantTypes: VariantType[],
  baseImages: string[]
): string {
  // Check if any selected option has a specific image
  for (const [typeId, value] of Object.entries(optionValues)) {
    const variantType = variantTypes.find(vt => vt.id === typeId);
    if (variantType) {
      const option = variantType.options.find(opt => opt.value === value);
      if (option?.image) {
        return option.image;
      }
    }
  }
  
  // Return first base image if no variant-specific image found
  return baseImages[0] || '/images/placeholder.jpg';
}

export function isVariantAvailable(
  optionValues: Record<string, string>,
  variants: ProductVariant[]
): boolean {
  const variant = findVariantByOptions(variants, optionValues);
  return variant ? variant.available && variant.inventoryQuantity > 0 : false;
}

export function getVariantStock(
  optionValues: Record<string, string>,
  variants: ProductVariant[]
): number {
  const variant = findVariantByOptions(variants, optionValues);
  return variant ? variant.inventoryQuantity : 0;
}

// Sample variant types for bike products
export const BIKE_VARIANT_TYPES: VariantType[] = [
  {
    id: 'size',
    name: 'Size',
    required: true,
    displayOrder: 1,
    options: [
      { id: 'size-s', name: 'Small', value: 'S', available: true },
      { id: 'size-m', name: 'Medium', value: 'M', available: true },
      { id: 'size-l', name: 'Large', value: 'L', available: true },
      { id: 'size-xl', name: 'X-Large', value: 'XL', available: true },
    ]
  },
  {
    id: 'color',
    name: 'Color',
    required: true,
    displayOrder: 2,
    options: [
      { id: 'color-black', name: 'Black', value: 'Black', available: true },
      { id: 'color-red', name: 'Red', value: 'Red', available: true },
      { id: 'color-blue', name: 'Blue', value: 'Blue', available: true },
      { id: 'color-green', name: 'Green', value: 'Green', available: true },
    ]
  },
  {
    id: 'material',
    name: 'Frame Material',
    required: false,
    displayOrder: 3,
    options: [
      { id: 'material-aluminum', name: 'Aluminum', value: 'Aluminum', priceModifier: 0, available: true },
      { id: 'material-carbon', name: 'Carbon Fiber', value: 'Carbon Fiber', priceModifier: 500, available: true },
      { id: 'material-steel', name: 'Steel', value: 'Steel', priceModifier: -200, available: true },
    ]
  }
];

// Sample accessory variant types
export const ACCESSORY_VARIANT_TYPES: VariantType[] = [
  {
    id: 'size',
    name: 'Size',
    required: true,
    displayOrder: 1,
    options: [
      { id: 'size-s', name: 'Small', value: 'S', available: true },
      { id: 'size-m', name: 'Medium', value: 'M', available: true },
      { id: 'size-l', name: 'Large', value: 'L', available: true },
    ]
  },
  {
    id: 'color',
    name: 'Color',
    required: true,
    displayOrder: 2,
    options: [
      { id: 'color-black', name: 'Black', value: 'Black', available: true },
      { id: 'color-white', name: 'White', value: 'White', available: true },
      { id: 'color-red', name: 'Red', value: 'Red', available: true },
    ]
  }
]; 