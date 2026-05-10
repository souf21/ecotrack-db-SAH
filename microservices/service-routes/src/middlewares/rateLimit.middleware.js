const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, error: 'Trop de requêtes. Réessayez dans une minute.' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { generalLimiter };
