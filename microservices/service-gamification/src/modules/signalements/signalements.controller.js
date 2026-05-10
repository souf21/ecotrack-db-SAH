const service = require('./signalements.service');

const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body, req.user.id);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

const getAll = async (req, res, next) => {
  try {
    const data = await service.getAll(req.query);
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

const getMine = async (req, res, next) => {
  try {
    const data = await service.getMine(req.user.id, req.query);
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const data = await service.updateStatus(req.params.id, req.body.statut);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = { create, getAll, getMine, getById, updateStatus };
