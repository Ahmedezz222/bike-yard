'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './Message.module.css';

interface MessageProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Message({ message, type, onClose, duration = 5000 }: MessageProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    const timer = setTimeout(() => {
      onClose();
    }, 300); // Match the animation duration

    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  const handleCloseClick = useCallback(() => {
    handleClose();
  }, [handleClose]);

  return (
    <div className={`${styles.message} ${styles[type]} ${isClosing ? styles.closing : ''}`}>
      <div className={styles.content}>
        {message}
      </div>
      <button 
        className={styles.closeButton}
        onClick={handleCloseClick}
        aria-label="Close message"
        type="button"
      >
        ×
      </button>
    </div>
  );
} 