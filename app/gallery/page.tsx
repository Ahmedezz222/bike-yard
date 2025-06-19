'use client';

import React from 'react';
import ImageGrid from '../components/ImageGrid';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import styles from './page.module.css';

const images = [
  {
    src: '/img/additional/image1.jpg',
    alt: 'Mountain Bike Trail',
    title: 'Mountain Bike Trail'
  },
  {
    src: '/img/additional/image2.jpg',
    alt: 'Road Cycling',
    title: 'Road Cycling'
  },
  {
    src: '/img/additional/image3.jpg',
    alt: 'Bike Maintenance',
    title: 'Bike Maintenance'
  },
  {
    src: '/img/additional/image4.jpg',
    alt: 'Cycling Gear',
    title: 'Cycling Gear'
  },
  {
    src: '/img/additional/image5.jpg',
    alt: 'Bike Shop',
    title: 'Bike Shop'
  },
  {
    src: '/img/additional/image6.jpg',
    alt: 'Cycling Event',
    title: 'Cycling Event'
  },
  {
    src: '/img/additional/image7.jpg',
    alt: 'Bike Parts',
    title: 'Bike Parts'
  },
  {
    src: '/img/additional/image8.jpg',
    alt: 'Cycling Accessories',
    title: 'Cycling Accessories'
  },
  {
    src: '/img/additional/image9.jpg',
    alt: 'Bike Repair',
    title: 'Bike Repair'
  },
  {
    src: '/img/additional/image10.jpg',
    alt: 'Cycling Community',
    title: 'Cycling Community'
  }
];

export default function GalleryPage() {
  return (
    <div className={styles.pageWrapper}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Our Gallery</h1>
          <p className={styles.description}>
            Explore our collection of cycling moments, products, and community events.
          </p>
          <ImageGrid images={images} />
        </div>
      </main>
      <Footer />
    </div>
  );
} 