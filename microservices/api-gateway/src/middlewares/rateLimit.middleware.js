const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Trop de requêtes. Réessayez dans une minute.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter limit for login/register to block brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { generalLimiter, authLimiter };
