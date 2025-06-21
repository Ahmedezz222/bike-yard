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
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred during sign in');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
          <Image src="/bike-yard-logo.png" alt="Bike Yard Logo" width={80} height={80} />
        </div>
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
          <button className={styles.socialButton} style={{ background: '#fff', color: '#333', border: '1px solid #ddd', marginBottom: '0.5rem' }} onClick={() => alert('Google sign-in not implemented yet')}>Google</button>
          <button className={styles.socialButton} style={{ background: '#1877f3', color: '#fff', border: 'none' }} onClick={() => alert('Facebook sign-in not implemented yet')}>Facebook</button>
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
