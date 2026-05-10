// Accepts either an IoT API key (X-Api-Key) or a gateway-injected user id (x-user-id).
// Used on query endpoints that the simulator also needs to read from.
module.exports = (req, res, next) => {
  const apiKey   = req.headers['x-api-key'];
  const validKey = process.env.IOT_API_KEY || 'dev-iot-key-ecotrack';

  if (apiKey && apiKey === validKey) return next();

  if (req.headers['x-user-id']) return next();

  res.status(401).json({ error: 'Authentification requise (Bearer token ou X-Api-Key)' });
};
