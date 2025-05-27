import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
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
        {/* Add your navigation here if needed */}
      </div>
    </header>
  );
} 