// JWT is verified by the API Gateway.
// The gateway injects X-User-Id and X-User-Email headers before forwarding here.
// This middleware also fetches the user's role from DB so that service logic
// can use req.user.role for filtering (e.g. agents see only their own routes).
const supabase = require('../config/supabase');

module.exports = async (req, res, next) => {
  const userId    = req.headers['x-user-id'];
  const userEmail = req.headers['x-user-email'];

  if (!userId) return res.status(401).json({ error: 'Non authentifié' });

  try {
    const { data } = await supabase
      .from('user_role')
      .select('role(nom)')
      .eq('id_user', userId)
      .limit(1)
      .single();

    req.user = { id: userId, email: userEmail, role: data?.role?.nom || null };
    next();
  } catch (err) {
    // Still allow the request through without a role — downstream service will decide
    req.user = { id: userId, email: userEmail, role: null };
    next();
  }
};
