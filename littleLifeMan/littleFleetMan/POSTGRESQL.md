# PostgreSQL Setup for Railway

littleFleetMan now uses **PostgreSQL** for persistent, reliable data storage.

## Quick Setup on Railway

### Step 1: Add PostgreSQL Database

1. Go to your Railway project dashboard
2. Click **"New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway automatically creates the database and sets the `DATABASE_URL` environment variable
4. That's it! Your app will automatically connect.

### Step 2: Deploy Your App

```bash
git add .
git commit -m "Migrate to PostgreSQL"
git push origin development-1.0
```

Railway will:
- Detect the changes
- Rebuild the app
- Connect to PostgreSQL using `DATABASE_URL`
- Run schema initialization automatically
- Seed initial data

### Step 3: Verify Connection

Once deployed, check the logs:
```
Connecting to PostgreSQL...
Database schema initialized
Seeding initial data...
Database initialization complete
✓ littleFleetMan is running on http://0.0.0.0:PORT
```

Test the health endpoint:
```bash
curl https://your-service.railway.app/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "PostgreSQL",
  "connected": true,
  "timestamp": "2026-03-01T..."
}
```

---

## What Changed from SQLite

### Architecture
- **Before:** SQLite file in ephemeral `/tmp` directory
- **After:** PostgreSQL with persistent Railway-managed storage

### Benefits
✅ **Persistent Data** - Survives container restarts
✅ **ACID Transactions** - No race conditions
✅ **Connection Pooling** - Better concurrency
✅ **Automatic Backups** - Railway handles this
✅ **Production Ready** - Scales better than file-based storage

### Database Schema

**Vehicles Table:**
```sql
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  vin TEXT,
  license_plate TEXT,
  status TEXT CHECK(status IN ('active', 'in_service', 'retired')),
  odometer INTEGER DEFAULT 0,
  last_service_date TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Work Orders Table:**
```sql
CREATE TABLE work_orders (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  status TEXT CHECK(status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string (auto-set by Railway)

### Optional
- `PORT` - Server port (auto-set by Railway, defaults to 3011)
- `NODE_ENV` - Set to `production` (set in Dockerfile)

---

## Local Development

To test PostgreSQL locally, you need a local PostgreSQL instance.

### Option 1: Docker (Recommended)

```bash
# Start PostgreSQL in Docker
docker run --name littlefleetman-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=littlefleetman \
  -p 5432:5432 \
  -d postgres:16-alpine

# Set DATABASE_URL
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/littlefleetman"

# Start the app
npm start
```

### Option 2: Local PostgreSQL Installation

```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Create database
createdb littlefleetman

# Set DATABASE_URL
export DATABASE_URL="postgresql://localhost/littlefleetman"

# Start the app
npm start
```

### Stop Local Database

```bash
# Docker
docker stop littlefleetman-db
docker rm littlefleetman-db

# Homebrew
brew services stop postgresql@16
```

---

## Troubleshooting

### Error: "DATABASE_URL environment variable is required"

**Cause:** PostgreSQL database not added to Railway project

**Fix:**
1. Go to Railway dashboard
2. Add PostgreSQL database
3. Redeploy your service

---

### Error: "Connection refused" or "timeout"

**Cause:** Database not accessible or connection string incorrect

**Fix:**
1. Check Railway database status (should be "Active")
2. Verify `DATABASE_URL` is set in service variables
3. Check Railway logs for connection errors

---

### Schema Errors on Startup

**Cause:** Database schema mismatch or migration issues

**Fix:**
1. Drop and recreate tables:
   ```sql
   DROP TABLE IF EXISTS work_orders CASCADE;
   DROP TABLE IF EXISTS vehicles CASCADE;
   ```
2. Redeploy - schema will be recreated automatically

**Or use Railway's database dashboard:**
1. Go to PostgreSQL service → "Data" tab
2. Run queries directly in the SQL console

---

### Slow Queries

**Cause:** Missing indexes or inefficient queries

**Current Indexes:**
- `idx_work_orders_vehicle` on `vehicle_id`
- `idx_work_orders_status` on `status`
- `idx_vehicles_status` on `status`

**Check query performance:**
```sql
EXPLAIN ANALYZE SELECT * FROM vehicles WHERE status = 'active';
```

---

## Database Management

### Access Database Console

**Via Railway Dashboard:**
1. Go to PostgreSQL service
2. Click "Data" tab
3. Run SQL queries directly

**Via CLI:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and link project
railway login
railway link

# Connect to database
railway connect postgres
```

### Backup Database

Railway provides automatic backups, but you can also:

```bash
# Export via Railway CLI
railway run pg_dump > backup.sql

# Restore
railway run psql < backup.sql
```

---

## Connection Pooling

The app uses `pg.Pool` for efficient connection management:

```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // Required for Railway
});
```

**Default Pool Settings:**
- Max connections: 10 (pg default)
- Idle timeout: 10 seconds
- Connection timeout: 0 (no timeout)

---

## Migration from SQLite

If you have existing SQLite data, it won't be automatically migrated to PostgreSQL.

**To preserve data:**
1. Export from SQLite before migration:
   ```bash
   # Backup JSON files
   cp vehicles.json vehicles.backup.json
   cp work-orders.json work-orders.backup.json
   ```

2. After PostgreSQL deployment, manually import via API:
   ```bash
   # For each vehicle/work order, POST to the API
   curl -X POST https://your-service.railway.app/api/vehicles \
     -H "Content-Type: application/json" \
     -d @vehicle.json
   ```

Or use a migration script (not included).

---

## Production Checklist

Before going live:

- [x] PostgreSQL database added to Railway
- [x] DATABASE_URL environment variable set
- [x] Schema initialization working
- [x] Seed data created
- [x] Health check passing
- [ ] Add authentication (currently none)
- [ ] Add rate limiting
- [ ] Monitor database size (Railway limits vary by plan)
- [ ] Set up alerts for connection errors

---

## Cost

**Railway PostgreSQL Pricing:**
- **Free tier:** Shared database (limited)
- **Paid tier:** Starting at $5/month for dedicated database
- Check current Railway pricing: https://railway.app/pricing

---

## Support

If you encounter issues:
1. Check Railway deployment logs
2. Check PostgreSQL service logs
3. Verify DATABASE_URL format: `postgresql://user:pass@host:port/db`
4. Test health endpoint: `/health` should return 200 OK

For Railway-specific help:
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
