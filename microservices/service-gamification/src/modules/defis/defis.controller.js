const service = require('./defis.service');

const getAll = async (req, res, next) => {
  try {
    const data = await service.getAll(req.query);
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const result = await service.remove(req.params.id);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

const join = async (req, res, next) => {
  try {
    const data = await service.join(req.params.id, req.user.id);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

const complete = async (req, res, next) => {
  try {
    const data = await service.complete(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove, join, complete };
