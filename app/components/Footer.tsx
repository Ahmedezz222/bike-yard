import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>About Bike Yard</h3>
          <p>Your one-stop destination for quality bikes, accessories, and expert service. We're passionate about cycling and committed to providing the best experience for our customers.</p>
          <div className={styles.socialLinks}>
            {[
              { icon: 'facebook-f', href: '#' },
              { icon: 'instagram', href: '#' },
            ].map((social) => (
              <a key={social.icon} href={social.href} aria-label={`Follow us on ${social.icon}`}>
                <i className={`fab fa-${social.icon}`} aria-hidden="true"></i>
              </a>
            ))}
          </div>
        </div>
        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <ul className={styles.footerLinks}>
            {[
              { href: '/', label: 'Home' },
              { href: '/products', label: 'Products' },
              { href: '/contact', label: 'Contact us' },
              { href: '/img/Menu.pdf', label: 'Cafe Menu' }
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h3>Contact Info</h3>
          <div className={styles.contactInfo}>
            {[
              { icon: 'map-marker-alt', text: '123 Bike Street, City, Country' },
              { icon: 'phone', text: '+1 234 567 8900' },
              { icon: 'envelope', text: 'info@bikeyard.com' }
            ].map((contact) => (
              <p key={contact.icon}>
                <i className={`fas fa-${contact.icon}`} aria-hidden="true"></i>
                {contact.text}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Bike Yard Shop. All Rights Reserved.</p>
      </div>
    </footer>
  );
} 