const repo = require('./sensors.repository');
const { NotFoundError } = require('../../errors/AppError');

const getAll    = (filters) => repo.findAll(filters);

const getById   = async (id) => {
  const s = await repo.findById(id);
  if (!s) throw new NotFoundError(`Capteur ${id} introuvable`);
  return s;
};

const create    = (data) => repo.create(data);

const update    = async (id, data) => {
  await getById(id);
  return repo.update(id, data);
};

module.exports = { getAll, getById, create, update };
