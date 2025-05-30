const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { sequelize, syncDatabase } = require('./config/database');
const bikesRouter = require('./routes/bikes');
const rentalsRouter = require('./routes/rentals');
const Bike = require('./models/Bike');
const Rental = require('./models/Rental');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/bikes', bikesRouter);
app.use('/api/rentals', rentalsRouter);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Bike Yard API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Database connection and server start
const startServer = async () => {
  try {
    // Sync database with alter: true to safely update schema
    await syncDatabase(false);
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer(); 