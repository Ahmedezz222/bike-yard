'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import Footer from '../components/Footer';
import ShippingModal from './components/ShippingModal';
import PaymentModal from './components/PaymentModal';
import type { ShippingData } from './components/ShippingModal';
import type { PaymentData } from './components/PaymentModal';
import { useCart } from '../lib/CartContext';
import { formatPrice } from '../lib/currency';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();
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

  const handleQuantityChange = useCallback((id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  }, [updateQuantity]);

  const handleRemoveItem = useCallback((id: string) => {
    removeFromCart(id);
  }, [removeFromCart]);

  const handleClearCart = useCallback(() => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  }, [clearCart]);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCheckout = useCallback(() => {
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }
    setIsShippingModalOpen(true);
    setError(null);
  }, [items]);

  const handleShippingSubmit = useCallback((data: ShippingData) => {
    setShippingData(data);
    setIsShippingModalOpen(false);
    setIsPaymentModalOpen(true);
  }, []);

  const handlePaymentSubmit = useCallback(async (paymentData: PaymentData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order object
      const order = {
        items: items.map(item => ({
          product: {
            _id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
          },
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: total,
        shippingData,
        paymentData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Simulate API call to create order
      console.log('Order created:', order);

      // Clear cart after successful order
      clearCart();

      // Redirect to order confirmation
      window.location.href = `/order-confirmation/${Date.now()}`;
    } catch (error) {
      console.error('Payment processing error:', error);
      setError('Payment processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [items, total, shippingData, clearCart]);

  const handleCloseShippingModal = useCallback(() => {
    setIsShippingModalOpen(false);
  }, []);

  const handleClosePaymentModal = useCallback(() => {
    setIsPaymentModalOpen(false);
  }, []);

  const handleCloseError = useCallback(() => {
    setError(null);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.loading}>Loading cart...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.pageWrapper}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.emptyCart}>
              <h1>Your Cart is Empty</h1>
              <p>Looks like you haven't added any items to your cart yet.</p>
              <Link href="/products" className={styles.continueShopping}>
                Continue Shopping
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
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Shopping Cart</h1>
          
          {error && (
            <div className={styles.error}>
              {error}
              <button onClick={handleCloseError} className={styles.closeError}>
                ×
              </button>
            </div>
          )}

          <div className={styles.cartContent}>
            <div className={styles.cartItems}>
              {items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={100}
                      height={100}
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <h3>{item.name}</h3>
                    <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                    <div className={styles.quantityControls}>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className={styles.quantityButton}
                        type="button"
                      >
                        -
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className={styles.quantityButton}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className={styles.removeButton}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                  <div className={styles.itemTotal}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.cartSummary}>
              <h2>Order Summary</h2>
              <div className={styles.summaryRow}>
                <span>Subtotal ({getTotalItems()} items)</span>
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
              <div className={styles.cartActions}>
                <button
                  onClick={handleCheckout}
                  className={styles.checkoutButton}
                  disabled={isSubmitting}
                  type="button"
                >
                  {isSubmitting ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                <button
                  onClick={handleClearCart}
                  className={styles.clearButton}
                  type="button"
                >
                  Clear Cart
                </button>
                <Link href="/products" className={styles.continueShopping}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ShippingModal
        isOpen={isShippingModalOpen}
        onClose={handleCloseShippingModal}
        onSubmit={handleShippingSubmit}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        onSubmit={handlePaymentSubmit}
        totalAmount={total}
        isSubmitting={isSubmitting}
      />

      <Footer />
    </div>
  );
}
