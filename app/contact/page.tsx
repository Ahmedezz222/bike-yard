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
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
        <div className={styles.container}>
          {/* Order Tracker Section */}
          <div className={styles.orderTracker}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Track Your Order</h2>
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
                <h3 className="font-bold mb-2 text-gray-800">Order Status</h3>
                <p className="text-gray-700">Order ID: <strong>#{orderDetails.orderNumber}</strong></p>
                <p className="text-gray-700">Status: <span className={`${getStatusColor(orderDetails.status)} font-medium`}>
                  {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                </span></p>
                <p className="text-gray-700">Estimated Delivery: <strong>{new Date(orderDetails.estimatedDelivery).toLocaleDateString()}</strong></p>
                <div className={styles.orderItems}>
                  <h4 className="font-semibold mb-2 text-gray-800">Order Items</h4>
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm text-gray-700">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
                    <span className="text-gray-800">Total</span>
                    <span className="text-gray-800">${orderDetails.totalAmount.toFixed(2)}</span>
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
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Us</h2>
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