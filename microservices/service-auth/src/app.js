const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { generalLimiter, authLimiter } = require('./middlewares/rateLimit.middleware');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('combined'));
app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.get('/ping', (req, res) => {
  res.json({ status: 'ok', service: 'service-auth' });
});

const authRoutes = require('./modules/users/users.routes');
const healthRoutes = require('./modules/stats/health.routes');

app.use('/api/auth', authRoutes);
app.use('/health', healthRoutes);

app.use((err, req, res, next) => {
  console.error(`[service-auth] ${err.message}`);
  res.status(err.status || 500).json({ error: err.message || 'Erreur interne' });
});

module.exports = app;
