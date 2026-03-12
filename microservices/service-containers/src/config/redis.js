// src/config/redis.js
// Connexion Redis — utilisé pour le cache
const Redis = require('ioredis');

const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
  retryStrategy: (times) => {
    // Réessaye de se connecter toutes les 2 secondes max 10 fois
    if (times > 10) return null;
    return Math.min(times * 200, 2000);
  }
});

redis.on('connect', () => console.log('Redis connecté'));
redis.on('error', (err) => console.error('Redis erreur:', err.message));

module.exports = redis;