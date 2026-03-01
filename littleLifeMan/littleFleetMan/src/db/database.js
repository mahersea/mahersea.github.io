const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

function resolveDataDir() {
  const candidates = [
    process.env.DATA_DIR,
    '/tmp/littlefleetman-data',
    path.join(__dirname, '../../data')
  ].filter(Boolean);

  for (const dir of candidates) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      const probe = path.join(dir, '.write-test');
      fs.writeFileSync(probe, 'ok');
      fs.unlinkSync(probe);
      return dir;
    } catch (_err) {
      // Try the next candidate directory.
    }
  }

  throw new Error('No writable DATA_DIR available. Set DATA_DIR to a writable path.');
}

const DATA_DIR = resolveDataDir();
const DB_PATH = path.join(DATA_DIR, 'fleet.db');

let db = null;

function getDatabase() {
  if (db) {
    return db;
  }

  console.log(`Initializing database at: ${DB_PATH}`);

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL'); // Better concurrency
  db.pragma('foreign_keys = ON');  // Enforce foreign key constraints

  initializeSchema();

  return db;
}

function initializeSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      vin TEXT,
      licensePlate TEXT,
      status TEXT NOT NULL CHECK(status IN ('active', 'in_service', 'retired')),
      odometer INTEGER NOT NULL DEFAULT 0,
      lastServiceDate TEXT,
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS work_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicleId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      dueDate TEXT,
      status TEXT NOT NULL CHECK(status IN ('open', 'in_progress', 'completed', 'cancelled')),
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (vehicleId) REFERENCES vehicles(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_work_orders_vehicle ON work_orders(vehicleId);
    CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
    CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
  `);

  console.log('Database schema initialized');
}

function seedData() {
  const vehicleCount = db.prepare('SELECT COUNT(*) as count FROM vehicles').get().count;

  if (vehicleCount === 0) {
    console.log('Seeding initial data...');

    const now = new Date().toISOString();

    const insertVehicle = db.prepare(`
      INSERT INTO vehicles (name, type, vin, licensePlate, status, odometer, lastServiceDate, notes, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertWorkOrder = db.prepare(`
      INSERT INTO work_orders (vehicleId, title, description, dueDate, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const seedTransaction = db.transaction(() => {
      insertVehicle.run(
        'Sprinter Van 01',
        'Van',
        'W1Y4EBHY7NT000001',
        'FLT-201',
        'active',
        124500,
        '2026-01-10',
        'Primary delivery vehicle.',
        now,
        now
      );

      insertVehicle.run(
        'Field Truck 14',
        'Truck',
        '1FTFW1E50NFA00014',
        'FLT-214',
        'in_service',
        98700,
        '2026-02-04',
        'Used by maintenance crew.',
        now,
        now
      );

      insertWorkOrder.run(
        1,
        'Oil change and filter replacement',
        'Standard synthetic oil service.',
        '2026-03-02',
        'open',
        now,
        now
      );

      insertWorkOrder.run(
        2,
        'Replace rear brake pads',
        'Check rotors while replacing pads.',
        '2026-03-04',
        'in_progress',
        now,
        now
      );
    });

    seedTransaction();
    console.log('Seed data created');
  }
}

function migrateFromJSON() {
  const vehiclesFile = path.join(DATA_DIR, 'vehicles.json');
  const workOrdersFile = path.join(DATA_DIR, 'work-orders.json');

  if (!fs.existsSync(vehiclesFile)) {
    return;
  }

  console.log('Migrating data from JSON files...');

  try {
    const vehicles = JSON.parse(fs.readFileSync(vehiclesFile, 'utf8'));
    const workOrders = JSON.parse(fs.readFileSync(workOrdersFile, 'utf8'));

    const insertVehicle = db.prepare(`
      INSERT INTO vehicles (id, name, type, vin, licensePlate, status, odometer, lastServiceDate, notes, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertWorkOrder = db.prepare(`
      INSERT INTO work_orders (id, vehicleId, title, description, dueDate, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const migrateTransaction = db.transaction(() => {
      for (const vehicle of vehicles) {
        insertVehicle.run(
          vehicle.id,
          vehicle.name,
          vehicle.type,
          vehicle.vin || '',
          vehicle.licensePlate || '',
          vehicle.status,
          vehicle.odometer,
          vehicle.lastServiceDate || '',
          vehicle.notes || '',
          vehicle.createdAt,
          vehicle.updatedAt
        );
      }

      for (const order of workOrders) {
        insertWorkOrder.run(
          order.id,
          order.vehicleId,
          order.title,
          order.description || '',
          order.dueDate || '',
          order.status,
          order.createdAt,
          order.updatedAt
        );
      }
    });

    migrateTransaction();

    // Backup and remove JSON files
    fs.renameSync(vehiclesFile, `${vehiclesFile}.backup`);
    fs.renameSync(workOrdersFile, `${workOrdersFile}.backup`);

    console.log('Migration complete. JSON files backed up.');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

function healthCheck() {
  try {
    // Test database connection
    db.prepare('SELECT 1').get();

    // Test data directory is writable
    const testFile = path.join(DATA_DIR, '.health-check');
    fs.writeFileSync(testFile, 'ok');
    fs.unlinkSync(testFile);

    return { healthy: true, dataDir: DATA_DIR, dbPath: DB_PATH };
  } catch (err) {
    return { healthy: false, error: err.message };
  }
}

module.exports = {
  getDatabase,
  closeDatabase,
  seedData,
  migrateFromJSON,
  healthCheck,
  DATA_DIR
};
