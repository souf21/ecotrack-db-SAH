// backend/src/modules/users/users.routes.js

/*const express = require('express');
const router = express.Router();

// Importe le controller (doit être dans le même dossier)
const authController = require('./auth.controller');

// Routes d'authentification - ON PASSE LA FONCTION, SANS ()
// Pas de parenthèses ! On passe juste le nom de la fonction
router.post('/register', authController.register);
router.post('/login',    authController.login);
router.post('/refresh',  authController.refresh);

// Route de test (sans protection pour l'instant)
/*router.get('/me', (req, res) => {
  res.json({ message: "Route test OK - ajoute le middleware auth après" });
});*/

/*const authMiddleware = require('../../middlewares/auth.middleware');

router.get('/me', authMiddleware, (req, res) => {
  res.json({ message: "Tu es connecté !", user: req.user });
});
const authMiddleware = require('../middlewares/auth.middleware'); // chemin correct

router.get('/me', authMiddleware, (req, res) => {
  res.json({
    message: "Tu es connecté !",
    user: req.user // infos du user via token
  });
});


module.exports = router;
*/
// backend/src/users/users.routes.js
const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware'); // 2 niveaux pour remonter

// Route /me protégée
router.get('/me', authMiddleware, (req, res) => {
    res.json({
        message: "Tu es connecté !",
        user: req.user // <-- infos du user récupérées via le token
    });
});

// Routes Auth restantes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

module.exports = router;
