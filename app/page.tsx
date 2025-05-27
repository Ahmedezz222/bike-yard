import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";


const products = [
  {
    id: 1,
    title: 'Mountain Bike',
    description: 'Perfect for off-road adventures',
    image: {
      src: '/products/Mountain_Bike.png',
      alt: 'Mountain Bike',
      width: 500,
      height: 300
    },
    category: 'bikes'
  },
  {
    id: 2,
    title: 'Road Bike',
    description: 'Built for speed and efficiency',
    image: {
      src: '/products/Road_Bike.png',
      alt: 'Road Bike',
      width: 500,
      height: 300
    },
    category: 'bikes'
  },
  {
    id: 3,
    title: 'Bike Accessories',
    description: 'Essential gear for every cyclist',
    image: {
      src: '/products/Accessories.png',
      alt: 'Bike Accessories',
      width: 500,
      height: 300
    },
    category: 'accessories'
  }
];

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <Navigation />

        <section className={styles.hero}>
          <Image
            src="/img/Bike-Yard-Hero-Background.jpg"
            alt="Bike Yard Hero Background"
            fill
            priority
            quality={90}
            className={styles.heroBackground}
            sizes="100vw"
          />
          <div className={styles.heroContent}>
            <h1>Welcome to Bike Yard</h1>
            <p>Your One-Stop Shop for All Things Cycling</p>
            <div className={styles.heroButtons}>
              <Link href="/products" className={styles.btnPrimary}>Shop Now</Link>
              <Link href="/img/Menu.pdf" className={styles.btnPrimary}>Cafe Menu</Link>
            </div>
          </div>
        </section>

        <section className={styles.aboutUs}>
          <div className={styles.aboutUsContent}>
            <div className={styles.aboutUsText}>
              <h2>About Bike Yard</h2>
              <div className={styles.aboutUsDivider}></div>
              <p className={styles.aboutUsDescription}>
                At Bike Yard Shop, we are passionate about cycling. Our mission is to provide top-quality bikes, gear, and accessories to cyclists of all levels.
              </p>
              <div className={styles.aboutUsFeatures}>
                <div className={styles.feature}>
                  <i className="fas fa-bicycle"></i>
                  <h3>Quality Bikes</h3>
                  <p>Premium selection of mountain, road, and city bikes</p>
                </div>
                <div className={styles.feature}>
                  <i className="fas fa-tools"></i>
                  <h3>Expert Service</h3>
                  <p>Professional maintenance and repair services</p>
                </div>
                <div className={styles.feature}>
                  <i className="fas fa-coffee"></i>
                  <h3>Cafe & Community</h3>
                  <p>Relax in our cafe while we service your bike</p>
                </div>
              </div>
              <div className={styles.aboutUsButtons}>
                <Link href="/contact" className={styles.btnSecondary}>Contact Us</Link>
              </div>
            </div>
            <div className={styles.aboutUsImage}>
              <Image
                src="/img/bike-yard-img.jpg"
                alt="Bike Yard Shop"
                width={600}
                height={400}
                className={styles.aboutImage}
                priority
                quality={90}
              />
            </div>
          </div>
        </section>

        <section className={styles.featuredProducts}>
          <h2>Our Products</h2>
          <div className={styles.productGrid}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImageWrapper}>
                  <Image 
                    src={product.image.src}
                    alt={product.image.alt}
                    width={product.image.width}
                    height={product.image.height}
                    className={styles.productImage}
                    priority={product.id === 1}
                    quality={85}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className={styles.productInfo}>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <Link href={`/products/${product.category}`} className={styles.productBtn}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.testimonials}>
          <h2>What Our Customers Say</h2>
          <div className={styles.testimonialSlider}>
            {[
              { text: "Bike Yard Shop has the best collection of bikes and accessories. Excellent service and great prices!", author: "Alex J." },
              { text: "I love my new mountain bike from Bike Yard Shop. The quality and customer service are top-notch!", author: "Maria S." },
              { text: "Their bike repair service is fast and reliable. Highly recommend!", author: "James T." }
            ].map((testimonial, index) => (
              <div key={index} className={styles.testimonial}>
                <p>{testimonial.text}</p>
                <span>- {testimonial.author}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
