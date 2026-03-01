const { getDatabase } = require('../db/database');

const VEHICLE_STATUSES = ['active', 'in_service', 'retired'];

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

  if (payload.lastServiceDate && !/^\d{4}-\d{2}-\d{2}$/.test(payload.lastServiceDate)) {
    errors.push('lastServiceDate must use YYYY-MM-DD format.');
  }

  return errors;
}

class Vehicle {
  static getAll() {
    const db = getDatabase();
    return db.prepare('SELECT * FROM vehicles ORDER BY id DESC').all();
  }

  static getById(id) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
  }

  static create(payload) {
    const errors = validateVehiclePayload(payload);
    if (errors.length) {
      throw new Error(errors.join(', '));
    }

    const db = getDatabase();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO vehicles (name, type, vin, licensePlate, status, odometer, lastServiceDate, notes, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      payload.name.trim(),
      payload.type.trim(),
      (payload.vin || '').trim(),
      (payload.licensePlate || '').trim(),
      payload.status,
      Number(payload.odometer),
      payload.lastServiceDate || '',
      (payload.notes || '').trim(),
      now,
      now
    );

    return Vehicle.getById(result.lastInsertRowid);
  }

  static update(id, payload) {
    const errors = validateVehiclePayload(payload);
    if (errors.length) {
      throw new Error(errors.join(', '));
    }

    const existing = Vehicle.getById(id);
    if (!existing) {
      return null;
    }

    const db = getDatabase();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE vehicles
      SET name = ?, type = ?, vin = ?, licensePlate = ?, status = ?, odometer = ?, lastServiceDate = ?, notes = ?, updatedAt = ?
      WHERE id = ?
    `);

    stmt.run(
      payload.name.trim(),
      payload.type.trim(),
      (payload.vin || '').trim(),
      (payload.licensePlate || '').trim(),
      payload.status,
      Number(payload.odometer),
      payload.lastServiceDate || '',
      (payload.notes || '').trim(),
      now,
      id
    );

    return Vehicle.getById(id);
  }

  static delete(id, force = false) {
    const db = getDatabase();

    const existing = Vehicle.getById(id);
    if (!existing) {
      return { success: false, error: 'Vehicle not found.' };
    }

    // Check for open work orders
    const openWorkOrders = db.prepare(`
      SELECT COUNT(*) as count
      FROM work_orders
      WHERE vehicleId = ? AND status IN ('open', 'in_progress')
    `).get(id);

    if (openWorkOrders.count > 0 && !force) {
      return {
        success: false,
        error: 'Vehicle has open work orders.',
        openWorkOrdersCount: openWorkOrders.count,
        message: 'Close/cancel work orders first, or use force=true to delete vehicle and associated work orders.'
      };
    }

    // Delete vehicle (cascade will handle work orders due to foreign key)
    db.prepare('DELETE FROM vehicles WHERE id = ?').run(id);

    return { success: true };
  }

  static getWorkOrders(vehicleId) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM work_orders WHERE vehicleId = ? ORDER BY id DESC').all(vehicleId);
  }
}

module.exports = Vehicle;
