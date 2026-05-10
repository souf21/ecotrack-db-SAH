const repo = require('./defis.repository');
const { awardPoints } = require('../../helpers/points');
const { NotFoundError, ForbiddenError, ValidationError } = require('../../errors/AppError');

const getAll  = (filters) => repo.findAll(filters);

const getById = async (id) => {
  const defi = await repo.findById(id);
  if (!defi) throw new NotFoundError(`Défi ${id} introuvable`);
  return defi;
};

const create = (data) => repo.create(data);

const update = async (id, data) => {
  if (!await repo.findById(id)) throw new NotFoundError(`Défi ${id} introuvable`);
  return repo.update(id, data);
};

const remove = async (id) => {
  if (!await repo.findById(id)) throw new NotFoundError(`Défi ${id} introuvable`);
  await repo.remove(id);
  return { message: `Défi ${id} supprimé` };
};

const join = async (id_defi, id_user) => {
  const defi = await repo.findById(id_defi);
  if (!defi)                  throw new NotFoundError(`Défi ${id_defi} introuvable`);
  if (defi.statut !== 'actif') throw new ForbiddenError('Ce défi n\'est plus actif');
  if (await repo.isJoined(id_defi, id_user)) throw new ValidationError('Vous participez déjà à ce défi');
  return repo.join(id_defi, id_user);
};

const complete = async (id_defi) => {
  const defi = await repo.findById(id_defi);
  if (!defi) throw new NotFoundError(`Défi ${id_defi} introuvable`);
  const updated      = await repo.update(id_defi, { statut: 'terminé' });
  const participants = await repo.findParticipants(id_defi);
  if (defi.points_recompense > 0) {
    await Promise.all(participants.map(p => awardPoints(p.id_user, defi.points_recompense)));
  }
  return { ...updated, awarded_to: participants.length };
};

module.exports = { getAll, getById, create, update, remove, join, complete };
