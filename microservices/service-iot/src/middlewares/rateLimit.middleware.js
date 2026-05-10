const rateLimit = require('express-rate-limit');

// Ingest can be high-frequency — 1000 readings/min per IP
const ingestLimiter = rateLimit({
  windowMs: 60 * 1000, max: 1000,
  message: { error: 'Trop de mesures. Réessayez dans une minute.' },
  standardHeaders: true, legacyHeaders: false
});

// General API calls — 100/min
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, max: 100,
  message: { error: 'Trop de requêtes. Réessayez dans une minute.' },
  standardHeaders: true, legacyHeaders: false
});

module.exports = { ingestLimiter, generalLimiter };
