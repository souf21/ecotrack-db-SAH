// src/modules/stats/health.routes.js
// Endpoints de santé — utilisés par les load balancers pour vérifier que l'API est vivante

const express = require('express');
const router = express.Router();
const supabase = require('../../config/supabase');
const redis = require('../../config/redis');

// GET /health — santé générale
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),         // secondes depuis le démarrage
    timestamp: new Date().toISOString()
  });
});

// GET /health/db — vérifie la connexion Supabase
router.get('/db', async (req, res) => {
  try {
    // Requête simple pour tester la connexion
    const { error } = await supabase.from('conteneur').select('id_conteneur').limit(1);
    if (error) throw error;

    res.status(200).json({
      status: 'ok',
      database: 'Supabase connecté'
    });
  } catch (err) {
    res.status(503).json({
      status: 'error',
      database: 'Supabase non disponible',
      error: err.message
    });
  }
});

// GET /health/redis — vérifie la connexion Redis
router.get('/redis', async (req, res) => {
  try {
    const result = await redis.ping();
    if (result !== 'PONG') throw new Error('Redis ne répond pas');

    res.status(200).json({
      status: 'ok',
      redis: 'Redis connecté'
    });
  } catch (err) {
    res.status(503).json({
      status: 'error',
      redis: 'Redis non disponible',
      error: err.message
    });
  }
});

module.exports = router;