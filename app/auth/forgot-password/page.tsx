"use client";

import { useState } from "react";
import styles from "../signin/signin.module.css";

export default function ForgotPassword() {
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
      </div>
    </div>
  );
} 