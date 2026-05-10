const router = require('express').Router();
const ctrl   = require('./analytics.controller');
const auth   = require('../../middlewares/auth.middleware');
const roles  = require('../../middlewares/roles.middleware');

// All analytics endpoints are gestionnaire-only
router.use(auth, roles('gestionnaire'));

router.get('/overview',      ctrl.overview);
router.get('/fill-levels',   ctrl.fillLevels);
router.get('/tournees',      ctrl.tourneeStats);
router.get('/signalements',  ctrl.signalementStats);
router.get('/zones',         ctrl.zoneStats);

module.exports = router;
