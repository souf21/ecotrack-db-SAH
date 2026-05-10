// IoT devices authenticate with a static API key, not a user JWT.
// They send: X-Api-Key: <key> in every request.
module.exports = (req, res, next) => {
  const key      = req.headers['x-api-key'];
  const validKey = process.env.IOT_API_KEY || 'dev-iot-key-ecotrack';

  if (!key || key !== validKey) {
    return res.status(401).json({ error: 'X-Api-Key manquante ou invalide' });
  }
  next();
};
