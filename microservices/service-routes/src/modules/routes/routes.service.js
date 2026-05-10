const repo = require('./routes.repository');
const { NotFoundError, ForbiddenError } = require('../../errors/AppError');

// Which status changes each role can trigger
const STATUS_TRANSITIONS = {
  gestionnaire: {
    planifiée: ['en_cours', 'annulée'],
    en_cours:  ['terminée', 'annulée'],
    terminée:  [],
    annulée:   []
  },
  agent: {
    planifiée: ['en_cours'],
    en_cours:  ['terminée']
  }
};

const getAll = async (user, filters = {}) => {
  if (user.role === 'agent') return repo.findByAgentId(user.id, filters);
  return repo.findAll(filters);
};

const getById = async (id, user) => {
  const tournee = await repo.findById(id);
  if (!tournee) throw new NotFoundError(`Tournée ${id} introuvable`);

  if (user.role === 'agent') {
    const assigned = tournee.realise.some(r => r.id_user === user.id);
    if (!assigned) throw new ForbiddenError('Cette tournée ne vous est pas assignée');
  }

  return tournee;
};

const create = async (data) => {
  if (data.stops?.length) {
    const supabase = require('../../config/supabase');
    const ids = data.stops.map(s => s.id_conteneur);
    const { data: found } = await supabase.from('conteneur').select('id_conteneur').in('id_conteneur', ids);
    const foundIds = (found || []).map(c => c.id_conteneur);
    const missing  = ids.filter(id => !foundIds.includes(id));
    if (missing.length) {
      throw new NotFoundError(`Conteneur(s) introuvable(s) : ${missing.join(', ')}`);
    }
  }
  return repo.create(data);
};

const update = async (id, data) => {
  const tournee = await repo.findById(id);
  if (!tournee) throw new NotFoundError(`Tournée ${id} introuvable`);
  if (tournee.statut === 'terminée') throw new ForbiddenError('Une tournée terminée ne peut pas être modifiée');
  return repo.update(id, data);
};

const updateStatus = async (id, statut, user) => {
  const tournee = await repo.findById(id);
  if (!tournee) throw new NotFoundError(`Tournée ${id} introuvable`);

  const allowed = STATUS_TRANSITIONS[user.role]?.[tournee.statut] ?? [];
  if (!allowed.includes(statut)) {
    throw new ForbiddenError(
      `Transition "${tournee.statut}" → "${statut}" non autorisée pour le rôle ${user.role}`
    );
  }

  const updated = await repo.updateStatus(id, statut);

  // When a collection round finishes, reset every bin it visited back to 0%
  if (statut === 'terminée') {
    const containerIds = (tournee.etape_tournee || [])
      .map(e => e.conteneur?.id_conteneur)
      .filter(Boolean);

    if (containerIds.length) {
      const iotUrl = process.env.SERVICE_IOT_URL || 'http://localhost:5004';
      const iotKey = process.env.IOT_API_KEY     || 'dev-iot-key-ecotrack';
      fetch(`${iotUrl}/api/iot/containers/reset`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': iotKey },
        body:    JSON.stringify({ container_ids: containerIds })
      }).catch(err => console.error('[service-routes] IoT bin reset failed:', err.message));
    }
  }

  return updated;
};

const remove = async (id) => {
  const tournee = await repo.findById(id);
  if (!tournee) throw new NotFoundError(`Tournée ${id} introuvable`);
  if (tournee.statut !== 'planifiée') {
    throw new ForbiddenError('Seule une tournée planifiée peut être supprimée');
  }
  await repo.remove(id);
  return { message: `Tournée ${id} supprimée` };
};

const addStop = async (id_tournee, stopData) => {
  const tournee = await repo.findById(id_tournee);
  if (!tournee) throw new NotFoundError(`Tournée ${id_tournee} introuvable`);
  if (tournee.statut !== 'planifiée') {
    throw new ForbiddenError('Impossible de modifier les étapes d\'une tournée déjà démarrée');
  }
  return repo.addStop(id_tournee, stopData);
};

const removeStop = async (id_tournee, id_conteneur) => {
  const tournee = await repo.findById(id_tournee);
  if (!tournee) throw new NotFoundError(`Tournée ${id_tournee} introuvable`);
  if (tournee.statut !== 'planifiée') {
    throw new ForbiddenError('Impossible de modifier les étapes d\'une tournée déjà démarrée');
  }
  await repo.removeStop(id_tournee, id_conteneur);
  return { message: 'Étape supprimée' };
};

const addAgent = async (id_tournee, id_user) => {
  const tournee = await repo.findById(id_tournee);
  if (!tournee) throw new NotFoundError(`Tournée ${id_tournee} introuvable`);
  await repo.addAgent(id_tournee, id_user);
  return repo.findById(id_tournee);
};

const removeAgent = async (id_tournee, id_user) => {
  await repo.removeAgent(id_tournee, id_user);
  return { message: 'Agent désassigné' };
};

const getTypes    = () => repo.findTypes();
const getVehicles = () => repo.findVehicles();

module.exports = {
  getAll, getById, create, update, updateStatus, remove,
  addStop, removeStop, addAgent, removeAgent, getTypes, getVehicles
};
