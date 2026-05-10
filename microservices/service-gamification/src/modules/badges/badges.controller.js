const repo = require('./badges.repository');

const getAll = async (req, res, next) => {
  try {
    const data = await repo.findAll();
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

const getMine = async (req, res, next) => {
  try {
    const data = await repo.findByUser(req.user.id);
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

const getByUser = async (req, res, next) => {
  try {
    const data = await repo.findByUser(req.params.userId);
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = await repo.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = { getAll, getMine, getByUser, create };
