'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ShippingModal from './components/ShippingModal';
import type { ShippingData } from './components/ShippingModal';

// Mock cart data - this would typically come from a cart context or state management
const initialCartItems = [
  {
    id: 1,
    title: 'Mountain Bike',
    price: 899.99,
    quantity: 1,
    image: {
      src: '/products/Mountain_Bike.png',
      alt: 'Mountain Bike',
      width: 200,
      height: 120
    }
  },
  {
    id: 2,
    title: 'Bike Helmet',
    price: 49.99,
    quantity: 2,
    image: {
      src: '/products/Accessories.png',
      alt: 'Bike Helmet',
      width: 200,
      height: 120
    }
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isLoading, setIsLoading] = useState(true);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);

  useEffect(() => {
    // Simulate loading cart data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    setIsShippingModalOpen(true);
  };

  const handleShippingSubmit = (shippingData: ShippingData) => {
    // Here you would typically:
    // 1. Save the shipping data
    // 2. Process the order
    // 3. Redirect to payment or confirmation page
    console.log('Shipping data:', shippingData);
    setIsShippingModalOpen(false);
    // TODO: Implement actual checkout flow
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
          
          {cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>Your cart is empty</p>
              <Link href="/products" className={styles.continueShopping}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className={styles.cartContent}>
              <div className={styles.cartItems}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={item.image.width}
                        height={item.image.height}
                      />
                    </div>
                    <div className={styles.itemDetails}>
                      <h3>{item.title}</h3>
                      <p className={styles.price}>${item.price.toFixed(2)}</p>
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className={styles.quantityButton}
                        >
                          -
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={styles.quantityButton}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className={styles.itemTotal}>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeItem(item.id)}
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
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.total}`}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
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

      <Footer />
    </div>
  );
}
