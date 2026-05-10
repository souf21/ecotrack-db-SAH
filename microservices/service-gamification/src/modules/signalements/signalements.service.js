const repo = require('./signalements.repository');
const { awardPoints, checkSignalementBadges } = require('../../helpers/points');
const { NotFoundError } = require('../../errors/AppError');

const POINTS_SOUMIS = () => parseInt(process.env.POINTS_SIGNALEMENT_SOUMIS || '10');
const POINTS_TRAITE = () => parseInt(process.env.POINTS_SIGNALEMENT_TRAITE || '20');

const create = async (data, userId) => {
  const signalement = await repo.insert({ ...data, id_user: userId });
  await awardPoints(userId, POINTS_SOUMIS());
  await checkSignalementBadges(userId);
  return signalement;
};

const getAll    = (filters)        => repo.findAll(filters);
const getMine   = (userId, filters) => repo.findByUser(userId, filters);

const getById = async (id) => {
  const s = await repo.findById(id);
  if (!s) throw new NotFoundError(`Signalement ${id} introuvable`);
  return s;
};

const updateStatus = async (id, statut) => {
  const existing = await repo.findById(id);
  if (!existing) throw new NotFoundError(`Signalement ${id} introuvable`);
  const updated = await repo.updateStatus(id, statut);
  if (statut === 'traité') await awardPoints(existing.id_user, POINTS_TRAITE());
  return updated;
};

module.exports = { create, getAll, getMine, getById, updateStatus };
