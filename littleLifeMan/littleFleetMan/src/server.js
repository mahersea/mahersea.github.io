const express = require('express');
const path = require('path');
const { initialize, closeDatabase } = require('./db/database');

const vehicleRoutes = require('./routes/vehicles');
const workOrderRoutes = require('./routes/workOrders');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3011;

function getRequestId(req) {
  const headerId = req.headers['x-request-id'];
  if (Array.isArray(headerId)) {
    return headerId[0];
  }
  return headerId || '-';
}

app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  const requestId = getRequestId(req);

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(
      `[http] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(1)}ms req_id=${requestId}`
    );
  });

  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/work-orders', workOrderRoutes);
app.use('/api/health', healthRoutes);
app.use('/health', healthRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Unexpected server error.', message: err.message });
});

console.log('Starting littleFleetMan...');
console.log(`Node version: ${process.version}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`PORT: ${PORT}`);

async function startServer() {
  try {
    await initialize();

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ littleFleetMan is running on http://0.0.0.0:${PORT}`);
      console.log(`✓ Health check available at http://0.0.0.0:${PORT}/health`);
      console.log(`✓ API available at http://0.0.0.0:${PORT}/api`);
    });

    server.on('error', (err) => {
      console.error('Server error:', err);
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      }
      process.exit(1);
    });

    process.on('uncaughtException', async (err) => {
      console.error('Uncaught exception:', err);
      await closeDatabase();
      server.close(() => process.exit(1));
    });

    process.on('unhandledRejection', async (reason, promise) => {
      console.error('Unhandled rejection at:', promise, 'reason:', reason);
      await closeDatabase();
      server.close(() => process.exit(1));
    });

    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM, shutting down gracefully...');
      await closeDatabase();
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('Received SIGINT, shutting down gracefully...');
      await closeDatabase();
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
