const supabase = require('../../config/supabase');

const BASE_SELECT = 'id_signalement, type, description, statut, photo_url, date_signalement, id_conteneur, id_user, created_at, updated_at';

const insert = async ({ type, description, photo_url, id_conteneur, id_user }) => {
  const { data, error } = await supabase
    .from('signalement')
    .insert({ type, description, photo_url, id_conteneur, id_user })
    .select(BASE_SELECT).single();
  if (error) throw error;
  return data;
};

const findAll = async ({ statut, limit = 50 } = {}) => {
  let q = supabase
    .from('signalement')
    .select(`${BASE_SELECT}, user:id_user(nom, prenom, email), conteneur:id_conteneur(reference, adresse)`)
    .order('date_signalement', { ascending: false })
    .limit(parseInt(limit));
  if (statut) q = q.eq('statut', statut);
  const { data, error } = await q;
  if (error) throw error;
  return data;
};

const findByUser = async (id_user, { statut, limit = 50 } = {}) => {
  let q = supabase
    .from('signalement')
    .select(BASE_SELECT)
    .eq('id_user', id_user)
    .order('date_signalement', { ascending: false })
    .limit(parseInt(limit));
  if (statut) q = q.eq('statut', statut);
  const { data, error } = await q;
  if (error) throw error;
  return data;
};

const findById = async (id) => {
  const { data } = await supabase
    .from('signalement')
    .select(`${BASE_SELECT}, user:id_user(nom, prenom, email)`)
    .eq('id_signalement', id).single();
  return data || null;
};

const updateStatus = async (id, statut) => {
  const { data, error } = await supabase
    .from('signalement')
    .update({ statut })
    .eq('id_signalement', id)
    .select(BASE_SELECT).single();
  if (error) throw error;
  return data;
};

module.exports = { insert, findAll, findByUser, findById, updateStatus };
