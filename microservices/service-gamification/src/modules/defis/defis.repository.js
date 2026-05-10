const supabase = require('../../config/supabase');

const DEFI_SELECT = 'id_defi, titre, description, statut, points_recompense, date_debut, date_fin, created_at, updated_at';

const findAll = async ({ statut } = {}) => {
  let q = supabase.from('defi').select(DEFI_SELECT).order('date_debut', { ascending: false });
  if (statut) q = q.eq('statut', statut);
  const { data, error } = await q;
  if (error) throw error;
  return data;
};

const findById = async (id) => {
  const { data } = await supabase
    .from('defi')
    .select(`${DEFI_SELECT}, participation_defi(id_user, progression, user:id_user(nom, prenom))`)
    .eq('id_defi', id).single();
  return data || null;
};

const create = async (data) => {
  const { data: created, error } = await supabase
    .from('defi').insert(data).select(DEFI_SELECT).single();
  if (error) throw error;
  return created;
};

const update = async (id, data) => {
  const { data: updated, error } = await supabase
    .from('defi').update(data).eq('id_defi', id).select(DEFI_SELECT).single();
  if (error) throw error;
  return updated;
};

const remove = async (id) => {
  const { error } = await supabase.from('defi').delete().eq('id_defi', id);
  if (error) throw error;
};

const join = async (id_defi, id_user) => {
  const { data, error } = await supabase
    .from('participation_defi')
    .insert({ id_user, id_defi, progression: 0 })
    .select().single();
  if (error) throw error;
  return data;
};

const isJoined = async (id_defi, id_user) => {
  const { data } = await supabase
    .from('participation_defi')
    .select('id_user').eq('id_defi', id_defi).eq('id_user', id_user).single();
  return !!data;
};

const findParticipants = async (id_defi) => {
  const { data, error } = await supabase
    .from('participation_defi')
    .select('id_user, progression, user:id_user(nom, prenom)')
    .eq('id_defi', id_defi);
  if (error) throw error;
  return data;
};

module.exports = { findAll, findById, create, update, remove, join, isJoined, findParticipants };
