require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`[service-routes] running on port ${PORT}`);
  console.log(`[service-routes] env: ${process.env.NODE_ENV || 'development'}`);
});
