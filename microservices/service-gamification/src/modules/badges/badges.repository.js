const supabase = require('../../config/supabase');

const findAll = async () => {
  const { data, error } = await supabase
    .from('badge')
    .select('id_badge, nom, description, icon_url, niveau, created_at')
    .order('niveau');
  if (error) throw error;
  return data;
};

const findByUser = async (id_user) => {
  const { data, error } = await supabase
    .from('user_badge')
    .select('date_obtention, badge:id_badge(id_badge, nom, description, icon_url, niveau)')
    .eq('id_user', id_user)
    .order('date_obtention', { ascending: false });
  if (error) throw error;
  return data;
};

const create = async ({ nom, description, icon_url, niveau }) => {
  const { data, error } = await supabase
    .from('badge').insert({ nom, description, icon_url, niveau }).select().single();
  if (error) throw error;
  return data;
};

module.exports = { findAll, findByUser, create };
