'use client';

import { useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './signin.module.css';
import Image from 'next/image';
import { API_BASE_URL } from '../../lib/api';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
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
      console.error('Sign in error:', error);
      setError('An error occurred during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, router]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  }, [error]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
  }, [error]);

  const handleForgotPassword = useCallback(() => {
    router.push('/auth/forgot-password');
  }, [router]);

  const handleSignUp = useCallback(() => {
    router.push('/auth/signup');
  }, [router]);

  const handleGoogleSignIn = useCallback(() => {
    alert('Google sign-in not implemented yet');
  }, []);

  const handleFacebookSignIn = useCallback(() => {
    alert('Facebook sign-in not implemented yet');
  }, []);

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
              onChange={handleEmailChange}
              disabled={isLoading}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoading}
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <span className={styles.link} style={{ fontSize: '0.95rem' }} onClick={handleForgotPassword}>
              Forgot password?
            </span>
          </div>
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>
          <div style={{ marginBottom: '0.5rem', color: '#888' }}>or sign in with</div>
          <button 
            type="button"
            className={`${styles.socialButton} ${styles.google}`} 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <i className="fab fa-google" aria-hidden="true"></i> Google
          </button>
          <button 
            type="button"
            className={`${styles.socialButton} ${styles.facebook}`} 
            onClick={handleFacebookSignIn}
            disabled={isLoading}
          >
            <i className="fab fa-facebook-f" aria-hidden="true"></i> Facebook
          </button>
        </div>
        <p className={styles.signupLink}>
          Don't have an account?{' '}
          <span onClick={handleSignUp} className={styles.link}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
