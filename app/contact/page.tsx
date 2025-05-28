'use client';

import { useState } from 'react';
import styles from './contact.module.css';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // TODO: Implement actual form submission logic
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navigation />
      <main className={styles.container}>
        <h1 className={styles.title}>Contact Us</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Your name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="your.email@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject" className={styles.label}>Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="What is this regarding?"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={styles.textarea}
              required
              placeholder="Your message here..."
            />
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'success' && (
            <div className={`${styles.status} ${styles.success}`}>
              Thank you for your message! We'll get back to you soon.
            </div>
          )}

          {status === 'error' && (
            <div className={`${styles.status} ${styles.error}`}>
              Sorry, there was an error sending your message. Please try again.
            </div>
          )}
        </form>
      </main>
      <Footer />
    </>
  );
} 