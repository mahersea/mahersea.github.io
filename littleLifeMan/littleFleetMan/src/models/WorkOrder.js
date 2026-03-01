const { getPool } = require('../db/database');
const Vehicle = require('./Vehicle');

const WORK_ORDER_STATUSES = ['open', 'in_progress', 'completed', 'cancelled'];

async function validateWorkOrderPayload(payload) {
  const errors = [];

  if (!payload.title || typeof payload.title !== 'string') {
    errors.push('Work order title is required.');
  }

  if (payload.vehicleId === undefined || Number.isNaN(Number(payload.vehicleId))) {
    errors.push('vehicleId must be a valid number.');
  } else {
    const vehicle = await Vehicle.getById(Number(payload.vehicleId));
    if (!vehicle) {
      errors.push('vehicleId must refer to an existing vehicle.');
    }
  }

  if (!payload.status || !WORK_ORDER_STATUSES.includes(payload.status)) {
    errors.push(`Work order status must be one of: ${WORK_ORDER_STATUSES.join(', ')}`);
  }

  if (payload.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(payload.dueDate)) {
    errors.push('dueDate must use YYYY-MM-DD format.');
  }

  return errors;
}

function mapRowToWorkOrder(row) {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

class WorkOrder {
  static async getAll(vehicleId = null) {
    const pool = getPool();

    if (vehicleId) {
      const result = await pool.query('SELECT * FROM work_orders WHERE vehicle_id = $1 ORDER BY id DESC', [vehicleId]);
      return result.rows.map(mapRowToWorkOrder);
    }

    const result = await pool.query('SELECT * FROM work_orders ORDER BY id DESC');
    return result.rows.map(mapRowToWorkOrder);
  }

  static async getById(id) {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM work_orders WHERE id = $1', [id]);
    return result.rows.length ? mapRowToWorkOrder(result.rows[0]) : null;
  }

  static async create(payload) {
    const errors = await validateWorkOrderPayload(payload);
    if (errors.length) {
      throw new Error(errors.join(', '));
    }

    const pool = getPool();
    const now = new Date().toISOString();

    const result = await pool.query(`
      INSERT INTO work_orders (vehicle_id, title, description, due_date, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      Number(payload.vehicleId),
      payload.title.trim(),
      (payload.description || '').trim(),
      payload.dueDate || '',
      payload.status,
      now,
      now
    ]);

    return mapRowToWorkOrder(result.rows[0]);
  }

  static async update(id, payload) {
    const errors = await validateWorkOrderPayload(payload);
    if (errors.length) {
      throw new Error(errors.join(', '));
    }

    const existing = await WorkOrder.getById(id);
    if (!existing) {
      return null;
    }

    const pool = getPool();
    const now = new Date().toISOString();

    const result = await pool.query(`
      UPDATE work_orders
      SET vehicle_id = $1, title = $2, description = $3, due_date = $4, status = $5, updated_at = $6
      WHERE id = $7
      RETURNING *
    `, [
      Number(payload.vehicleId),
      payload.title.trim(),
      (payload.description || '').trim(),
      payload.dueDate || '',
      payload.status,
      now,
      id
    ]);

    return mapRowToWorkOrder(result.rows[0]);
  }

  static async delete(id) {
    const pool = getPool();

    const existing = await WorkOrder.getById(id);
    if (!existing) {
      return false;
    }

    await pool.query('DELETE FROM work_orders WHERE id = $1', [id]);
    return true;
  }
}

module.exports = WorkOrder;
