const routesService = require('./routes.service');

const getAll = async (req, res, next) => {
  try {
    const filters = {
      statut: req.query.statut,
      date:   req.query.date
    };
    const data = await routesService.getAll(req.user, filters);
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await routesService.getById(req.params.id, req.user);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = await routesService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await routesService.update(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const data = await routesService.updateStatus(req.params.id, req.body.statut, req.user);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const result = await routesService.remove(req.params.id);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

const addStop = async (req, res, next) => {
  try {
    const data = await routesService.addStop(req.params.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

const removeStop = async (req, res, next) => {
  try {
    const result = await routesService.removeStop(req.params.id, req.params.conteneurId);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

const addAgent = async (req, res, next) => {
  try {
    const data = await routesService.addAgent(req.params.id, req.body.id_user);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

const removeAgent = async (req, res, next) => {
  try {
    const result = await routesService.removeAgent(req.params.id, req.params.agentId);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

const getTypes = async (req, res, next) => {
  try {
    const data = await routesService.getTypes();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getVehicles = async (req, res, next) => {
  try {
    const data = await routesService.getVehicles();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = {
  getAll, getById, create, update, updateStatus, remove,
  addStop, removeStop, addAgent, removeAgent, getTypes, getVehicles
};
