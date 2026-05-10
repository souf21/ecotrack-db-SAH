const express    = require('express');
const cors       = require('cors');
const morgan     = require('morgan');
const logger     = require('./config/logger');
const swaggerUi  = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
const { generalLimiter } = require('./middlewares/rateLimit.middleware');

app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use('/api/', generalLimiter);

app.get('/ping', (req, res) => res.json({ status: 'ok', service: 'service-iot' }));

// Container-level endpoints (grouped here for clean URLs)
const auth          = require('./middlewares/auth.middleware');
const authOrApiKey  = require('./middlewares/authOrApiKey.middleware');
const apiKey        = require('./middlewares/apiKey.middleware');
const readingsCtrl  = require('./modules/readings/readings.controller');
// latest is readable by JWT users AND the simulator (API key)
app.get('/api/iot/containers/:conteneurId/latest',  authOrApiKey, readingsCtrl.getLatestByContainer);
app.get('/api/iot/alerts',                          auth,         readingsCtrl.getAlerts);
// Reset bins — service-routes calls this when a tournée is marked terminée
app.post('/api/iot/containers/reset',               apiKey,       readingsCtrl.resetContainers);

app.use('/api/iot/sensors',  require('./modules/sensors/sensors.routes'));
app.use('/api/iot/readings', require('./modules/readings/readings.routes'));
app.use('/health',           require('./modules/stats/health.routes'));

app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(err.status || 500).json({ error: err.message || 'Erreur interne' });
});

module.exports = app;
