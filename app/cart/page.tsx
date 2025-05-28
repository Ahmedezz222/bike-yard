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

export default function CartPage() {
  const { items, removeFromCart, updateQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);

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
      // Here you would typically:
      // 1. Process the payment
      // 2. Create the order
      // 3. Clear the cart
      // 4. Redirect to confirmation page
      console.log('Payment data:', paymentData);
      console.log('Shipping data:', shippingData);
      setIsPaymentModalOpen(false);
      // TODO: Implement actual payment processing and order creation
    } catch (error) {
      console.error('Payment processing error:', error);
      // TODO: Show error message to user
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
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handlePaymentSubmit}
        totalAmount={total}
      />

      <Footer />
    </div>
  );
}
