const supabase = require('../config/supabase');

/**
 * Middleware RBAC
 * @param {string} requiredRole - ex: 'admin'
 */
module.exports = (requiredRole) => {
  return async (req, res, next) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

      // Récupération des rôles du user
      const { data, error } = await supabase
        .from('user_role')
        .select('role(nom)')
        .eq('id_user', req.user.id);

      if (error) throw error;

      const roles = data.map(r => r.role.nom);

      // Vérification du rôle requis
      if (!roles.includes(requiredRole)) {
        return res.status(403).json({
          error: `Accès refusé`,
          role_requis: requiredRole,
          roles_utilisateur: roles
        });
      }

      next();
    } catch (err) {
      console.error('Roles middleware error:', err);
      res.status(500).json({
        error: 'Erreur lors de la vérification des rôles'
      });
    }
  };
};
