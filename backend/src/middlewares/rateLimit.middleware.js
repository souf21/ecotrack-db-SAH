// src/middlewares/rateLimit.middleware.js
// Protection contre les attaques DoS et brute-force
const rateLimit = require('express-rate-limit');

// Limite pour le LOGIN — 5 tentatives par 15 minutes
// Protège contre les attaques brute-force sur les mots de passe
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // 5 tentatives maximum
  message: {
    success: false,
    error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.'
  },
  standardHeaders: true, // retourne les infos dans les headers
  legacyHeaders: false
});

// Limite générale — 100 requêtes par minute
// Protège contre les attaques DoS basiques
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,            // 100 requêtes maximum
  message: {
    success: false,
    error: 'Trop de requêtes. Réessayez dans une minute.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Limite pour la création de mesures — 10 par minute
// Empêche le spam de données capteurs
const measurementLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,             // 10 créations maximum
  message: {
    success: false,
    error: 'Trop de mesures envoyées. Réessayez dans une minute.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { authLimiter, generalLimiter, measurementLimiter };