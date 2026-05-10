require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`[service-iot] running on port ${PORT}`);
  console.log(`[service-iot] env: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[service-iot] alert threshold: ${process.env.FILL_ALERT_THRESHOLD || 80}%`);
});
