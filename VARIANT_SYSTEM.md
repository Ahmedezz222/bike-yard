# Shopify-like Variant System for Bike Yard

This document describes the comprehensive variant system implemented for the Bike Yard e-commerce platform, inspired by Shopify's powerful product variant management.

## Features

### 🎯 Core Variant System
- **Multiple Variant Types**: Support for size, color, material, and custom variant types
- **Dynamic Pricing**: Price modifiers for different variant options
- **Stock Management**: Individual stock tracking per variant combination
- **SKU Generation**: Automatic SKU generation for each variant
- **Image Support**: Variant-specific images and base product images

### 🛍️ Shopping Experience
- **Interactive Selection**: Real-time variant selection with visual feedback
- **Dynamic Updates**: Price, image, and stock updates as variants are selected
- **Availability Checking**: Real-time availability validation
- **Cart Integration**: Variant-aware cart system

### 📱 User Interface
- **Modern Design**: Clean, responsive interface with hover effects
- **Color Variants**: Visual color swatches for color options
- **Stock Indicators**: Clear stock level displays
- **Price Modifiers**: Visual price adjustments for premium options

## Architecture

### Core Files

#### `app/lib/variants.ts`
Contains the core variant system interfaces and utility functions:

- `VariantOption`: Individual option within a variant type
- `VariantType`: Group of related options (e.g., Size, Color)
- `ProductVariant`: Complete variant with all properties
- `Product`: Enhanced product interface with variant support

#### `app/components/VariantSelector.tsx`
Interactive component for selecting product variants with:
- Real-time price updates
- Stock availability checking
- Image switching
- Visual feedback

#### `app/lib/sampleProducts.ts`
Sample product data demonstrating the variant system with:
- Multiple product categories
- Different variant type combinations
- Realistic pricing and stock levels

### Variant Types

#### Bike Products
```typescript
const BIKE_VARIANT_TYPES = [
  {
    id: 'size',
    name: 'Size',
    options: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'color',
    name: 'Color', 
    options: ['Black', 'Red', 'Blue', 'Green']
  },
  {
    id: 'material',
    name: 'Frame Material',
    options: [
      { value: 'Aluminum', priceModifier: 0 },
      { value: 'Carbon Fiber', priceModifier: 500 },
      { value: 'Steel', priceModifier: -200 }
    ]
  }
]
```

#### Accessory Products
```typescript
const ACCESSORY_VARIANT_TYPES = [
  {
    id: 'size',
    name: 'Size',
    options: ['S', 'M', 'L']
  },
  {
    id: 'color',
    name: 'Color',
    options: ['Black', 'White', 'Red']
  }
]
```

## Usage Examples

### Creating a Product with Variants

```typescript
const product: Product = {
  _id: 'mountain-bike-pro',
  title: 'Mountain Bike Pro',
  description: 'Professional mountain bike...',
  category: 'Mountain Bikes',
  basePrice: 1299.99,
  baseImages: ['/images/bike-1.jpg', '/images/bike-2.jpg'],
  variantTypes: BIKE_VARIANT_TYPES,
  variants: generateProductVariants('mountain-bike-pro', BIKE_VARIANT_TYPES, 1299.99, 8)
}
```

### Using the Variant Selector

```tsx
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
```

### Cart Integration

```typescript
// Add variant to cart
addToCart({
  id: product._id,
  name: product.title,
  price: currentPrice,
  image: currentImage,
  variantId: currentVariant?.id,
  variantOptions: selectedOptions,
  sku: currentVariant?.sku,
});
```

## Key Features

### 1. Dynamic Pricing
- Base price + option price modifiers
- Real-time price updates as variants are selected
- Support for compare-at prices and sales

### 2. Stock Management
- Individual stock tracking per variant combination
- Real-time availability checking
- Stock level indicators (In Stock, Low Stock, Out of Stock)

### 3. Image Management
- Base product images
- Variant-specific images
- Dynamic image switching based on selection

### 4. SKU Generation
- Automatic SKU generation: `{productId}-{option1}-{option2}`
- Example: `MOUNTAIN-BIKE-PRO-M-BLACK-ALUMINUM`

### 5. Cart Integration
- Variant-aware cart items
- Proper duplicate detection based on variant options
- SKU and variant information preservation

## Utility Functions

### `generateVariantCombinations(variantTypes)`
Generates all possible variant combinations from variant types.

### `findVariantByOptions(variants, optionValues)`
Finds a specific variant based on selected options.

### `getVariantPrice(basePrice, optionValues, variantTypes)`
Calculates the final price including option modifiers.

### `isVariantAvailable(optionValues, variants)`
Checks if a variant combination is available.

### `getVariantStock(optionValues, variants)`
Gets the stock level for a specific variant.

## Styling

The variant system includes comprehensive CSS styling with:

- **Responsive Design**: Works on all screen sizes
- **Color Variants**: Visual color swatches
- **Hover Effects**: Interactive feedback
- **Loading States**: Smooth transitions
- **Accessibility**: Proper focus states and ARIA labels

## Future Enhancements

1. **Bulk Operations**: Add/remove variants in bulk
2. **Import/Export**: CSV import/export for variant data
3. **Advanced Pricing**: Tiered pricing, bulk discounts
4. **Inventory Alerts**: Low stock notifications
5. **Variant Analytics**: Track popular variant combinations

## Testing

The system includes sample data for testing:
- Mountain Bike Pro (Size, Color, Material)
- Road Bike Elite (Size, Color, Material)
- Electric Bike City (Size, Color, Material)
- Bike Helmet Safety (Size, Color)
- Premium Bike Chain (Length, Color)

Visit `/products` to see the product listing and click on any product to experience the variant selection system. 