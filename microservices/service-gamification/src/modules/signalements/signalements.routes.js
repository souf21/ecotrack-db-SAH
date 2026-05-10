const router   = require('express').Router();
const ctrl     = require('./signalements.controller');
const auth     = require('../../middlewares/auth.middleware');
const roles    = require('../../middlewares/roles.middleware');
const validate = require('../../middlewares/validate.middleware');
const { signalementSchema, statusSchema } = require('./signalements.validation');

router.post('/',             auth, roles('citoyen'),                       validate(signalementSchema), ctrl.create);
router.get('/mine',          auth, roles('citoyen'),                       ctrl.getMine);
router.get('/',              auth, roles(['gestionnaire', 'agent']),        ctrl.getAll);
router.get('/:id',           auth,                                          ctrl.getById);
router.patch('/:id/status',  auth, roles(['gestionnaire', 'agent']),        validate(statusSchema), ctrl.updateStatus);

module.exports = router;
