const express  = require('express');
const router   = express.Router();
const supabase = require('../../config/supabase');

router.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'service-iot', uptime: process.uptime() });
});

router.get('/db', async (req, res) => {
  try {
    const { error } = await supabase.from('capteur').select('id_capteur').limit(1);
    if (error) throw error;
    res.json({ status: 'ok', database: 'Supabase connecté' });
  } catch (err) {
    res.status(503).json({ status: 'error', database: err.message });
  }
});

module.exports = router;
