const supabase = require('../config/supabase');

/**
 * Middleware RBAC - Vérifie que l'utilisateur a au moins UN des rôles requis
 * 
 * Utilisation :
 *   - Un seul rôle : rolesMiddleware('admin')
 *   - Plusieurs rôles (OU) : rolesMiddleware(['admin', 'manager'])
 * 
 * @param {string|string[]} requiredRoles - Rôle(s) requis
 */
module.exports = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

      const { data, error } = await supabase
        .from('user_role')
        .select('role(nom)')
        .eq('id_user', req.user.id);

      if (error) throw error;

      const userRoles = data.map(r => r.role.nom);

      // Normalise en tableau si c'est une string seule
      const required = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

      // Vérifie si l'utilisateur a au moins UN des rôles requis
      const hasAccess = required.some(role => userRoles.includes(role));

      if (!hasAccess) {
        return res.status(403).json({
          error: 'Accès refusé',
          role_requis: required,
          roles_utilisateur: userRoles
        });
      }

      next();

    } catch (err) {
      console.error('[ROLES] Erreur middleware:', err.message);
      res.status(500).json({
        error: 'Erreur lors de la vérification des rôles'
      });
    }
  };
};