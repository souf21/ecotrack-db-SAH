const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const logger  = require('./config/logger');
const { generalLimiter } = require('./middlewares/rateLimit.middleware');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));
app.use('/api/', generalLimiter);

app.get('/ping', (req, res) => res.json({ status: 'ok', service: 'service-analytics' }));

app.use('/api/analytics', require('./modules/analytics/analytics.routes'));
app.use('/health',        require('./modules/stats/health.routes'));

app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(err.status || 500).json({ error: err.message || 'Erreur interne' });
});

module.exports = app;
