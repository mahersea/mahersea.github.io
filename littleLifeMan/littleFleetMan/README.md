# littleFleetMan

Vehicle-first little manager app.

## Features
- Vehicle CRUD
- Work order CRUD
- Dashboard metrics (vehicle counts + open orders)
- Safe vehicle deletion (blocks when open work orders exist unless force delete)

## Data Files
- `vehicles.json`
- `work-orders.json`

## Run
From repo root:

```bash
node littleLifeMan/littleFleetMan/server.js
```

Then open:
- `http://localhost:3011/`

## Railway Deploy

**Quick Deploy:**
1. Connect GitHub repo to Railway
2. Set service root directory to `littleLifeMan/littleFleetMan`
3. Railway will auto-detect the Dockerfile and deploy
4. Optional: Add Railway Volume at `/data` and set `DATA_DIR=/data` for persistence

**For detailed deployment instructions, troubleshooting, and production setup, see [RAILWAY.md](./RAILWAY.md)**

## API
### Vehicles
- `GET /api/vehicles`
- `GET /api/vehicles/:id`
- `POST /api/vehicles`
- `PUT /api/vehicles/:id`
- `DELETE /api/vehicles/:id`
- `DELETE /api/vehicles/:id?force=true`

### Work Orders
- `GET /api/work-orders`
- `GET /api/work-orders?vehicleId=1`
- `GET /api/vehicles/:id/work-orders`
- `POST /api/work-orders`
- `PUT /api/work-orders/:id`
- `DELETE /api/work-orders/:id`

## Vehicle Payload
```json
{
  "name": "Sprinter Van 01",
  "type": "Van",
  "vin": "W1Y4EBHY7NT000001",
  "licensePlate": "FLT-201",
  "status": "active",
  "odometer": 124500,
  "lastServiceDate": "2026-02-21",
  "notes": "Primary delivery vehicle"
}
```

## Work Order Payload
```json
{
  "vehicleId": 1,
  "title": "Oil change",
  "description": "Use synthetic oil",
  "dueDate": "2026-03-10",
  "status": "open"
}
```
