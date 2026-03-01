const express = require('express');
const WorkOrder = require('../models/WorkOrder');

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const vehicleId = req.query.vehicleId ? Number(req.query.vehicleId) : null;
    const workOrders = WorkOrder.getAll(vehicleId);
    res.json(workOrders);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const workOrder = WorkOrder.getById(orderId);

    if (!workOrder) {
      return res.status(404).json({ error: 'Work order not found.' });
    }

    res.json(workOrder);
  } catch (err) {
    next(err);
  }
});

router.post('/', (req, res, next) => {
  try {
    const newWorkOrder = WorkOrder.create(req.body);
    res.status(201).json(newWorkOrder);
  } catch (err) {
    if (err.message.includes('required') || err.message.includes('must')) {
      return res.status(400).json({ errors: err.message.split(', ') });
    }
    next(err);
  }
});

router.put('/:id', (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const updatedWorkOrder = WorkOrder.update(orderId, req.body);

    if (!updatedWorkOrder) {
      return res.status(404).json({ error: 'Work order not found.' });
    }

    res.json(updatedWorkOrder);
  } catch (err) {
    if (err.message.includes('required') || err.message.includes('must')) {
      return res.status(400).json({ errors: err.message.split(', ') });
    }
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const deleted = WorkOrder.delete(orderId);

    if (!deleted) {
      return res.status(404).json({ error: 'Work order not found.' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
