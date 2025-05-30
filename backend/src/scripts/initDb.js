require('dotenv').config();
const sequelize = require('../config/database');
const Bike = require('../models/Bike');
const Rental = require('../models/Rental');

// This script will reset the database and create all tables
async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully!');
    
    // Seed the database
    console.log('Starting to seed data...');
    await require('./seedData').seedDatabase();
    
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

initializeDatabase(); 