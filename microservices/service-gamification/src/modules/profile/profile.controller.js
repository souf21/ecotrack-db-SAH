const repo = require('./profile.repository');

const getMyProfile = async (req, res, next) => {
  try {
    const data = await repo.getProfile(req.user.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const data  = await repo.getLeaderboard(limit);
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

module.exports = { getMyProfile, getLeaderboard };
