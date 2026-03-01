const express = require('express');
const Vehicle = require('../models/Vehicle');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const vehicles = await Vehicle.getAll();
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const vehicleId = Number(req.params.id);
    const vehicle = await Vehicle.getById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    res.json(vehicle);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newVehicle = await Vehicle.create(req.body);
    res.status(201).json(newVehicle);
  } catch (err) {
    if (err.message.includes('required') || err.message.includes('must')) {
      return res.status(400).json({ errors: err.message.split(', ') });
    }
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const vehicleId = Number(req.params.id);
    const updatedVehicle = await Vehicle.update(vehicleId, req.body);

    if (!updatedVehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    res.json(updatedVehicle);
  } catch (err) {
    if (err.message.includes('required') || err.message.includes('must')) {
      return res.status(400).json({ errors: err.message.split(', ') });
    }
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const vehicleId = Number(req.params.id);
    const force = req.query.force === 'true';

    const result = await Vehicle.delete(vehicleId, force);

    if (!result.success) {
      if (result.error === 'Vehicle not found.') {
        return res.status(404).json({ error: result.error });
      }
      return res.status(409).json({
        error: result.error,
        openWorkOrdersCount: result.openWorkOrdersCount,
        message: result.message
      });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get('/:id/work-orders', async (req, res, next) => {
  try {
    const vehicleId = Number(req.params.id);
    const workOrders = await Vehicle.getWorkOrders(vehicleId);
    res.json(workOrders);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
