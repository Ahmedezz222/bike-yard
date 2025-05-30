require('dotenv').config();
const { sequelize } = require('../config/database');
const Bike = require('../models/Bike');
const Rental = require('../models/Rental');

const sampleBikes = [
  {
    name: 'Mountain Master Pro',
    type: 'Mountain Bike',
    price: 25.00,
    available: true,
    description: 'Professional grade mountain bike with full suspension',
    imageUrl: '/images/mountain-bike.jpg'
  },
  {
    name: 'City Cruiser',
    type: 'City Bike',
    price: 15.00,
    available: true,
    description: 'Comfortable city bike perfect for urban commuting',
    imageUrl: '/images/city-bike.jpg'
  },
  {
    name: 'Road Racer Elite',
    type: 'Road Bike',
    price: 30.00,
    available: true,
    description: 'Lightweight road bike for speed enthusiasts',
    imageUrl: '/images/road-bike.jpg'
  },
  {
    name: 'Electric Explorer',
    type: 'E-Bike',
    price: 40.00,
    available: true,
    description: 'Electric bike with long-range battery',
    imageUrl: '/images/e-bike.jpg'
  }
];

const sampleRentals = [
  {
    bikeId: 1,
    userId: 1,
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    status: 'active',
    totalPrice: 25.00
  },
  {
    bikeId: 2,
    userId: 2,
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
    endDate: new Date(),
    status: 'completed',
    totalPrice: 15.00
  }
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await Rental.destroy({ where: {} });
    await Bike.destroy({ where: {} });
    console.log('Cleared existing data');

    // Insert sample bikes
    const createdBikes = await Bike.bulkCreate(sampleBikes);
    console.log(`Created ${createdBikes.length} bikes`);

    // Insert sample rentals
    const createdRentals = await Rental.bulkCreate(sampleRentals);
    console.log(`Created ${createdRentals.length} rentals`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 