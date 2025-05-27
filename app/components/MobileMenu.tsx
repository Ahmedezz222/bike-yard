'use client';

import { useState } from 'react';
import styles from '../page.module.css';

export default function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button 
        className={styles.menuToggle} 
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
        {/* Navigation content will be rendered here */}
      </nav>
    </>
  );
} 