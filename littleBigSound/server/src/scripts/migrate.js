import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, readdirSync } from 'fs';
import dotenv from 'dotenv';

const { Pool } = pg;

// Load environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
  try {
    console.log('Starting database migrations...\n');

    // Get all migration files in order
    const migrationsDir = join(__dirname, '../migrations');
    const files = readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`Found ${files.length} migration file(s):\n`);

    for (const file of files) {
      console.log(`Running: ${file}...`);
      const filepath = join(migrationsDir, file);
      const sql = readFileSync(filepath, 'utf8');

      await pool.query(sql);
      console.log(`✓ ${file} completed\n`);
    }

    console.log('All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

runMigrations();
