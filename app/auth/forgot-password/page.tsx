"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../signin/signin.module.css";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setSubmitted(true);
    // Here you would trigger your backend password reset logic
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Forgot Password</h1>
        {submitted ? (
          <div style={{ color: "var(--primary)", background: "#e0f2fe", padding: "1rem", borderRadius: 12, marginBottom: "1rem", textAlign: "center" }}>
            If an account with that email exists, a password reset link has been sent.
          </div>
        ) : (
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
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" className={styles.button}>
              Send Reset Link
            </button>
          </form>
        )}
        
        {/* Navigation links */}
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <p style={{ marginBottom: "0.5rem", color: "#888" }}>
            Remember your password?{' '}
            <span onClick={() => router.push('/auth/signin')} className={styles.link}>
              Sign in
            </span>
          </p>
          <p style={{ color: "#888" }}>
            Don't have an account?{' '}
            <span onClick={() => router.push('/auth/signup')} className={styles.link}>
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
} 