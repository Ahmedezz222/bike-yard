'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from '../page.module.css';
import { useCart } from '../lib/CartContext';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const pathname = usePathname();
  const { items } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Calculate total items in cart
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.querySelector(`.${styles.nav}`);
      const menuToggle = document.querySelector(`.${styles.menuToggle}`);
      if (isMenuOpen && nav && !nav.contains(event.target as Node) && menuToggle && !menuToggle.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    // Prevent body scroll when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/img/Menu.pdf', label: 'Cafe Menu' },
  ];

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        {!imgError ? (
          <Image 
            src="/bike-yard-logo.png" 
            alt="Bike Yard Logo" 
            width={150}
            height={45}
            priority
            className={styles.logoImage}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.logoText}>Bike Yard</div>
        )}
      </Link>

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

      <div 
        className={`${styles.menuOverlay} ${isMenuOpen ? styles.active : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />

      <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link 
              href="/cart" 
              className={`${styles.cartLink} ${pathname === '/cart' ? styles.active : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="fas fa-shopping-cart" aria-hidden="true"></i>
              <span>Cart</span>
              {totalItems > 0 && (
                <span className={styles.cartCount}>{totalItems}</span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
} 