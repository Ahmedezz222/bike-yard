'use client';

import { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import styles from './contact.module.css';

interface OrderDetails {
  orderNumber: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  shippingAddress: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [orderNumber, setOrderNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'found' | 'not_found'>('idle');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderStatus('loading');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (orderNumber.trim()) {
        setOrderStatus('found');
        setOrderDetails({
          orderNumber: orderNumber,
          status: 'processing',
          estimatedDelivery: '2024-03-25',
          shippingAddress: '123 Main St, City, State 12345',
          items: [
            { name: 'Mountain Bike', quantity: 1, price: 999.99 },
            { name: 'Bike Helmet', quantity: 1, price: 49.99 }
          ],
          totalAmount: 1049.98
        });
      } else {
        setOrderStatus('not_found');
        setOrderDetails(null);
      }
    } catch {
      setOrderStatus('not_found');
      setOrderDetails(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusColor = (status: OrderDetails['status']) => {
    switch (status) {
      case 'processing':
        return 'text-yellow-600';
      case 'shipped':
        return 'text-blue-600';
      case 'delivered':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <>
      <Navigation />
      <main className={styles.mainContainer}>
        <div className={styles.container}>
          {/* Order Tracker Section */}
          <div className={styles.orderTracker}>
            <h2 className={styles.sectionTitle}>Track Your Order</h2>
            <form onSubmit={handleTrackOrder} className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Order ID</label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter Order ID"
                  className={styles.input}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={orderStatus === 'loading'}
                className={styles.submitButton}
              >
                {orderStatus === 'loading' ? 'Tracking...' : 'Track Order'}
              </button>
            </form>

            {orderStatus === 'found' && orderDetails && (
              <div className={styles.orderStatus}>
                <h3 className={styles.orderStatusTitle}>Order Status</h3>
                <p className={styles.orderInfo}>Order ID: <strong>#{orderDetails.orderNumber}</strong></p>
                <p className={styles.orderInfo}>Status: <span className={`${styles.statusText} ${getStatusColor(orderDetails.status)}`}>
                  {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                </span></p>
                <p className={styles.orderInfo}>Estimated Delivery: <strong>{new Date(orderDetails.estimatedDelivery).toLocaleDateString()}</strong></p>
                <div className={styles.orderItems}>
                  <h4 className={styles.orderItemsTitle}>Order Items</h4>
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className={styles.orderItem}>
                      <span>{item.name} x{item.quantity}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className={styles.orderTotal}>
                    <span>Total</span>
                    <span>${orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {orderStatus === 'not_found' && (
              <div className={styles.error}>
                Order not found. Please check your order number and try again.
              </div>
            )}
          </div>

          {/* Contact Us Section */}
          <div className={styles.contactForm}>
            <h2 className={styles.sectionTitle}>Contact Us</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  className={styles.textarea}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className={styles.submitButton}
              >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <div className={styles.success}>
                  Thank you for your message! We&apos;ll get back to you soon.
                </div>
              )}

              {status === 'error' && (
                <div className={styles.error}>
                  Sorry, there was an error sending your message. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 