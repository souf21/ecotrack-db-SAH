// src/modules/bins/bins.controller.js
// COUCHE CONTROLLER : lien entre HTTP et Service

const binsService = require('./bins.service');

// GET /api/conteneurs
const getAll = async (req, res, next) => {
  try {
    const filters = {
      id_zone: req.query.id_zone,
      etat: req.query.etat,
      id_type_dechets: req.query.id_type_dechets
    };
    const data = await binsService.getAllBins(filters);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/conteneurs/:id
const getById = async (req, res, next) => {
  try {
    const data = await binsService.getBinById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/conteneurs
const create = async (req, res, next) => {
  try {
    const data = await binsService.createBin(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PUT /api/conteneurs/:id
const update = async (req, res, next) => {
  try {
    const data = await binsService.updateBin(req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/conteneurs/:id
const remove = async (req, res, next) => {
  try {
    const result = await binsService.deleteBin(req.params.id);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };