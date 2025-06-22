'use client';

import { useState } from 'react';
import Footer from '../components/Footer';
import styles from './contact.module.css';

interface OrderDetails {
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  shippingAddress: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  orderDate: string;
  paymentMethod: string;
  trackingNumber?: string;
  carrier?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  statusHistory: {
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    location?: string;
  }[];
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
      console.log('Attempting to track order:', orderNumber);
      const transformedOrder: OrderDetails = {
        orderNumber: orderNumber,
        status: 'pending',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        shippingAddress: 'Address not available',
        items: [],
        totalAmount: 0,
        orderDate: new Date().toISOString(),
        paymentMethod: 'Not specified',
        trackingNumber: '',
        carrier: '',
        customerInfo: {
          name: 'Not specified',
          email: 'Not specified',
          phone: 'Not specified'
        },
        statusHistory: [
          { date: new Date().toISOString(), status: 'pending' }
        ]
      };
      setOrderDetails(transformedOrder);
      setOrderStatus('found');
    } catch (error) {
      console.error('Error tracking order:', error);
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
      case 'pending':
        return 'text-yellow-600';
      case 'processing':
        return 'text-blue-600';
      case 'shipped':
        return 'text-green-600';
      case 'delivered':
        return 'text-green-700';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <>
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
                <p className={styles.instruction}>Please enter the order ID without the # symbol</p>
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
                <div className={styles.orderInfoGrid}>
                  <div className={styles.orderInfoSection}>
                    <h4 className={styles.sectionSubtitle}>Order Information</h4>
                    <p className={styles.orderInfo}>Order ID: <strong>{orderDetails.orderNumber}</strong></p>
                    <p className={styles.orderInfo}>Order Date: <strong>{new Date(orderDetails.orderDate).toLocaleDateString()}</strong></p>
                    <p className={styles.orderInfo}>Status: <span className={`${styles.statusText} ${getStatusColor(orderDetails.status)}`}>
                      {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                    </span></p>
                    <p className={styles.orderInfo}>Payment Method: <strong>{orderDetails.paymentMethod}</strong></p>
                  </div>

                  <div className={styles.orderInfoSection}>
                    <h4 className={styles.sectionSubtitle}>Shipping Information</h4>
                    <p className={styles.orderInfo}>Estimated Delivery: <strong>{new Date(orderDetails.estimatedDelivery).toLocaleDateString()}</strong></p>
                    <p className={styles.orderInfo}>Shipping Address: <strong>{orderDetails.shippingAddress}</strong></p>
                    {orderDetails.trackingNumber && (
                      <p className={styles.orderInfo}>Tracking Number: <strong>{orderDetails.trackingNumber}</strong></p>
                    )}
                    {orderDetails.carrier && (
                      <p className={styles.orderInfo}>Carrier: <strong>{orderDetails.carrier}</strong></p>
                    )}
                  </div>

                  <div className={styles.orderInfoSection}>
                    <h4 className={styles.sectionSubtitle}>Customer Information</h4>
                    <p className={styles.orderInfo}>Name: <strong>{orderDetails.customerInfo.name}</strong></p>
                    <p className={styles.orderInfo}>Email: <strong>{orderDetails.customerInfo.email}</strong></p>
                    <p className={styles.orderInfo}>Phone: <strong>{orderDetails.customerInfo.phone}</strong></p>
                  </div>
                </div>

                <div className={styles.statusTimeline}>
                  <h4 className={styles.sectionSubtitle}>Order Timeline</h4>
                  <div className={styles.timelineContainer}>
                    {orderDetails.statusHistory.map((status, index) => (
                      <div key={index} className={styles.timelineItem}>
                        <div className={styles.timelineDate}>
                          {new Date(status.date).toLocaleDateString()}
                        </div>
                        <div className={styles.timelineContent}>
                          <span className={`${styles.statusText} ${getStatusColor(status.status)}`}>
                            {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                          </span>
                          {status.location && <p className={styles.timelineLocation}>{status.location}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

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