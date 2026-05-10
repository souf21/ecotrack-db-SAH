const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  retryStrategy: (times) => {
    if (times > 10) return null;
    return Math.min(times * 200, 2000);
  }
});

redis.on('connect', () => console.log('[service-containers] Redis connected'));
redis.on('error', (err) => console.error('[service-containers] Redis error:', err.message));

module.exports = redis;
