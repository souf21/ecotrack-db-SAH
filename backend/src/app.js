const express = require('express');
const app = express();

app.use(express.json());

// Test ping
app.get('/ping', (req, res) => res.send('pong'));

// Import des routes
const authRoutes = require('./modules/users/users.routes');
app.use('/api/auth', authRoutes);

module.exports = app;
