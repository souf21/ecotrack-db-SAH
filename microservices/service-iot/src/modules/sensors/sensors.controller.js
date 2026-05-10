const service = require('./sensors.service');

const getAll   = async (req, res, next) => {
  try {
    const filters = { id_conteneur: req.query.id_conteneur, type: req.query.type, statut: req.query.statut };
    res.json({ success: true, data: await service.getAll(filters) });
  } catch (err) { next(err); }
};

const getById  = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getById(req.params.id) }); }
  catch (err) { next(err); }
};

const create   = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await service.create(req.body) }); }
  catch (err) { next(err); }
};

const update   = async (req, res, next) => {
  try { res.json({ success: true, data: await service.update(req.params.id, req.body) }); }
  catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update };
