'use client';

import { useState } from 'react';
import styles from './PaymentModal.module.css';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentData: PaymentData) => void;
  totalAmount: number;
}

export interface PaymentData {
  method: 'credit' | 'debit' | 'cash' | 'mobile';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  mobileNumber?: string;
}

export default function PaymentModal({ isOpen, onClose, onSubmit, totalAmount }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentData['method']>('credit');
  const [formData, setFormData] = useState<PaymentData>({
    method: 'credit',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    mobileNumber: ''
  });

  const [errors, setErrors] = useState<Partial<PaymentData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof PaymentData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleMethodChange = (method: PaymentData['method']) => {
    setPaymentMethod(method);
    setFormData(prev => ({
      ...prev,
      method
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<PaymentData> = {};
    
    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }
      
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
      }
      
      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Invalid CVV';
      }
    } else if (paymentMethod === 'mobile') {
      if (!formData.mobileNumber) {
        newErrors.mobileNumber = 'Mobile number is required';
      } else if (!/^\+?[\d\s-]{10,}$/.test(formData.mobileNumber)) {
        newErrors.mobileNumber = 'Invalid mobile number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

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

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.paymentMethods}>
            <button
              type="button"
              className={`${styles.methodButton} ${paymentMethod === 'credit' ? styles.active : ''}`}
              onClick={() => handleMethodChange('credit')}
            >
              Credit Card
            </button>
            <button
              type="button"
              className={`${styles.methodButton} ${paymentMethod === 'debit' ? styles.active : ''}`}
              onClick={() => handleMethodChange('debit')}
            >
              Debit Card
            </button>
            <button
              type="button"
              className={`${styles.methodButton} ${paymentMethod === 'mobile' ? styles.active : ''}`}
              onClick={() => handleMethodChange('mobile')}
            >
              Mobile Payment
            </button>
            <button
              type="button"
              className={`${styles.methodButton} ${paymentMethod === 'cash' ? styles.active : ''}`}
              onClick={() => handleMethodChange('cash')}
            >
              Cash on Delivery
            </button>
          </div>

          {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="cardNumber">Card Number *</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className={errors.cardNumber ? styles.error : ''}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                {errors.cardNumber && <span className={styles.errorText}>{errors.cardNumber}</span>}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="expiryDate">Expiry Date *</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className={errors.expiryDate ? styles.error : ''}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {errors.expiryDate && <span className={styles.errorText}>{errors.expiryDate}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="cvv">CVV *</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    className={errors.cvv ? styles.error : ''}
                    placeholder="123"
                    maxLength={4}
                  />
                  {errors.cvv && <span className={styles.errorText}>{errors.cvv}</span>}
                </div>
              </div>
            </>
          )}

          {paymentMethod === 'mobile' && (
            <div className={styles.formGroup}>
              <label htmlFor="mobileNumber">Mobile Number *</label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className={errors.mobileNumber ? styles.error : ''}
                placeholder="+20 123 456 7890"
              />
              {errors.mobileNumber && <span className={styles.errorText}>{errors.mobileNumber}</span>}
            </div>
          )}

          {paymentMethod === 'cash' && (
            <div className={styles.cashInfo}>
              <p>You will pay in cash when your order is delivered.</p>
            </div>
          )}

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Back
            </button>
            <button type="submit" className={styles.submitButton}>
              Complete Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 