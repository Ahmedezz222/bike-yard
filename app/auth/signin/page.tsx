'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './signin.module.css';
import Image from 'next/image';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'Invalid email or password');
        return;
      }
      // Store token in localStorage for future requests
      localStorage.setItem('authToken', data.data.token);
      // Optionally store user info
      localStorage.setItem('user', JSON.stringify(data.data.user));
      router.push('/');
      router.refresh();
    } catch (error) {
      setError('An error occurred during sign in');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Sign In</h1>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <span className={styles.link} style={{ fontSize: '0.95rem' }} onClick={() => router.push('/auth/forgot-password')}>
              Forgot password?
            </span>
          </div>
          <button type="submit" className={styles.button}>
            Sign In
          </button>
        </form>
        <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>
          <div style={{ marginBottom: '0.5rem', color: '#888' }}>or sign in with</div>
          <button className={`${styles.socialButton} ${styles.google}`} onClick={() => alert('Google sign-in not implemented yet')}>
            <i className="fab fa-google" aria-hidden="true"></i> Google
          </button>
          <button className={`${styles.socialButton} ${styles.facebook}`} onClick={() => alert('Facebook sign-in not implemented yet')}>
            <i className="fab fa-facebook-f" aria-hidden="true"></i> Facebook
          </button>
        </div>
        <p className={styles.signupLink}>
          Don't have an account?{' '}
          <span onClick={() => router.push('/auth/signup')} className={styles.link}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
