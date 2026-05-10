require('dotenv').config();
const app    = require('./app');
const logger = require('./config/logger');
const PORT   = process.env.PORT || 5006;

app.listen(PORT, () => logger.info(`[service-analytics] running on port ${PORT}`));
