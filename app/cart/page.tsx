'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ShippingModal from './components/ShippingModal';
import PaymentModal from './components/PaymentModal';
import type { ShippingData } from './components/ShippingModal';
import type { PaymentData } from './components/PaymentModal';
import { useCart } from '../lib/CartContext';
import { formatPrice } from '../lib/currency';
import { updateJsonBin } from '../lib/jsonbin';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simulate loading cart data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    setIsShippingModalOpen(true);
  };

  const handleShippingSubmit = (data: ShippingData) => {
    setShippingData(data);
    setIsShippingModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (paymentData: PaymentData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Create order data
      const orderData = {
        customerName: shippingData?.fullName || '',
        customerEmail: shippingData?.email || '',
        items: items.map(item => ({
          product: {
            _id: item.id,
            name: item.name,
            price: item.price,
            image: item.image
          },
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        status: 'pending',
        shippingAddress: {
          street: shippingData?.address || '',
          city: shippingData?.city || '',
          state: shippingData?.state || '',
          zipCode: '', // Not collected in shipping form
          country: 'US' // Default to US since not collected
        }
      };

      // Send order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const order = await response.json();

      // Clear cart and close modal
      setIsPaymentModalOpen(false);
      clearCart(); // Clear the cart after successful order
      
      // Redirect to order confirmation page
      window.location.href = `/order-confirmation/${order._id}`;
    } catch (error) {
      console.error('Payment processing error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <Navigation />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.loading}>Loading cart...</div>
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
          <h1 className={styles.title}>Shopping Cart</h1>
          
          {error && (
            <div className={styles.error}>
              <p>{error}</p>
              <button onClick={() => setError(null)} className={styles.closeError}>
                ×
              </button>
            </div>
          )}
          
          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>Your cart is empty</p>
              <Link href="/products" className={styles.continueShopping}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className={styles.cartContent}>
              <div className={styles.cartItems}>
                {items.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={150}
                        height={150}
                        style={{
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/bike-yard-logo.png';
                          target.alt = 'Product image not available';
                          target.onerror = null;
                        }}
                      />
                    </div>
                    <div className={styles.itemDetails}>
                      <h3>{item.name}</h3>
                      <p className={styles.price}>{formatPrice(item.price)}</p>
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className={styles.quantityButton}
                        >
                          -
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className={styles.quantityButton}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className={styles.itemTotal}>
                      <p>{formatPrice(item.price * item.quantity)}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={styles.removeButton}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.orderSummary}>
                <h2>Order Summary</h2>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Tax (10%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.total}`}>
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className={styles.checkoutButton}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <ShippingModal
        isOpen={isShippingModalOpen}
        onClose={() => setIsShippingModalOpen(false)}
        onSubmit={handleShippingSubmit}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setError(null);
        }}
        onSubmit={handlePaymentSubmit}
        totalAmount={total}
        isSubmitting={isSubmitting}
      />

      <Footer />
    </div>
  );
}
