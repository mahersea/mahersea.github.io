const express = require('express');
const { healthCheck } = require('../db/database');

const router = express.Router();

router.get('/', (req, res) => {
  const health = healthCheck();

  if (!health.healthy) {
    return res.status(503).json({
      status: 'unhealthy',
      error: health.error,
      timestamp: new Date().toISOString()
    });
  }

  res.status(200).json({
    status: 'healthy',
    dataDir: health.dataDir,
    dbPath: health.dbPath,
    timestamp: new Date().toISOString()
  });
});

router.get('/simple', (req, res) => {
  res.status(200).send('ok');
});

module.exports = router;
