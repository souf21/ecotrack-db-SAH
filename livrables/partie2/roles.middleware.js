const supabase = require('../config/supabase');

/**
 * Middleware RBAC - Vérifie que l'utilisateur a le rôle requis
 * 
 * Utilisation dans les routes :
 *   router.delete('/:id', authMiddleware, rolesMiddleware('admin'), controller.delete)
 * 
 * @param {string} requiredRole - Le rôle requis ex: 'admin', 'manager', 'collector', 'analyst'
 */
module.exports = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // Vérifie que auth.middleware a bien été appelé avant
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

      // Récupère tous les rôles du user depuis Supabase
      const { data, error } = await supabase
        .from('user_role')
        .select('role(nom)')
        .eq('id_user', req.user.id);

      if (error) throw error;

      // Transforme en tableau simple : [{ role: { nom: 'admin' } }] → ['admin']
      const roles = data.map(r => r.role.nom);

      // Vérifie que le user possède le rôle requis
      if (!roles.includes(requiredRole)) {
        return res.status(403).json({
          error: 'Accès refusé',
          role_requis: requiredRole,
          roles_utilisateur: roles
        });
      }

      // Rôle OK → on passe à la suite
      next();

    } catch (err) {
      console.error('[ROLES] Erreur middleware:', err.message);
      res.status(500).json({
        error: 'Erreur lors de la vérification des rôles'
      });
    }
  };
};