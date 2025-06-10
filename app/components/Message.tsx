import React from 'react';
import styles from './Message.module.css';

interface MessageProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Message: React.FC<MessageProps> = ({ message, type, onClose }) => {
  return (
    <div className={`${styles.message} ${styles[type]}`}>
      <p>{message}</p>
      <button onClick={onClose} className={styles.closeButton}>
        ×
      </button>
    </div>
  );
};

export default Message; 