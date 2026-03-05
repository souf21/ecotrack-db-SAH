// src/middlewares/cache.middleware.js
// Cache Redis — stocke les réponses pour éviter des requêtes inutiles à Supabase
const redis = require('../config/redis');

// cache(ttl) — middleware qui met en cache la réponse pendant ttl secondes
const cache = (ttl = 3600) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;

    try {
      // Vérifie si la donnée est déjà dans Redis
      const cached = await redis.get(key);

      if (cached) {
        // Donnée trouvée dans le cache → retourne directement sans toucher Supabase
        console.log(`[CACHE] Hit pour ${key}`);
        return res.status(200).json(JSON.parse(cached));
      }

      // Donnée pas dans le cache → on laisse passer la requête
      // On intercepte res.json pour stocker la réponse dans Redis
      console.log(`[CACHE] Miss pour ${key}`);
      const originalJson = res.json.bind(res);

      res.json = async (data) => {
        // Stocke la réponse dans Redis avec une expiration
        await redis.setex(key, ttl, JSON.stringify(data));
        return originalJson(data);
      };

      next();
    } catch (err) {
      // Si Redis est down, on continue sans cache
      console.error('[CACHE] Erreur Redis:', err.message);
      next();
    }
  };
};

// Invalide le cache pour une URL donnée
const invalidateCache = async (pattern) => {
  try {
    const keys = await redis.keys(`cache:${pattern}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[CACHE] Invalidé : ${keys.length} clé(s) supprimée(s)`);
    }
  } catch (err) {
    console.error('[CACHE] Erreur invalidation:', err.message);
  }
};

module.exports = { cache, invalidateCache };