'use client';

import React from 'react';
import Image from 'next/image';
import styles from './ImageGrid.module.css';

interface ImageGridProps {
  images: {
    src: string;
    alt: string;
    title?: string;
  }[];
}

export default function ImageGrid({ images }: ImageGridProps) {
  return (
    <div className={styles.grid}>
      {images.map((image, index) => (
        <div key={index} className={styles.imageContainer}>
          <Image
            src={image.src}
            alt={image.alt}
            width={400}
            height={300}
            className={styles.image}
          />
          {image.title && <p className={styles.title}>{image.title}</p>}
        </div>
      ))}
    </div>
  );
} 