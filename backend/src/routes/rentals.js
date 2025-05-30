const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');
const Bike = require('../models/Bike');

// Get all rentals
router.get('/', async (req, res) => {
  try {
    const rentals = await Rental.findAll({
      include: [Bike]
    });
    res.json({ rentals });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rentals', error: error.message });
  }
});

// Get a specific rental by ID
router.get('/:id', async (req, res) => {
  try {
    const rental = await Rental.findByPk(req.params.id, {
      include: [Bike]
    });
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rental', error: error.message });
  }
});

// Create a new rental
router.post('/', async (req, res) => {
  try {
    const bike = await Bike.findByPk(req.body.bikeId);
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }
    if (!bike.available) {
      return res.status(400).json({ message: 'Bike is not available for rent' });
    }

    const rental = await Rental.create(req.body);
    await bike.update({ available: false });
    
    res.status(201).json({
      message: 'Rental created successfully',
      rental
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating rental', error: error.message });
  }
});

// Update rental status
router.patch('/:id/status', async (req, res) => {
  try {
    const rental = await Rental.findByPk(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    const { status } = req.body;
    await rental.update({ status });

    // If rental is completed or cancelled, make the bike available again
    if (status === 'completed' || status === 'cancelled') {
      const bike = await Bike.findByPk(rental.bikeId);
      await bike.update({ available: true });
    }

    res.json({
      message: 'Rental status updated successfully',
      rental
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating rental status', error: error.message });
  }
});

// Cancel a rental
router.delete('/:id', async (req, res) => {
  try {
    const rental = await Rental.findByPk(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    await rental.update({ status: 'cancelled' });
    const bike = await Bike.findByPk(rental.bikeId);
    await bike.update({ available: true });

    res.json({
      message: 'Rental cancelled successfully',
      id: req.params.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling rental', error: error.message });
  }
});

module.exports = router; 