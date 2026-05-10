const router   = require('express').Router();
const ctrl     = require('./defis.controller');
const auth     = require('../../middlewares/auth.middleware');
const roles    = require('../../middlewares/roles.middleware');
const validate = require('../../middlewares/validate.middleware');
const { defiSchema, updateDefiSchema } = require('./defis.validation');

router.get('/',                auth,                           ctrl.getAll);
router.get('/:id',             auth,                           ctrl.getById);
router.post('/',               auth, roles('gestionnaire'),     validate(defiSchema),       ctrl.create);
router.put('/:id',             auth, roles('gestionnaire'),     validate(updateDefiSchema),  ctrl.update);
router.delete('/:id',          auth, roles('gestionnaire'),     ctrl.remove);
router.post('/:id/join',       auth, roles('citoyen'),          ctrl.join);
router.patch('/:id/complete',  auth, roles('gestionnaire'),     ctrl.complete);

module.exports = router;
