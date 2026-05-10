const supabase = require('../../config/supabase');

// Full select used by both findAll and findById
// "user" is a reserved word so PostgREST needs the alias syntax: user:id_user(...)
const TOURNEE_SELECT = `
  id_tournee, date, heure_debut, heure_fin, statut, created_at, updated_at,
  type_tournee (id_type_tournee, libelle),
  vehicule (matricule, marque, modele, type_vehicule, capacite),
  etape_tournee (
    ordre, heure_prevue,
    conteneur (id_conteneur, reference, adresse, latitude, longitude, etat)
  ),
  realise (
    id_user,
    user:id_user (nom, prenom)
  )
`;

const findAll = async (filters = {}) => {
  let query = supabase
    .from('tournee')
    .select(TOURNEE_SELECT)
    .order('date', { ascending: false });

  if (filters.statut) query = query.eq('statut', filters.statut);
  if (filters.date)   query = query.eq('date', filters.date);
  if (filters.ids)    query = query.in('id_tournee', filters.ids);

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Returns only tournées assigned to a specific agent
const findByAgentId = async (agentId, filters = {}) => {
  const { data: assignments, error } = await supabase
    .from('realise')
    .select('id_tournee')
    .eq('id_user', agentId);

  if (error) throw error;
  if (!assignments.length) return [];

  return findAll({ ...filters, ids: assignments.map(a => a.id_tournee) });
};

const findById = async (id) => {
  const { data, error } = await supabase
    .from('tournee')
    .select(TOURNEE_SELECT)
    .eq('id_tournee', id)
    .single();

  if (error && error.code === 'PGRST116') return null; // not found
  if (error) throw error;
  return data;
};

// Creates a tournée and optionally its stops + agent assignments in one call
const create = async ({ stops = [], agents = [], ...tourneeData }) => {
  const { data: tournee, error } = await supabase
    .from('tournee')
    .insert(tourneeData)
    .select()
    .single();
  if (error) throw error;

  if (stops.length) {
    const stopsRows = stops.map((s, i) => ({
      id_tournee:   tournee.id_tournee,
      id_conteneur: s.id_conteneur,
      ordre:        s.ordre ?? i + 1,
      heure_prevue: s.heure_prevue ?? null
    }));
    const { error: se } = await supabase.from('etape_tournee').insert(stopsRows);
    if (se) throw se;
  }

  if (agents.length) {
    const agentRows = agents.map(id_user => ({ id_tournee: tournee.id_tournee, id_user }));
    const { error: ae } = await supabase.from('realise').insert(agentRows);
    if (ae) throw ae;
  }

  return findById(tournee.id_tournee);
};

const update = async (id, data) => {
  const { error } = await supabase
    .from('tournee')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id_tournee', id);
  if (error) throw error;
  return findById(id);
};

const updateStatus = async (id, statut) => {
  const { error } = await supabase
    .from('tournee')
    .update({ statut, updated_at: new Date().toISOString() })
    .eq('id_tournee', id);
  if (error) throw error;
  return findById(id);
};

const remove = async (id) => {
  const { error } = await supabase.from('tournee').delete().eq('id_tournee', id);
  if (error) throw error;
};

const addStop = async (id_tournee, { id_conteneur, ordre, heure_prevue }) => {
  const { data, error } = await supabase
    .from('etape_tournee')
    .insert({ id_tournee, id_conteneur, ordre, heure_prevue })
    .select()
    .single();
  if (error) throw error;
  return data;
};

const removeStop = async (id_tournee, id_conteneur) => {
  const { error } = await supabase
    .from('etape_tournee')
    .delete()
    .eq('id_tournee', id_tournee)
    .eq('id_conteneur', id_conteneur);
  if (error) throw error;
};

const addAgent = async (id_tournee, id_user) => {
  const { error } = await supabase.from('realise').insert({ id_tournee, id_user });
  if (error) throw error;
};

const removeAgent = async (id_tournee, id_user) => {
  const { error } = await supabase
    .from('realise')
    .delete()
    .eq('id_tournee', id_tournee)
    .eq('id_user', id_user);
  if (error) throw error;
};

const findTypes = async () => {
  const { data, error } = await supabase.from('type_tournee').select('*').order('libelle');
  if (error) throw error;
  return data;
};

const findVehicles = async () => {
  const { data, error } = await supabase
    .from('vehicule')
    .select('matricule, marque, modele, type_vehicule, capacite, id_agent, agent:id_agent(id_user, nom, prenom)')
    .order('matricule');
  if (error) throw error;
  return data;
};

module.exports = {
  findAll, findByAgentId, findById, create, update, updateStatus, remove,
  addStop, removeStop, addAgent, removeAgent, findTypes, findVehicles
};
