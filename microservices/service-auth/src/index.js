require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`[service-auth] running on port ${PORT}`);
  console.log(`[service-auth] env: ${process.env.NODE_ENV || 'development'}`);
});
