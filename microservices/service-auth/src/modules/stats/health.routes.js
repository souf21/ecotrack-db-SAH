const express = require('express');
const router = express.Router();
const supabase = require('../../config/supabase');

router.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'service-auth', uptime: process.uptime() });
});

router.get('/db', async (req, res) => {
  try {
    const { error } = await supabase.from('user').select('id_user').limit(1);
    if (error) throw error;
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', database: err.message });
  }
});

module.exports = router;
