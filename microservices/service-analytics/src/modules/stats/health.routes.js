const router   = require('express').Router();
const supabase = require('../../config/supabase');

router.get('/', async (req, res) => {
  try {
    await supabase.from('conteneur').select('id_conteneur').limit(1);
    res.json({ status: 'ok', service: 'service-analytics', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', service: 'service-analytics', database: 'disconnected' });
  }
});

module.exports = router;
