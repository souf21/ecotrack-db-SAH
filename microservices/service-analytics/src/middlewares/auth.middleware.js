const supabase = require('../config/supabase');

module.exports = async (req, res, next) => {
  const userId    = req.headers['x-user-id'];
  const userEmail = req.headers['x-user-email'];

  if (!userId) return res.status(401).json({ error: 'Non authentifié' });

  try {
    const { data } = await supabase
      .from('user_role').select('role(nom)').eq('id_user', userId).limit(1).single();
    req.user = { id: userId, email: userEmail, role: data?.role?.nom || null };
  } catch {
    req.user = { id: userId, email: userEmail, role: null };
  }
  next();
};
