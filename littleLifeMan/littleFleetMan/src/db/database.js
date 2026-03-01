const { Pool } = require('pg');

let pool = null;

function getPool() {
  if (pool) {
    return pool;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required. Add PostgreSQL to your Railway project.');
  }

  console.log('Connecting to PostgreSQL...');

  pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL error:', err);
  });

  return pool;
}

async function initializeSchema() {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      vin TEXT,
      license_plate TEXT,
      status TEXT NOT NULL CHECK(status IN ('active', 'in_service', 'retired')),
      odometer INTEGER NOT NULL DEFAULT 0,
      last_service_date TEXT,
      notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS work_orders (
      id SERIAL PRIMARY KEY,
      vehicle_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      due_date TEXT,
      status TEXT NOT NULL CHECK(status IN ('open', 'in_progress', 'completed', 'cancelled')),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_work_orders_vehicle ON work_orders(vehicle_id);
    CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
    CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
  `);

  console.log('Database schema initialized');
}

async function seedData() {
  const pool = getPool();

  const result = await pool.query('SELECT COUNT(*) as count FROM vehicles');
  const vehicleCount = parseInt(result.rows[0].count);

  if (vehicleCount === 0) {
    console.log('Seeding initial data...');

    const now = new Date().toISOString();

    await pool.query(`
      INSERT INTO vehicles (name, type, vin, license_plate, status, odometer, last_service_date, notes, created_at, updated_at)
      VALUES
        ('Sprinter Van 01', 'Van', 'W1Y4EBHY7NT000001', 'FLT-201', 'active', 124500, '2026-01-10', 'Primary delivery vehicle.', $1, $1),
        ('Field Truck 14', 'Truck', '1FTFW1E50NFA00014', 'FLT-214', 'in_service', 98700, '2026-02-04', 'Used by maintenance crew.', $1, $1)
    `, [now]);

    await pool.query(`
      INSERT INTO work_orders (vehicle_id, title, description, due_date, status, created_at, updated_at)
      VALUES
        (1, 'Oil change and filter replacement', 'Standard synthetic oil service.', '2026-03-02', 'open', $1, $1),
        (2, 'Replace rear brake pads', 'Check rotors while replacing pads.', '2026-03-04', 'in_progress', $1, $1)
    `, [now]);

    console.log('Seed data created');
  }
}

async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database connection closed');
  }
}

async function healthCheck() {
  try {
    const pool = getPool();
    await pool.query('SELECT 1');

    return {
      healthy: true,
      database: 'PostgreSQL',
      connected: true
    };
  } catch (err) {
    return {
      healthy: false,
      database: 'PostgreSQL',
      error: err.message
    };
  }
}

async function initialize() {
  try {
    getPool();
    await initializeSchema();
    await seedData();
    console.log('Database initialization complete');
  } catch (err) {
    console.error('Database initialization failed:', err);
    throw err;
  }
}

module.exports = {
  getPool,
  initialize,
  closeDatabase,
  healthCheck
};
