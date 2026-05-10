require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`[service-containers] running on port ${PORT}`);
  console.log(`[service-containers] env: ${process.env.NODE_ENV || 'development'}`);
});
