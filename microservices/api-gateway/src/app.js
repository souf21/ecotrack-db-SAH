const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { generalLimiter, authLimiter } = require('./middlewares/rateLimit.middleware');
const requireAuth = require('./middlewares/auth.middleware');

const app = express();

const AUTH_URL          = process.env.SERVICE_AUTH_URL          || 'http://localhost:5001';
const CONTAINERS_URL    = process.env.SERVICE_CONTAINERS_URL    || 'http://localhost:5002';
const ROUTES_URL        = process.env.SERVICE_ROUTES_URL        || 'http://localhost:5003';
const IOT_URL           = process.env.SERVICE_IOT_URL           || 'http://localhost:5004';
const GAMIFICATION_URL  = process.env.SERVICE_GAMIFICATION_URL  || 'http://localhost:5005';
const ANALYTICS_URL     = process.env.SERVICE_ANALYTICS_URL     || 'http://localhost:5006';

// ── Global middlewares ────────────────────────────────────────────────────────

app.use(cors());
app.use(morgan('combined'));
app.use(generalLimiter);

// ── Gateway health (handled locally, never proxied) ───────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    gateway: 'EcoTrack API Gateway',
    services: { auth: AUTH_URL, containers: CONTAINERS_URL, routes: ROUTES_URL, iot: IOT_URL, gamification: GAMIFICATION_URL, analytics: ANALYTICS_URL }
  });
});

// ── Rate limiting on sensitive auth endpoints ─────────────────────────────────
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ── Auth guard ────────────────────────────────────────────────────────────────
const PROTECTED_ROUTES = [
  { methods: ['GET'],                        path: '/api/auth/me' },
  { methods: ['GET'],                        path: '/api/auth/admin-only' },
  { methods: ['GET'],                        path: '/api/auth/users' },
  { methods: ['POST'],                       path: '/api/auth/logout' },
  { methods: ['POST'],                       path: '/api/bins' },
  { methods: ['PUT', 'DELETE'],              path: '/api/bins/' },
  { methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], path: '/api/routes' },
  // IoT query endpoints need JWT; ingest endpoints use API key (handled in service-iot)
  { methods: ['GET'], path: '/api/iot' },
  // All gamification endpoints require a logged-in user
  { methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], path: '/api/gamification' },
  // Analytics is gestionnaire-only (enforced in the service, still needs JWT)
  { methods: ['GET'], path: '/api/analytics' },
];

app.use(async (req, res, next) => {
  const match = PROTECTED_ROUTES.find(
    (r) => r.methods.includes(req.method) && req.path.startsWith(r.path)
  );
  if (match) return requireAuth(req, res, next);
  next();
});

// ── Proxy factories ───────────────────────────────────────────────────────────
// pathFilter uses a function so Express never strips the mount path —
// the full original path (e.g. /api/auth/login) reaches the target service.

app.use(
  createProxyMiddleware({
    target: AUTH_URL,
    changeOrigin: true,
    pathFilter: (path) => path.startsWith('/api/auth'),
    on: {
      error: (err, req, res) => {
        console.error('[api-gateway] service-auth unreachable:', err.message);
        res.status(503).json({ error: 'service-auth indisponible' });
      }
    }
  })
);

app.use(
  createProxyMiddleware({
    target: CONTAINERS_URL,
    changeOrigin: true,
    pathFilter: (path) => path.startsWith('/api/bins'),
    on: {
      error: (err, req, res) => {
        console.error('[api-gateway] service-containers unreachable:', err.message);
        res.status(503).json({ error: 'service-containers indisponible' });
      }
    }
  })
);

app.use(
  createProxyMiddleware({
    target: ROUTES_URL,
    changeOrigin: true,
    pathFilter: (path) => path.startsWith('/api/routes'),
    on: {
      error: (err, req, res) => {
        console.error('[api-gateway] service-routes unreachable:', err.message);
        res.status(503).json({ error: 'service-routes indisponible' });
      }
    }
  })
);

app.use(
  createProxyMiddleware({
    target: IOT_URL,
    changeOrigin: true,
    pathFilter: (path) => path.startsWith('/api/iot'),
    on: {
      error: (err, req, res) => {
        console.error('[api-gateway] service-iot unreachable:', err.message);
        res.status(503).json({ error: 'service-iot indisponible' });
      }
    }
  })
);

app.use(
  createProxyMiddleware({
    target: GAMIFICATION_URL,
    changeOrigin: true,
    pathFilter: (path) => path.startsWith('/api/gamification'),
    on: {
      error: (err, req, res) => {
        console.error('[api-gateway] service-gamification unreachable:', err.message);
        res.status(503).json({ error: 'service-gamification indisponible' });
      }
    }
  })
);

app.use(
  createProxyMiddleware({
    target: ANALYTICS_URL,
    changeOrigin: true,
    pathFilter: (path) => path.startsWith('/api/analytics'),
    on: {
      error: (err, req, res) => {
        console.error('[api-gateway] service-analytics unreachable:', err.message);
        res.status(503).json({ error: 'service-analytics indisponible' });
      }
    }
  })
);

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} introuvable` });
});

module.exports = app;
