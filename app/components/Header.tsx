"use client";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/img/bike-yard-logo.png"
            alt="Bike Yard Logo"
            width={150}
            height={50}
            priority
            className={styles.logoImage}
          />
        </Link>
        <div className={styles.userSection}>
          {session ? (
            <div className={styles.userMenu}>
              <button
                className={styles.userButton}
                onClick={() => setDropdownOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <span className={styles.avatar}>
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </span>
                <span className={styles.userName}>{session.user?.name || session.user?.email}</span>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ marginLeft: 6 }}><path d="M6 8l4 4 4-4" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link href="/profile" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    Profile
                  </Link>
                  <button className={styles.dropdownItem} onClick={() => { signOut(); setDropdownOpen(false); }}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/signin" className={styles.signInButton}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 