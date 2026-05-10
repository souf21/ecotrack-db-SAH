require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
  console.log(`[api-gateway] running on port ${PORT}`);
  console.log(`[api-gateway] service-auth  → ${process.env.SERVICE_AUTH_URL}`);
  console.log(`[api-gateway] service-containers → ${process.env.SERVICE_CONTAINERS_URL}`);
});
