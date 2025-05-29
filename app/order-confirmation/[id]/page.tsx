'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { formatPrice } from '@/app/lib/currency';

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

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (isLoading) {
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
                          width={100}
                          height={100}
                          style={{
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                      <div className={styles.itemDetails}>
                        <h3>{item.product.name}</h3>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: {formatPrice(item.price)}</p>
                        <p>Subtotal: {formatPrice(item.price * item.quantity)}</p>
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
                onClick={() => window.print()} 
                className={styles.printButton}
              >
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