const { getPool } = require('../db/database');

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

function mapRowToVehicle(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    vin: row.vin,
    licensePlate: row.license_plate,
    status: row.status,
    odometer: row.odometer,
    lastServiceDate: row.last_service_date,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

class Vehicle {
  static async getAll() {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM vehicles ORDER BY id DESC');
    return result.rows.map(mapRowToVehicle);
  }

  static async getById(id) {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    return result.rows.length ? mapRowToVehicle(result.rows[0]) : null;
  }

  static async create(payload) {
    const errors = validateVehiclePayload(payload);
    if (errors.length) {
      throw new Error(errors.join(', '));
    }

    const pool = getPool();
    const now = new Date().toISOString();

    const result = await pool.query(`
      INSERT INTO vehicles (name, type, vin, license_plate, status, odometer, last_service_date, notes, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
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
    ]);

    return mapRowToVehicle(result.rows[0]);
  }

  static async update(id, payload) {
    const errors = validateVehiclePayload(payload);
    if (errors.length) {
      throw new Error(errors.join(', '));
    }

    const existing = await Vehicle.getById(id);
    if (!existing) {
      return null;
    }

    const pool = getPool();
    const now = new Date().toISOString();

    const result = await pool.query(`
      UPDATE vehicles
      SET name = $1, type = $2, vin = $3, license_plate = $4, status = $5, odometer = $6, last_service_date = $7, notes = $8, updated_at = $9
      WHERE id = $10
      RETURNING *
    `, [
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
    ]);

    return mapRowToVehicle(result.rows[0]);
  }

  static async delete(id, force = false) {
    const pool = getPool();

    const existing = await Vehicle.getById(id);
    if (!existing) {
      return { success: false, error: 'Vehicle not found.' };
    }

    // Check for open work orders
    const openWorkOrders = await pool.query(`
      SELECT COUNT(*) as count
      FROM work_orders
      WHERE vehicle_id = $1 AND status IN ('open', 'in_progress')
    `, [id]);

    const openCount = parseInt(openWorkOrders.rows[0].count);

    if (openCount > 0 && !force) {
      return {
        success: false,
        error: 'Vehicle has open work orders.',
        openWorkOrdersCount: openCount,
        message: 'Close/cancel work orders first, or use force=true to delete vehicle and associated work orders.'
      };
    }

    // Delete vehicle (cascade will handle work orders due to foreign key)
    await pool.query('DELETE FROM vehicles WHERE id = $1', [id]);

    return { success: true };
  }

  static async getWorkOrders(vehicleId) {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM work_orders WHERE vehicle_id = $1 ORDER BY id DESC', [vehicleId]);

    return result.rows.map(row => ({
      id: row.id,
      vehicleId: row.vehicle_id,
      title: row.title,
      description: row.description,
      dueDate: row.due_date,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }
}

module.exports = Vehicle;
