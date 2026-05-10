const router = require('express').Router();
const ctrl   = require('./profile.controller');
const auth   = require('../../middlewares/auth.middleware');

router.get('/',            auth, ctrl.getMyProfile);
router.get('/leaderboard', auth, ctrl.getLeaderboard);

module.exports = router;
