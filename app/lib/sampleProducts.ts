import { Product, ProductVariant, BIKE_VARIANT_TYPES, ACCESSORY_VARIANT_TYPES } from './variants';

// Generate variants for a product based on variant types
function generateProductVariants(
  productId: string,
  variantTypes: any[],
  basePrice: number,
  baseStock: number = 10
): ProductVariant[] {
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
  
  return combinations.map((optionValues, index) => {
    // Calculate price based on option modifiers
    let price = basePrice;
    Object.entries(optionValues).forEach(([typeId, value]) => {
      const variantType = variantTypes.find(vt => vt.id === typeId);
      if (variantType) {
        const option = variantType.options.find(opt => opt.value === value);
        if (option?.priceModifier) {
          price += option.priceModifier;
        }
      }
    });
    
    // Generate SKU
    const sku = `${productId}-${Object.values(optionValues).join('-')}`.toUpperCase();
    
    // Vary stock levels for different variants
    const stockVariation = Math.floor(Math.random() * 5) - 2; // -2 to +2
    const inventoryQuantity = Math.max(0, baseStock + stockVariation);
    
    return {
      id: `${productId}-variant-${index + 1}`,
      sku,
      price,
      compareAtPrice: Math.random() > 0.7 ? price * 1.2 : undefined, // 30% chance of having a compare price
      inventoryQuantity,
      inventoryPolicy: 'deny',
      inventoryManagement: 'manual',
      optionValues,
      available: inventoryQuantity > 0,
      taxable: true,
      requiresShipping: true,
      trackQuantity: true,
      weight: 15 + Math.random() * 5, // 15-20 kg for bikes
      weightUnit: 'kg' as const,
    };
  });
}

// Sample products with variants
export const sampleProducts: Product[] = [
  {
    _id: 'mountain-bike-pro',
    title: 'Mountain Bike Pro',
    description: 'Professional mountain bike with advanced suspension system, perfect for challenging trails and off-road adventures. Features premium components and durable construction.',
    handle: 'mountain-bike-pro',
    vendor: 'Bike Yard',
    productType: 'Mountain Bike',
    tags: ['mountain', 'professional', 'suspension', 'trail'],
    category: 'Mountain Bikes',
    featured: true,
    status: 'active',
    basePrice: 1299.99,
    baseCompareAtPrice: 1599.99,
    baseImages: [
      '/products/Mountain_Bike.png',
      '/img/bike-yard-img.jpg',
      '/img/Bike-Yard-Hero-Background.jpg'
    ],
    variantTypes: BIKE_VARIANT_TYPES,
    variants: generateProductVariants('mountain-bike-pro', BIKE_VARIANT_TYPES, 1299.99, 8),
    seoTitle: 'Professional Mountain Bike - Advanced Suspension System',
    seoDescription: 'Premium mountain bike with advanced suspension for challenging trails. Available in multiple sizes and colors.',
    weight: 17.5,
    weightUnit: 'kg',
    taxable: true,
    requiresShipping: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    _id: 'road-bike-elite',
    title: 'Road Bike Elite',
    description: 'Lightweight road bike perfect for racing and long-distance rides. Aerodynamic design with premium components for maximum speed and efficiency.',
    handle: 'road-bike-elite',
    vendor: 'Bike Yard',
    productType: 'Road Bike',
    tags: ['road', 'racing', 'lightweight', 'aero'],
    category: 'Road Bikes',
    featured: false,
    status: 'active',
    basePrice: 899.99,
    baseCompareAtPrice: 1099.99,
    baseImages: [
      '/products/Road_Bike.png',
      '/img/bike-yard-img.jpg',
      '/img/Bike-Yard-Hero-Background.jpg'
    ],
    variantTypes: BIKE_VARIANT_TYPES,
    variants: generateProductVariants('road-bike-elite', BIKE_VARIANT_TYPES, 899.99, 5),
    seoTitle: 'Elite Road Bike - Lightweight Racing Machine',
    seoDescription: 'High-performance road bike designed for speed and efficiency. Perfect for racing and long-distance cycling.',
    weight: 8.2,
    weightUnit: 'kg',
    taxable: true,
    requiresShipping: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    _id: 'electric-bike-city',
    title: 'Electric Bike City',
    description: 'Modern electric bike with extended battery life for urban commuting. Features smart connectivity and eco-friendly design for sustainable transportation.',
    handle: 'electric-bike-city',
    vendor: 'Bike Yard',
    productType: 'Electric Bike',
    tags: ['electric', 'city', 'commuting', 'eco-friendly'],
    category: 'Electric Bikes',
    featured: true,
    status: 'active',
    basePrice: 2499.99,
    baseCompareAtPrice: 2999.99,
    baseImages: [
      '/img/bike-yard-img.jpg',
      '/img/Bike-Yard-Hero-Background.jpg',
      '/img/Bike-Yard-Hero-Background_m.jpg'
    ],
    variantTypes: BIKE_VARIANT_TYPES,
    variants: generateProductVariants('electric-bike-city', BIKE_VARIANT_TYPES, 2499.99, 3),
    seoTitle: 'City Electric Bike - Smart Urban Transportation',
    seoDescription: 'Advanced electric bike for city commuting with extended battery life and smart features.',
    weight: 25.0,
    weightUnit: 'kg',
    taxable: true,
    requiresShipping: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    _id: 'bike-helmet-safety',
    title: 'Bike Helmet Safety',
    description: 'High-quality safety helmet with advanced protection features. Meets all safety standards and provides excellent comfort for long rides.',
    handle: 'bike-helmet-safety',
    vendor: 'Bike Yard',
    productType: 'Helmet',
    tags: ['helmet', 'safety', 'protection', 'comfort'],
    category: 'Accessories',
    featured: false,
    status: 'active',
    basePrice: 89.99,
    baseCompareAtPrice: 119.99,
    baseImages: [
      '/products/Accessories.png',
      '/img/bike-yard-img.jpg',
      '/img/Bike-Yard-Hero-Background.jpg'
    ],
    variantTypes: ACCESSORY_VARIANT_TYPES,
    variants: generateProductVariants('bike-helmet-safety', ACCESSORY_VARIANT_TYPES, 89.99, 15),
    seoTitle: 'Safety Bike Helmet - Advanced Protection',
    seoDescription: 'Premium safety helmet with advanced protection features and superior comfort.',
    weight: 0.4,
    weightUnit: 'kg',
    taxable: true,
    requiresShipping: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    _id: 'premium-bike-chain',
    title: 'Premium Bike Chain',
    description: 'Durable bike chain designed for smooth gear transitions and long-lasting performance. Compatible with most modern bike systems.',
    handle: 'premium-bike-chain',
    vendor: 'Bike Yard',
    productType: 'Chain',
    tags: ['chain', 'durable', 'smooth', 'compatible'],
    category: 'Parts',
    featured: false,
    status: 'active',
    basePrice: 45.99,
    baseCompareAtPrice: 59.99,
    baseImages: [
      '/products/Accessories.png',
      '/img/bike-yard-img.jpg',
      '/img/Bike-Yard-Hero-Background.jpg'
    ],
    variantTypes: [
      {
        id: 'length',
        name: 'Chain Length',
        required: true,
        displayOrder: 1,
        options: [
          { id: 'length-114', name: '114 Links', value: '114', available: true },
          { id: 'length-116', name: '116 Links', value: '116', available: true },
          { id: 'length-118', name: '118 Links', value: '118', available: true },
        ]
      },
      {
        id: 'color',
        name: 'Color',
        required: true,
        displayOrder: 2,
        options: [
          { id: 'color-silver', name: 'Silver', value: 'Silver', available: true },
          { id: 'color-black', name: 'Black', value: 'Black', available: true },
          { id: 'color-gold', name: 'Gold', value: 'Gold', priceModifier: 10, available: true },
        ]
      }
    ],
    variants: generateProductVariants('premium-bike-chain', [
      {
        id: 'length',
        name: 'Chain Length',
        required: true,
        displayOrder: 1,
        options: [
          { id: 'length-114', name: '114 Links', value: '114', available: true },
          { id: 'length-116', name: '116 Links', value: '116', available: true },
          { id: 'length-118', name: '118 Links', value: '118', available: true },
        ]
      },
      {
        id: 'color',
        name: 'Color',
        required: true,
        displayOrder: 2,
        options: [
          { id: 'color-silver', name: 'Silver', value: 'Silver', available: true },
          { id: 'color-black', name: 'Black', value: 'Black', available: true },
          { id: 'color-gold', name: 'Gold', value: 'Gold', priceModifier: 10, available: true },
        ]
      }
    ], 45.99, 25),
    seoTitle: 'Premium Bike Chain - Smooth Performance',
    seoDescription: 'High-quality bike chain for smooth gear transitions and long-lasting performance.',
    weight: 0.3,
    weightUnit: 'kg',
    taxable: true,
    requiresShipping: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  }
];

// Helper function to get product by ID
export function getProductById(id: string): Product | undefined {
  return sampleProducts.find(product => product._id === id);
}

// Helper function to get products by category
export function getProductsByCategory(category: string): Product[] {
  return sampleProducts.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
}

// Helper function to get featured products
export function getFeaturedProducts(): Product[] {
  return sampleProducts.filter(product => product.featured);
}

// Helper function to search products
export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return sampleProducts.filter(product =>
    product.title.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  );
} 