const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const rolesMiddleware = require('../../middlewares/roles.middleware');

router.post('/register', authController.register);
router.post('/login',    authController.login);
router.post('/refresh',  authController.refresh);
router.post('/logout',   authController.logout);

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const supabase = require('../../config/supabase');
    const [roleResult, profileResult] = await Promise.all([
      supabase.from('user_role').select('role(nom)').eq('id_user', req.user.id).single(),
      supabase.from('user').select('nom, prenom, point_total').eq('id_user', req.user.id).single()
    ]);
    const role = roleResult.data?.role?.nom || null;
    const profile = profileResult.data;
    res.json({
      id: req.user.id,
      email: req.user.email,
      role,
      nom: profile ? `${profile.prenom} ${profile.nom}` : req.user.email,
      points: profile?.point_total || 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Impossible de récupérer le profil' });
  }
});

router.get('/admin-only', authMiddleware, rolesMiddleware('gestionnaire'), (req, res) => {
  res.json({ message: 'Accès gestionnaire autorisé', email: req.user.email });
});

// List users by role — gestionnaire only (needed to assign agents to routes, view citizens)
router.get('/users', authMiddleware, rolesMiddleware('gestionnaire'), async (req, res) => {
  try {
    const supabase = require('../../config/supabase');
    const { role } = req.query; // ?role=agent | ?role=citoyen | (none = all)

    let q = supabase
      .from('user_role')
      .select('user:id_user(id_user, nom, prenom, email, point_total, date_inscription), role:id_role(nom)');

    if (role) q = q.eq('role.nom', role);

    const { data, error } = await q;
    if (error) throw error;

    const users = (data || [])
      .filter(r => !role || r.role?.nom === role)
      .map(r => ({ ...r.user, role: r.role?.nom }));

    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ error: 'Impossible de récupérer les utilisateurs' });
  }
});

module.exports = router;
