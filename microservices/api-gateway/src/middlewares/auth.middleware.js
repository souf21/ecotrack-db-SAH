const supabase = require('../config/supabase');

// Verifies the JWT from the Authorization header.
// On success, injects X-User-Id and X-User-Email headers so downstream
// services can identify the caller without re-verifying the token.
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Token invalide' });
    }

    req.headers['x-user-id'] = data.user.id;
    req.headers['x-user-email'] = data.user.email;
    next();
  } catch (err) {
    console.error('[api-gateway] auth error:', err.message);
    res.status(401).json({ error: 'Authentification échouée' });
  }
};
