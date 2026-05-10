const repo = require('./analytics.repository');

const overview = async (req, res, next) => {
  try {
    const data = await repo.getOverview();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const fillLevels = async (req, res, next) => {
  try {
    const data = await repo.getFillLevels();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const tourneeStats = async (req, res, next) => {
  try {
    const data = await repo.getTourneeStats({ period: req.query.period });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const signalementStats = async (req, res, next) => {
  try {
    const data = await repo.getSignalementStats({ period: req.query.period });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const zoneStats = async (req, res, next) => {
  try {
    const data = await repo.getZoneStats();
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

module.exports = { overview, fillLevels, tourneeStats, signalementStats, zoneStats };
