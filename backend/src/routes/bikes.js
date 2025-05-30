const express = require('express');
const router = express.Router();
const Bike = require('../models/Bike');

// Get all bikes
router.get('/', async (req, res) => {
  try {
    const bikes = await Bike.findAll();
    res.json({ bikes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bikes', error: error.message });
  }
});

// Get a specific bike by ID
router.get('/:id', async (req, res) => {
  try {
    const bike = await Bike.findByPk(req.params.id);
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }
    res.json(bike);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bike', error: error.message });
  }
});

// Add a new bike
router.post('/', async (req, res) => {
  try {
    const bike = await Bike.create(req.body);
    res.status(201).json({
      message: 'Bike added successfully',
      bike
    });
  } catch (error) {
    res.status(400).json({ message: 'Error adding bike', error: error.message });
  }
});

// Update a bike
router.put('/:id', async (req, res) => {
  try {
    const bike = await Bike.findByPk(req.params.id);
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }
    await bike.update(req.body);
    res.json({
      message: 'Bike updated successfully',
      bike
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating bike', error: error.message });
  }
});

// Delete a bike
router.delete('/:id', async (req, res) => {
  try {
    const bike = await Bike.findByPk(req.params.id);
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }
    await bike.destroy();
    res.json({
      message: 'Bike deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bike', error: error.message });
  }
});

module.exports = router; 