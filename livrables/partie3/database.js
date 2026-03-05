// src/config/database.js
// Monitoring du pool de connexions Supabase
const supabase = require('./supabase');
const logger = require('./logger');

// Formule pool : 6 workers × 10 connexions = 60 connexions max
const POOL_CONFIG = {
  workers: 6,
  connectionsPerWorker: 10,
  maxConnections: 60,
  idleTimeoutMs: 30000
};

logger.info('Pool configuré', POOL_CONFIG);

// Monitoring — vérifie la connexion toutes les 30 secondes
setInterval(async () => {
  try {
    const start = Date.now();
    await supabase.from('conteneur').select('id_conteneur').limit(1);
    const responseTime = Date.now() - start;

    logger.debug('Pool DB status', {
      responseTime: `${responseTime}ms`,
      status: responseTime < 100 ? 'healthy' : 'slow',
      totalConnections: POOL_CONFIG.maxConnections,
    });
  } catch (err) {
    logger.error('Pool DB error', { error: err.message });
  }
}, 30000);

module.exports = supabase;