const supabase = require('../config/supabase');

module.exports = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user?.id) return res.status(401).json({ error: 'Utilisateur non authentifié' });

      const { data, error } = await supabase
        .from('user_role')
        .select('role(nom)')
        .eq('id_user', req.user.id);

      if (error) throw error;

      const userRoles = data.map(r => r.role.nom);
      const required  = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      const hasAccess = required.some(role => userRoles.includes(role));

      if (!hasAccess) {
        return res.status(403).json({ error: 'Accès refusé', role_requis: required, roles_utilisateur: userRoles });
      }

      // Attach role to req.user for downstream logic
      req.user.role = userRoles[0];
      next();
    } catch (err) {
      console.error('[ROLES]', err.message);
      res.status(500).json({ error: 'Erreur vérification des rôles' });
    }
  };
};
