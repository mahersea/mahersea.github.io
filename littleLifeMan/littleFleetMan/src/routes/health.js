const express = require('express');
const { healthCheck } = require('../db/database');

const router = express.Router();

router.get('/', async (req, res) => {
  const health = await healthCheck();

  if (!health.healthy) {
    return res.status(503).json({
      status: 'unhealthy',
      database: health.database,
      error: health.error,
      timestamp: new Date().toISOString()
    });
  }

  res.status(200).json({
    status: 'healthy',
    database: health.database,
    connected: health.connected,
    timestamp: new Date().toISOString()
  });
});

router.get('/simple', (req, res) => {
  res.status(200).send('ok');
});

module.exports = router;
