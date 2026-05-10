const router   = require('express').Router();
const supabase = require('../../config/supabase');

router.get('/', async (req, res) => {
  try {
    await supabase.from('badge').select('id_badge').limit(1);
    res.json({ status: 'ok', service: 'service-gamification', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', service: 'service-gamification', database: 'disconnected' });
  }
});

module.exports = router;
