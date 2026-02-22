const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3011;
const DATA_DIR = process.env.DATA_DIR || __dirname;

const VEHICLES_FILE = path.join(DATA_DIR, 'vehicles.json');
const WORK_ORDERS_FILE = path.join(DATA_DIR, 'work-orders.json');

const VEHICLE_STATUSES = ['active', 'in_service', 'retired'];
const WORK_ORDER_STATUSES = ['open', 'in_progress', 'completed', 'cancelled'];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function isValidDateString(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
    return [];
  }

  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to parse JSON at ${filePath}:`, err);
    return [];
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function nextId(items) {
  if (!items.length) {
    return 1;
  }

  return Math.max(...items.map(item => Number(item.id) || 0)) + 1;
}

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(VEHICLES_FILE)) {
    const seedVehicles = [
      {
        id: 1,
        name: 'Sprinter Van 01',
        type: 'Van',
        vin: 'W1Y4EBHY7NT000001',
        licensePlate: 'FLT-201',
        status: 'active',
        odometer: 124500,
        lastServiceDate: '2026-01-10',
        notes: 'Primary delivery vehicle.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Field Truck 14',
        type: 'Truck',
        vin: '1FTFW1E50NFA00014',
        licensePlate: 'FLT-214',
        status: 'in_service',
        odometer: 98700,
        lastServiceDate: '2026-02-04',
        notes: 'Used by maintenance crew.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    writeJson(VEHICLES_FILE, seedVehicles);
  }

  if (!fs.existsSync(WORK_ORDERS_FILE)) {
    const seedWorkOrders = [
      {
        id: 1,
        vehicleId: 1,
        title: 'Oil change and filter replacement',
        description: 'Standard synthetic oil service.',
        dueDate: '2026-03-02',
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        vehicleId: 2,
        title: 'Replace rear brake pads',
        description: 'Check rotors while replacing pads.',
        dueDate: '2026-03-04',
        status: 'in_progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    writeJson(WORK_ORDERS_FILE, seedWorkOrders);
  }
}

function validateVehiclePayload(payload) {
  const errors = [];

  if (!payload.name || typeof payload.name !== 'string') {
    errors.push('Vehicle name is required.');
  }

  if (!payload.type || typeof payload.type !== 'string') {
    errors.push('Vehicle type is required.');
  }

  if (!payload.status || !VEHICLE_STATUSES.includes(payload.status)) {
    errors.push(`Vehicle status must be one of: ${VEHICLE_STATUSES.join(', ')}`);
  }

  if (payload.odometer === undefined || Number.isNaN(Number(payload.odometer)) || Number(payload.odometer) < 0) {
    errors.push('Odometer must be a non-negative number.');
  }

  if (payload.lastServiceDate && !isValidDateString(payload.lastServiceDate)) {
    errors.push('lastServiceDate must use YYYY-MM-DD format.');
  }

  return errors;
}

function validateWorkOrderPayload(payload, vehicles) {
  const errors = [];

  if (!payload.title || typeof payload.title !== 'string') {
    errors.push('Work order title is required.');
  }

  if (payload.vehicleId === undefined || Number.isNaN(Number(payload.vehicleId))) {
    errors.push('vehicleId must be a valid number.');
  } else {
    const vehicleExists = vehicles.some(vehicle => vehicle.id === Number(payload.vehicleId));
    if (!vehicleExists) {
      errors.push('vehicleId must refer to an existing vehicle.');
    }
  }

  if (!payload.status || !WORK_ORDER_STATUSES.includes(payload.status)) {
    errors.push(`Work order status must be one of: ${WORK_ORDER_STATUSES.join(', ')}`);
  }

  if (payload.dueDate && !isValidDateString(payload.dueDate)) {
    errors.push('dueDate must use YYYY-MM-DD format.');
  }

  return errors;
}

/* ------------------ Vehicle Endpoints ------------------ */

app.get('/api/vehicles', (req, res) => {
  const vehicles = readJson(VEHICLES_FILE);
  res.json(vehicles);
});

app.get('/api/vehicles/:id', (req, res) => {
  const vehicleId = Number(req.params.id);
  const vehicles = readJson(VEHICLES_FILE);
  const vehicle = vehicles.find(item => item.id === vehicleId);

  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found.' });
  }

  res.json(vehicle);
});

app.post('/api/vehicles', (req, res) => {
  const vehicles = readJson(VEHICLES_FILE);
  const payload = req.body;
  const errors = validateVehiclePayload(payload);

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const now = new Date().toISOString();
  const newVehicle = {
    id: nextId(vehicles),
    name: payload.name.trim(),
    type: payload.type.trim(),
    vin: (payload.vin || '').trim(),
    licensePlate: (payload.licensePlate || '').trim(),
    status: payload.status,
    odometer: Number(payload.odometer),
    lastServiceDate: payload.lastServiceDate || '',
    notes: (payload.notes || '').trim(),
    createdAt: now,
    updatedAt: now
  };

  vehicles.push(newVehicle);
  writeJson(VEHICLES_FILE, vehicles);
  res.status(201).json(newVehicle);
});

app.put('/api/vehicles/:id', (req, res) => {
  const vehicleId = Number(req.params.id);
  const vehicles = readJson(VEHICLES_FILE);
  const index = vehicles.findIndex(item => item.id === vehicleId);

  if (index === -1) {
    return res.status(404).json({ error: 'Vehicle not found.' });
  }

  const payload = req.body;
  const errors = validateVehiclePayload(payload);

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const updatedVehicle = {
    ...vehicles[index],
    name: payload.name.trim(),
    type: payload.type.trim(),
    vin: (payload.vin || '').trim(),
    licensePlate: (payload.licensePlate || '').trim(),
    status: payload.status,
    odometer: Number(payload.odometer),
    lastServiceDate: payload.lastServiceDate || '',
    notes: (payload.notes || '').trim(),
    updatedAt: new Date().toISOString()
  };

  vehicles[index] = updatedVehicle;
  writeJson(VEHICLES_FILE, vehicles);
  res.json(updatedVehicle);
});

app.delete('/api/vehicles/:id', (req, res) => {
  const vehicleId = Number(req.params.id);
  const force = req.query.force === 'true';

  const vehicles = readJson(VEHICLES_FILE);
  const workOrders = readJson(WORK_ORDERS_FILE);

  const index = vehicles.findIndex(item => item.id === vehicleId);
  if (index === -1) {
    return res.status(404).json({ error: 'Vehicle not found.' });
  }

  const openWorkOrders = workOrders.filter(
    order => order.vehicleId === vehicleId && ['open', 'in_progress'].includes(order.status)
  );

  if (openWorkOrders.length && !force) {
    return res.status(409).json({
      error: 'Vehicle has open work orders.',
      openWorkOrdersCount: openWorkOrders.length,
      message: 'Close/cancel work orders first, or retry with ?force=true to delete vehicle and associated work orders.'
    });
  }

  const remainingVehicles = vehicles.filter(item => item.id !== vehicleId);
  const remainingWorkOrders = workOrders.filter(order => order.vehicleId !== vehicleId);

  writeJson(VEHICLES_FILE, remainingVehicles);
  writeJson(WORK_ORDERS_FILE, remainingWorkOrders);

  res.status(204).send();
});

/* ------------------ Work Order Endpoints ------------------ */

app.get('/api/work-orders', (req, res) => {
  const vehicleId = req.query.vehicleId ? Number(req.query.vehicleId) : null;
  const workOrders = readJson(WORK_ORDERS_FILE);

  if (!vehicleId) {
    return res.json(workOrders);
  }

  const filtered = workOrders.filter(order => order.vehicleId === vehicleId);
  res.json(filtered);
});

app.get('/api/vehicles/:id/work-orders', (req, res) => {
  const vehicleId = Number(req.params.id);
  const workOrders = readJson(WORK_ORDERS_FILE);
  const filtered = workOrders.filter(order => order.vehicleId === vehicleId);
  res.json(filtered);
});

app.post('/api/work-orders', (req, res) => {
  const vehicles = readJson(VEHICLES_FILE);
  const workOrders = readJson(WORK_ORDERS_FILE);
  const payload = req.body;

  const errors = validateWorkOrderPayload(payload, vehicles);
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const now = new Date().toISOString();
  const newWorkOrder = {
    id: nextId(workOrders),
    vehicleId: Number(payload.vehicleId),
    title: payload.title.trim(),
    description: (payload.description || '').trim(),
    dueDate: payload.dueDate || '',
    status: payload.status,
    createdAt: now,
    updatedAt: now
  };

  workOrders.push(newWorkOrder);
  writeJson(WORK_ORDERS_FILE, workOrders);
  res.status(201).json(newWorkOrder);
});

app.put('/api/work-orders/:id', (req, res) => {
  const orderId = Number(req.params.id);
  const vehicles = readJson(VEHICLES_FILE);
  const workOrders = readJson(WORK_ORDERS_FILE);
  const index = workOrders.findIndex(item => item.id === orderId);

  if (index === -1) {
    return res.status(404).json({ error: 'Work order not found.' });
  }

  const payload = req.body;
  const errors = validateWorkOrderPayload(payload, vehicles);
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const updated = {
    ...workOrders[index],
    vehicleId: Number(payload.vehicleId),
    title: payload.title.trim(),
    description: (payload.description || '').trim(),
    dueDate: payload.dueDate || '',
    status: payload.status,
    updatedAt: new Date().toISOString()
  };

  workOrders[index] = updated;
  writeJson(WORK_ORDERS_FILE, workOrders);
  res.json(updated);
});

app.delete('/api/work-orders/:id', (req, res) => {
  const orderId = Number(req.params.id);
  const workOrders = readJson(WORK_ORDERS_FILE);
  const exists = workOrders.some(item => item.id === orderId);

  if (!exists) {
    return res.status(404).json({ error: 'Work order not found.' });
  }

  const remaining = workOrders.filter(item => item.id !== orderId);
  writeJson(WORK_ORDERS_FILE, remaining);
  res.status(204).send();
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'littleFleetMan', port: PORT });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error.' });
});

ensureDataFiles();

app.listen(PORT, () => {
  console.log(`littleFleetMan running on http://localhost:${PORT}`);
});
