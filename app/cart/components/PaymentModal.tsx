'use client';

import { useState, useEffect } from 'react';
import styles from './PaymentModal.module.css';
import stripePromise from '../../lib/stripe';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentData: PaymentData) => void;
  totalAmount: number;
  isSubmitting?: boolean;
}

export interface PaymentData {
  method: 'credit' | 'debit' | 'cash' | 'mobile';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  mobileNumber?: string;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

function PaymentForm({ onSubmit, totalAmount, isSubmitting }: { onSubmit: (data: PaymentData) => void, totalAmount: number, isSubmitting?: boolean }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState<PaymentData['method']>('credit');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        return;
      }

      const { error: stripeError, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message || 'An error occurred while processing your payment.');
        return;
      }

      onSubmit({
        method: paymentMethod,
        cardNumber: '**** **** **** ****', // We don't store the actual card number
        expiryDate: '**/**',
        cvv: '***'
      });
    } else if (paymentMethod === 'mobile') {
      if (!mobileNumber) {
        setError('Please enter your mobile number');
        return;
      }
      onSubmit({
        method: 'mobile',
        mobileNumber
      });
    } else {
      onSubmit({
        method: 'cash'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.paymentMethods}>
        <button
          type="button"
          className={`${styles.methodButton} ${paymentMethod === 'credit' ? styles.active : ''}`}
          onClick={() => setPaymentMethod('credit')}
        >
          Credit Card
        </button>
        <button
          type="button"
          className={`${styles.methodButton} ${paymentMethod === 'debit' ? styles.active : ''}`}
          onClick={() => setPaymentMethod('debit')}
        >
          Debit Card
        </button>
        <button
          type="button"
          className={`${styles.methodButton} ${paymentMethod === 'mobile' ? styles.active : ''}`}
          onClick={() => setPaymentMethod('mobile')}
        >
          Mobile Payment
        </button>
        <button
          type="button"
          className={`${styles.methodButton} ${paymentMethod === 'cash' ? styles.active : ''}`}
          onClick={() => setPaymentMethod('cash')}
        >
          Cash on Delivery
        </button>
      </div>

      {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
        <div className={styles.formGroup}>
          <label>Card Details</label>
          <div className={styles.cardElement}>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
      )}

      {paymentMethod === 'mobile' && (
        <div className={styles.formGroup}>
          <label htmlFor="mobileNumber">Mobile Number *</label>
          <input
            type="tel"
            id="mobileNumber"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="+20 123 456 7890"
            className={error ? styles.error : ''}
          />
        </div>
      )}

      {paymentMethod === 'cash' && (
        <div className={styles.cashInfo}>
          <p>You will pay in cash when your order is delivered.</p>
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelButton} onClick={() => window.history.back()} disabled={isSubmitting}>
          Back
        </button>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting || !stripe}>
          {isSubmitting ? 'Processing...' : 'Complete Payment'}
        </button>
      </div>
    </form>
  );
}

export default function PaymentModal({ isOpen, onClose, onSubmit, totalAmount, isSubmitting }: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Payment Information</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close payment form"
          >
            ×
          </button>
        </div>

        <div className={styles.totalAmount}>
          <span>Total Amount:</span>
          <span className={styles.amount}>EGP {totalAmount.toFixed(2)}</span>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm onSubmit={onSubmit} totalAmount={totalAmount} isSubmitting={isSubmitting} />
        </Elements>
      </div>
    </div>
  );
} 