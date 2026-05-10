require('dotenv').config();
const app    = require('./app');
const logger = require('./config/logger');
const PORT   = process.env.PORT || 5005;

app.listen(PORT, () => logger.info(`[service-gamification] running on port ${PORT}`));
