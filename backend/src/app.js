const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./config/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const app = express();

// --- MIDDLEWARES GLOBAUX ---
app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- LOGGING HTTP avec Morgan ---
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// --- RATE LIMITING ---
const { generalLimiter, authLimiter } = require('./middlewares/rateLimit.middleware');
app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);

// --- ROUTE DE TEST ---
app.get('/ping', (req, res) => {
  res.json({ status: 'ok', message: 'EcoTrack API fonctionne !' });
});

// --- ROUTES ---
const authRoutes = require('./modules/users/users.routes');
const binsRoutes = require('./modules/bins/bins.routes');
const healthRoutes = require('./modules/stats/health.routes');

app.use('/api/auth', authRoutes);
app.use('/api/bins', binsRoutes);
app.use('/health', healthRoutes);

// Dans app.js — ajoute après healthRoutes
const monitoringRoutes = require('./modules/stats/monitoring.routes');
app.use('/monitoring', monitoringRoutes);

// --- MIDDLEWARE ERREURS GLOBAL ---
app.use((err, req, res, next) => {
  logger.error(`${err.message}`, { stack: err.stack });
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur'
  });
});

module.exports = app;