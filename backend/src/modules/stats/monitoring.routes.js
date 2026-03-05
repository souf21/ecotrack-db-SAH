// src/modules/stats/monitoring.routes.js
// Monitoring APM simple — métriques en temps réel

const express = require('express');
const router = express.Router();
const redis = require('../../config/redis');
const os = require('os');

// GET /monitoring — métriques système en temps réel
router.get('/', async (req, res) => {
  try {
    // Métriques système
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    // Test Redis
    const redisStart = Date.now();
    await redis.ping();
    const redisLatency = Date.now() - redisStart;

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),

      // Serveur
      server: {
        uptime: `${Math.floor(process.uptime())}s`,
        nodeVersion: process.version,
        platform: os.platform(),
        cpus: os.cpus().length
      },

      // Mémoire
      memory: {
        total: `${Math.round(totalMem / 1024 / 1024)}MB`,
        used: `${Math.round(usedMem / 1024 / 1024)}MB`,
        free: `${Math.round(freeMem / 1024 / 1024)}MB`,
        usagePercent: `${Math.round((usedMem / totalMem) * 100)}%`
      },

      // Redis
      redis: {
        status: 'connected',
        latency: `${redisLatency}ms`
      },

      // Process Node.js
      process: {
        pid: process.pid,
        memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

module.exports = router;