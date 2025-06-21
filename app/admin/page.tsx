'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './admin.module.css';
import { formatPrice } from '../lib/currency';
import { fetchFromJsonBin, updateJsonBin } from '../lib/jsonbin';

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

interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  carrier?: string;
  statusHistory?: {
    status: string;
    date: string;
    location: string;
    notes: string;
  }[];
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    images: [''],
    category: 'Mountain Bikes',
    stock: 0,
    featured: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
    featured: 'all',
  });

  const [orderFilters, setOrderFilters] = useState({
    status: 'all',
    dateRange: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const filterProducts = useCallback(() => {
    let filtered = [...products];

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply featured filter
    if (filters.featured !== 'all') {
      filtered = filtered.filter(product => 
        product.featured === (filters.featured === 'true')
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy as keyof Product];
      const bValue = b[filters.sortBy as keyof Product];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filters.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return filters.sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    setFilteredProducts(filtered);
  }, [products, filters]);

  const filterOrders = useCallback(() => {
    let filtered = [...orders];

    // Apply status filter
    if (orderFilters.status !== 'all') {
      filtered = filtered.filter(order => order.status === orderFilters.status);
    }

    // Apply date range filter
    const now = new Date();
    if (orderFilters.dateRange !== 'all') {
      const days = parseInt(orderFilters.dateRange);
      const cutoffDate = new Date(now.setDate(now.getDate() - days));
      filtered = filtered.filter(order => new Date(order.createdAt) >= cutoffDate);
    }

    // Apply search filter
    if (orderFilters.search) {
      const searchLower = orderFilters.search.toLowerCase();
      filtered = filtered.filter(order =>
        order.customerName.toLowerCase().includes(searchLower) ||
        order.customerEmail.toLowerCase().includes(searchLower) ||
        order._id.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[orderFilters.sortBy as keyof Order];
      const bValue = b[orderFilters.sortBy as keyof Order];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return orderFilters.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return orderFilters.sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    setFilteredOrders(filtered);
  }, [orders, orderFilters]);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchFromJsonBin('products');
      setProducts(data);
      setFilteredProducts(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchFromJsonBin('orders');
      setOrders(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  useEffect(() => {
    filterProducts();
    filterOrders();
  }, [products, filters, orders, orderFilters, filterProducts, filterOrders]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowAddProductModal(true);
    setSuccess(null);
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        setIsLoading(true);
        const products = await fetchFromJsonBin('products');
        const newProducts = products.filter((p: any) => p._id !== id);
        await updateJsonBin('products', newProducts);
        setSuccess('Product deleted successfully');
        await fetchProducts();
        setError(null);
      } catch (error) {
        console.error('Error deleting product:', error);
        setError(error instanceof Error ? error.message : 'Failed to delete product. Please try again.');
        setSuccess(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const products = await fetchFromJsonBin('products');
      let newProducts;
      let newProductData = editingProduct || newProduct;
      if (newProductData.image && !newProductData.images) {
        newProductData.images = [newProductData.image];
      }
      if (newProductData.images) {
        newProductData.images = newProductData.images.filter(img => img.trim() !== '');
      }
      if (editingProduct) {
        // Update
        newProducts = products.map((p: any) => p._id === editingProduct._id ? { ...newProductData, updatedAt: new Date().toISOString() } : p);
        setSuccess('Product updated successfully');
      } else {
        // Create
        newProducts = [...products, { ...newProductData, _id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
        setSuccess('Product created successfully');
      }
      await updateJsonBin('products', newProducts);
      setEditingProduct(null);
      setNewProduct({
        name: '',
        price: 0,
        description: '',
        images: [''],
        category: 'Mountain Bikes',
        stock: 0,
        featured: false,
      });
      await fetchProducts();
      setError(null);
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product. Please try again.');
      setSuccess(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      setIsLoading(true);
      const orders = await fetchFromJsonBin('orders');
      const order = orders.find((o: any) => o._id === orderId);
      if (!order) return;
      let trackingNumber = order.trackingNumber;
      let carrier = order.carrier;
      let location = '';
      let notes = '';
      if (newStatus === 'shipped' && (!trackingNumber || !carrier)) {
        trackingNumber = prompt('Enter tracking number:') || '';
        carrier = prompt('Enter carrier name:') || '';
        location = prompt('Enter current location:') || '';
        notes = prompt('Enter any additional notes:') || '';
      }
      const newOrders = orders.map((o: any) => o._id === orderId ? {
        ...order,
        status: newStatus,
        trackingNumber,
        carrier,
        statusHistory: [
          ...(order.statusHistory || []),
          {
            status: newStatus,
            date: new Date().toISOString(),
            location,
            notes
          }
        ],
        updatedAt: new Date().toISOString(),
      } : o);
      await updateJsonBin('orders', newOrders);
      await fetchOrders();
      setSuccess('Order status updated successfully');
      setError(null);
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status. Please try again.');
      setSuccess(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        setIsLoading(true);
        const orders = await fetchFromJsonBin('orders');
        const newOrders = orders.filter((o: any) => o._id !== orderId);
        await updateJsonBin('orders', newOrders);
        await fetchOrders();
        setSuccess('Order deleted successfully');
        setError(null);
      } catch (error) {
        console.error('Error deleting order:', error);
        setError('Failed to delete order. Please try again.');
        setSuccess(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const handleAddProduct = () => {
    setShowAddProductModal(true);
    setNewProduct({
      name: '',
      price: 0,
      description: '',
      images: [''],
      category: 'Mountain Bikes',
      stock: 0,
      featured: false,
    });
  };

  const handleCloseModal = () => {
    setShowAddProductModal(false);
    setEditingProduct(null);
  };

  return (
    <div className={styles.adminContainer}>
      <h1>Admin Dashboard</h1>

      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'products' ? styles.active : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'orders' ? styles.active : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.success}>
          {success}
        </div>
      )}

      {activeTab === 'products' ? (
        <>
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.filterGroup}>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className={styles.filterSelect}
              >
                <option value="all">All Categories</option>
                <option value="Mountain Bikes">Mountain Bikes</option>
                <option value="Road Bikes">Road Bikes</option>
                <option value="Electric Bikes">Electric Bikes</option>
                <option value="Kids Bikes">Kids Bikes</option>
                <option value="Accessories">Accessories</option>
                <option value="Parts">Parts</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <select
                value={filters.featured}
                onChange={(e) => setFilters({ ...filters, featured: e.target.value })}
                className={styles.filterSelect}
              >
                <option value="all">All Products</option>
                <option value="true">Featured Only</option>
                <option value="false">Non-Featured</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className={styles.filterSelect}
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
                <option value="createdAt">Sort by Date</option>
              </select>
              <button
                onClick={() => setFilters({
                  ...filters,
                  sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
                })}
                className={styles.sortButton}
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
            <button onClick={handleAddProduct} className={styles.tabButton}>
              Add New Product
            </button>
          </div>

          {showAddProductModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                  <button onClick={handleCloseModal} className={styles.closeButton}>
                    ×
                  </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.productForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Product Name</label>
                    <input
                      type="text"
                      id="name"
                      value={editingProduct ? editingProduct.name : newProduct.name}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({ ...editingProduct, name: e.target.value })
                        : setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="price">Price (EGP)</label>
                    <input
                      type="number"
                      id="price"
                      value={editingProduct ? editingProduct.price : newProduct.price}
                      onChange={(e) => editingProduct
                        ? setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                        : setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      value={editingProduct ? editingProduct.description : newProduct.description}
                      onChange={(e) => editingProduct
                        ? setEditingProduct({ ...editingProduct, description: e.target.value })
                        : setNewProduct({ ...newProduct, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Images</label>
                    {editingProduct ? (
                      (editingProduct.images || []).map((image, index) => (
                        <div key={index} className={styles.imageInputGroup}>
                          <input
                            type="url"
                            value={image}
                            onChange={(e) => {
                              const newImages = [...(editingProduct.images || [])];
                              newImages[index] = e.target.value;
                              setEditingProduct({ ...editingProduct, images: newImages });
                            }}
                            placeholder="https://example.com/image.jpg"
                            pattern="https?://.*\.(jpg|jpeg|png|gif|webp)"
                            title="Please enter a valid image URL (jpg, jpeg, png, gif, or webp)"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = (editingProduct.images || []).filter((_, i) => i !== index);
                              setEditingProduct({ ...editingProduct, images: newImages });
                            }}
                            className={styles.removeImageButton}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      newProduct.images?.map((image, index) => (
                        <div key={index} className={styles.imageInputGroup}>
                          <input
                            type="url"
                            value={image}
                            onChange={(e) => {
                              const newImages = [...(newProduct.images || [''])];
                              newImages[index] = e.target.value;
                              setNewProduct({ ...newProduct, images: newImages });
                            }}
                            placeholder="https://example.com/image.jpg"
                            pattern="https?://.*\.(jpg|jpeg|png|gif|webp)"
                            title="Please enter a valid image URL (jpg, jpeg, png, gif, or webp)"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = (newProduct.images || ['']).filter((_, i) => i !== index);
                              setNewProduct({ ...newProduct, images: newImages });
                            }}
                            className={styles.removeImageButton}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (editingProduct) {
                          setEditingProduct({
                            ...editingProduct,
                            images: [...(editingProduct.images || []), '']
                          });
                        } else {
                          setNewProduct({
                            ...newProduct,
                            images: [...(newProduct.images || ['']), '']
                          });
                        }
                      }}
                      className={styles.addImageButton}
                    >
                      Add Another Image
                    </button>
                    {(editingProduct?.images || newProduct.images) && (
                      <div className={styles.imagePreviewGrid}>
                        {(editingProduct ? editingProduct.images : newProduct.images)?.map((image, index) => (
                          image && (
                            <div key={index} className={styles.imagePreview}>
                              <Image
                                src={image}
                                alt={`Preview ${index + 1}`}
                                width={150}
                                height={150}
                                style={{
                                  objectFit: 'cover'
                                }}
                              />
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      value={editingProduct ? editingProduct.category : newProduct.category}
                      onChange={(e) => editingProduct
                        ? setEditingProduct({ ...editingProduct, category: e.target.value })
                        : setNewProduct({ ...newProduct, category: e.target.value })}
                      required
                    >
                      <option value="Mountain Bikes">Mountain Bikes</option>
                      <option value="Road Bikes">Road Bikes</option>
                      <option value="Electric Bikes">Electric Bikes</option>
                      <option value="Kids Bikes">Kids Bikes</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Parts">Parts</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="stock">Stock</label>
                    <input
                      type="number"
                      id="stock"
                      value={editingProduct ? editingProduct.stock : newProduct.stock}
                      onChange={(e) => editingProduct
                        ? setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                        : setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      required
                      min="0"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={editingProduct ? editingProduct.featured : newProduct.featured}
                        onChange={(e) => editingProduct
                          ? setEditingProduct({ ...editingProduct, featured: e.target.checked })
                          : setNewProduct({ ...newProduct, featured: e.target.checked })}
                      />
                      Featured Product
                    </label>
                  </div>
                  <div className={styles.buttonGroup}>
                    <button type="submit" disabled={isLoading}>
                      {isLoading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    <button type="button" onClick={handleCloseModal}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className={styles.productList}>
            <h2>Current Products</h2>
            {isLoading ? (
              <div className={styles.loading}>Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className={styles.emptyState}>No products found. Add your first product above!</div>
            ) : (
              <div className={styles.productGrid}>
                {filteredProducts.map((product) => (
                  <div key={product._id} className={styles.productCard}>
                    <div className={styles.productImage}>
                      <Image
                        src={product.images?.[0] || product.image || '/bike-yard-logo.png'}
                        alt={product.name}
                        width={150}
                        height={150}
                        style={{
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    {product.featured && (
                      <div className={styles.productFeatured}>Featured</div>
                    )}
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <span className={styles.productCategory}>{product.category}</span>
                      <div className={styles.productPrice}>{formatPrice(product.price)}</div>
                      <div className={styles.productStock}>
                        <div className={`${styles.stockIndicator} ${
                          product.stock === 0 ? styles.out : 
                          product.stock < 5 ? styles.low : ''
                        }`} />
                        {product.stock === 0 ? 'Out of Stock' : 
                         product.stock < 5 ? 'Low Stock' : 'In Stock'} ({product.stock})
                      </div>
                      <div className={styles.productActions}>
                        <button 
                          onClick={() => handleEdit(product)} 
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)} 
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className={styles.ordersSection}>
          <div className={styles.filters}>
            <select
              value={orderFilters.status}
              onChange={(e) => setOrderFilters({ ...orderFilters, status: e.target.value })}
              className={styles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={orderFilters.dateRange}
              onChange={(e) => setOrderFilters({ ...orderFilters, dateRange: e.target.value })}
              className={styles.filterSelect}
            >
              <option value="all">All Time</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>

            <select
              value={orderFilters.sortBy}
              onChange={(e) => setOrderFilters({ ...orderFilters, sortBy: e.target.value })}
              className={styles.filterSelect}
            >
              <option value="createdAt">Date</option>
              <option value="totalAmount">Amount</option>
              <option value="customerName">Customer Name</option>
              <option value="status">Status</option>
            </select>

            <select
              value={orderFilters.sortOrder}
              onChange={(e) => setOrderFilters({ ...orderFilters, sortOrder: e.target.value })}
              className={styles.filterSelect}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>

            <input
              type="text"
              placeholder="Search orders..."
              value={orderFilters.search}
              onChange={(e) => setOrderFilters({ ...orderFilters, search: e.target.value })}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.ordersList}>
            {filteredOrders.map((order) => (
              <div key={order._id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <span className={`${styles.status} ${styles[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className={styles.orderDetails}>
                  <p><strong>Customer:</strong> {order.customerName}</p>
                  <p><strong>Email:</strong> {order.customerEmail}</p>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><strong>Total:</strong> {formatPrice(order.totalAmount)}</p>
                  <p><strong>Items:</strong> {order.items.length}</p>
                </div>
                <div className={styles.orderActions}>
                  <button 
                    onClick={() => handleViewDetails(order)}
                    className={styles.viewDetailsButton}
                  >
                    View Details
                  </button>
                  <select
                    value={order.status}
                    onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value as Order['status'])}
                    className={styles.statusSelect}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button 
                    onClick={() => handleDeleteOrder(order._id)}
                    className={styles.deleteButton}
                    disabled={isLoading}
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showOrderDetails && selectedOrder && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h2>Order Details #{selectedOrder._id.slice(-6)}</h2>
                  <button onClick={closeOrderDetails} className={styles.closeButton}>×</button>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.detailsSection}>
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                    <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                  </div>

                  <div className={styles.detailsSection}>
                    <h3>Shipping Address</h3>
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>

                  <div className={styles.detailsSection}>
                    <h3>Order Information</h3>
                    <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                    <p><strong>Status:</strong> <span className={`${styles.status} ${styles[selectedOrder.status]}`}>{selectedOrder.status}</span></p>
                    <p><strong>Total Amount:</strong> {formatPrice(selectedOrder.totalAmount)}</p>
                  </div>

                  <div className={styles.detailsSection}>
                    <h3>Order Items</h3>
                    <div className={styles.orderItemsList}>
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className={styles.detailedItem}>
                          <Image
                            src={
                              (item.product.images && item.product.images.length > 0)
                                ? item.product.images[0]
                                : (item.product.image || '/bike-yard-logo.png')
                            }
                            alt={item.product.name}
                            width={100}
                            height={100}
                            style={{
                              objectFit: 'cover'
                            }}
                          />
                          <div className={styles.detailedItemInfo}>
                            <h4>{item.product.name}</h4>
                            <p><strong>Category:</strong> {item.product.category}</p>
                            <p><strong>Quantity:</strong> {item.quantity}</p>
                            <p><strong>Price per item:</strong> {formatPrice(item.price)}</p>
                            <p><strong>Subtotal:</strong> {formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button onClick={closeOrderDetails} className={styles.closeModalButton}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 