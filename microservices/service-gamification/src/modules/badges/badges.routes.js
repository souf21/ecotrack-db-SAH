const router = require('express').Router();
const ctrl   = require('./badges.controller');
const auth   = require('../../middlewares/auth.middleware');
const roles  = require('../../middlewares/roles.middleware');

router.get('/',           auth,                          ctrl.getAll);
router.post('/',          auth, roles('gestionnaire'),    ctrl.create);
router.get('/mine',       auth, roles('citoyen'),         ctrl.getMine);
router.get('/:userId',    auth, roles(['gestionnaire', 'agent']), ctrl.getByUser);

module.exports = router;
