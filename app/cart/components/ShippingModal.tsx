'use client';

import { useState } from 'react';
import styles from './ShippingModal.module.css';

interface ShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (shippingData: ShippingData) => void;
}

export interface ShippingData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  phone: string;
}

export default function ShippingModal({ isOpen, onClose, onSubmit }: ShippingModalProps) {
  const [formData, setFormData] = useState<ShippingData>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Partial<ShippingData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof ShippingData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<ShippingData> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
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
          <h2>Shipping Information</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close shipping form"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? styles.error : ''}
              placeholder="John Doe"
            />
            {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.error : ''}
              placeholder="john@example.com"
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? styles.error : ''}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? styles.error : ''}
              placeholder="123 Main St"
            />
            {errors.address && <span className={styles.errorText}>{errors.address}</span>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={errors.city ? styles.error : ''}
                placeholder="New York"
              />
              {errors.city && <span className={styles.errorText}>{errors.city}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="state">State/Province *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={errors.state ? styles.error : ''}
                placeholder="NY"
              />
              {errors.state && <span className={styles.errorText}>{errors.state}</span>}
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 