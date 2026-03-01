const { getDatabase } = require('../db/database');
const Vehicle = require('./Vehicle');

const WORK_ORDER_STATUSES = ['open', 'in_progress', 'completed', 'cancelled'];

function validateWorkOrderPayload(payload) {
  const errors = [];

  if (!payload.title || typeof payload.title !== 'string') {
    errors.push('Work order title is required.');
  }

  if (payload.vehicleId === undefined || Number.isNaN(Number(payload.vehicleId))) {
    errors.push('vehicleId must be a valid number.');
  } else {
    const vehicle = Vehicle.getById(Number(payload.vehicleId));
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

class WorkOrder {
  static getAll(vehicleId = null) {
    const db = getDatabase();

    if (vehicleId) {
      return db.prepare('SELECT * FROM work_orders WHERE vehicleId = ? ORDER BY id DESC').all(vehicleId);
    }

    return db.prepare('SELECT * FROM work_orders ORDER BY id DESC').all();
  }

  static getById(id) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM work_orders WHERE id = ?').get(id);
  }

  static create(payload) {
    const errors = validateWorkOrderPayload(payload);
    if (errors.length) {
      throw new Error(errors.join(', '));
    }

    const db = getDatabase();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO work_orders (vehicleId, title, description, dueDate, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      Number(payload.vehicleId),
      payload.title.trim(),
      (payload.description || '').trim(),
      payload.dueDate || '',
      payload.status,
      now,
      now
    );

    return WorkOrder.getById(result.lastInsertRowid);
  }

  static update(id, payload) {
    const errors = validateWorkOrderPayload(payload);
    if (errors.length) {
      throw new Error(errors.join(', '));
    }

    const existing = WorkOrder.getById(id);
    if (!existing) {
      return null;
    }

    const db = getDatabase();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE work_orders
      SET vehicleId = ?, title = ?, description = ?, dueDate = ?, status = ?, updatedAt = ?
      WHERE id = ?
    `);

    stmt.run(
      Number(payload.vehicleId),
      payload.title.trim(),
      (payload.description || '').trim(),
      payload.dueDate || '',
      payload.status,
      now,
      id
    );

    return WorkOrder.getById(id);
  }

  static delete(id) {
    const db = getDatabase();

    const existing = WorkOrder.getById(id);
    if (!existing) {
      return false;
    }

    db.prepare('DELETE FROM work_orders WHERE id = ?').run(id);
    return true;
  }
}

module.exports = WorkOrder;
