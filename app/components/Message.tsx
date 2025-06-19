'use client';

import React, { useState } from 'react';
import styles from './Message.module.css';

interface MessageProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Message({ message, type, onClose, duration = 5000 }: MessageProps) {
  const [isClosing, setIsClosing] = useState(false);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match the animation duration
  };

  return (
    <div className={`${styles.message} ${styles[type]} ${isClosing ? styles.closing : ''}`}>
      <div className={styles.content}>
        {message}
      </div>
      <button 
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Close message"
      >
        ×
      </button>
    </div>
  );
} 