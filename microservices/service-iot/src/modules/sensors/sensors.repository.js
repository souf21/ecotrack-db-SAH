const supabase = require('../../config/supabase');

const SENSOR_SELECT = `
  id_capteur, reference, type, statut, date_installation, created_at,
  conteneur (id_conteneur, reference, adresse, zone(nom_zone))
`;

const findAll = async (filters = {}) => {
  let q = supabase.from('capteur').select(SENSOR_SELECT).order('reference');
  if (filters.id_conteneur) q = q.eq('id_conteneur', filters.id_conteneur);
  if (filters.type)         q = q.eq('type', filters.type);
  if (filters.statut)       q = q.eq('statut', filters.statut);
  const { data, error } = await q;
  if (error) throw error;
  return data;
};

const findById = async (id) => {
  const { data, error } = await supabase
    .from('capteur').select(SENSOR_SELECT).eq('id_capteur', id).single();
  if (error && error.code === 'PGRST116') return null;
  if (error) throw error;
  return data;
};

const create = async (sensorData) => {
  const { data, error } = await supabase
    .from('capteur').insert(sensorData).select().single();
  if (error) throw error;
  return data;
};

const update = async (id, sensorData) => {
  const { data, error } = await supabase
    .from('capteur')
    .update({ ...sensorData, updated_at: new Date().toISOString() })
    .eq('id_capteur', id).select().single();
  if (error) throw error;
  return data;
};

module.exports = { findAll, findById, create, update };
