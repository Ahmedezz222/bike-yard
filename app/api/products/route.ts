import { NextResponse } from 'next/server';
import { fetchFromJsonBin, updateJsonBin } from '@/app/lib/jsonbin';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image?: string;  // For backward compatibility
  images?: string[];  // New field for multiple images
  category: string;
  stock: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// GET all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const products = await fetchFromJsonBin('products') as Product[];

    // Apply filters
    let filteredProducts = [...products];

    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    if (featured && featured !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.featured === (featured === 'true'));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort by creation date (newest first)
    filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST new product
export async function POST(request: Request) {
  try {
    const productData = await request.json();
    const products = await fetchFromJsonBin('products') as Product[];

    // Generate a unique ID
    const newId = Date.now().toString();
    
    // Handle image data
    let images: string[] = [];
    if (productData.images) {
      images = productData.images.filter((img: string) => img.trim() !== '');
    } else if (productData.image) {
      images = [productData.image];
    }

    const newProduct: Product = {
      ...productData,
      _id: newId,
      images,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.push(newProduct);
    await updateJsonBin('products', products);

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(request: Request) {
  try {
    const updatedProduct = await request.json();
    const products = await fetchFromJsonBin('products') as Product[];

    const index = products.findIndex((p: Product) => p._id === updatedProduct._id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Handle image data
    let images: string[] = [];
    if (updatedProduct.images) {
      images = updatedProduct.images.filter((img: string) => img.trim() !== '');
    } else if (updatedProduct.image) {
      images = [updatedProduct.image];
    }

    products[index] = {
      ...updatedProduct,
      images,
      updatedAt: new Date().toISOString(),
    };

    await updateJsonBin('products', products);
    return NextResponse.json(products[index]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const products = await fetchFromJsonBin('products') as Product[];
    const filteredProducts = products.filter((p: Product) => p._id !== id);

    if (filteredProducts.length === products.length) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    await updateJsonBin('products', filteredProducts);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 