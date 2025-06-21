'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { formatPrice } from '@/app/lib/currency';
import { fetchFromJsonBin } from '../../lib/jsonbin';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
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
  trackingNumber?: string;
  carrier?: string;
  statusHistory: {
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    date: string
    location?: string;
    notes?: string;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError('No order ID provided');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching order with ID:', id);
        const orders = await fetchFromJsonBin('orders');
        const order = orders.find((o: any) => o._id === id);
        if (!order) {
          throw new Error('Order not found. Please check the order ID and try again.');
        }
        setOrder(order);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError(error instanceof Error ? error.message : 'Failed to load order details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (isLoading) {
    console.log('Loading state active');
    return (
      <div className={styles.pageWrapper}>
        <Navigation />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.loading}>Loading order details...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    console.log('Error state:', error);
    console.log('Order state:', order);
    return (
      <div className={styles.pageWrapper}>
        <Navigation />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.error}>
              <h2>Error</h2>
              <p>{error || 'Order not found'}</p>
              <Link href="/" className={styles.continueShopping}>
                Return to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  console.log('Rendering order with data:', {
    id: order._id,
    status: order.status,
    statusHistory: order.statusHistory,
    items: order.items,
    totalAmount: order.totalAmount
  });

  return (
    <div className={styles.pageWrapper}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.confirmation}>
            <div className={styles.header}>
              <h1>Order Confirmation</h1>
              <p className={styles.orderNumber}>Order #{order._id.slice(-6)}</p>
            </div>

            <div className={styles.status}>
              <h2>Order Status</h2>
              <p className={`${styles.statusBadge} ${styles[order.status]}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </p>
              {order.trackingNumber && (
                <div className={styles.trackingInfo}>
                  <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
                  {order.carrier && <p><strong>Carrier:</strong> {order.carrier}</p>}
                </div>
              )}
            </div>

            <div className={styles.sections}>
              <section className={styles.section}>
                <h2>Customer Information</h2>
                <p><strong>Name:</strong> {order.customerName}</p>
                <p><strong>Email:</strong> {order.customerEmail}</p>
              </section>

              <section className={styles.section}>
                <h2>Shipping Address</h2>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </section>

              <section className={styles.section}>
                <h2>Order Details</h2>
                <div className={styles.items}>
                  {order.items.map((item, index) => (
                    <div key={index} className={styles.item}>
                      <div className={styles.itemImage}>
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={120}
                          height={120}
                          style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%'
                          }}
                        />
                      </div>
                      <div className={styles.itemDetails}>
                        <h3>{item.product.name}</h3>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p><strong>Price:</strong> {formatPrice(item.price)}</p>
                        <p><strong>Subtotal:</strong> {formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.total}>
                  <h3>Total Amount</h3>
                  <p>{formatPrice(order.totalAmount)}</p>
                </div>
              </section>
            </div>

            <div className={styles.actions}>
              <button 
                onClick={handlePrint} 
                className={styles.printButton}
                aria-label="Print Order"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                Print Order
              </button>
              <Link href="/" className={styles.continueShopping}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 