// JWT is verified by the API Gateway.
// The gateway injects X-User-Id and X-User-Email headers before forwarding here.
module.exports = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const userEmail = req.headers['x-user-email'];

  if (!userId) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  req.user = { id: userId, email: userEmail };
  next();
};
