const supabase = require('../../config/supabase');

const getProfile = async (id_user) => {
  const [
    { data: user },
    { count: signalementCount },
    { data: badges },
    { data: defis }
  ] = await Promise.all([
    supabase.from('user')
      .select('id_user, nom, prenom, email, point_total, avatar_url, date_inscription')
      .eq('id_user', id_user).single(),
    supabase.from('signalement')
      .select('*', { count: 'exact', head: true }).eq('id_user', id_user),
    supabase.from('user_badge')
      .select('date_obtention, badge:id_badge(nom, icon_url, niveau)')
      .eq('id_user', id_user).order('date_obtention', { ascending: false }),
    supabase.from('participation_defi')
      .select('progression, defi:id_defi(titre, statut, points_recompense)')
      .eq('id_user', id_user)
  ]);

  return {
    ...user,
    signalement_count: signalementCount || 0,
    badges:            badges || [],
    defis:             defis  || []
  };
};

const getLeaderboard = async (limit = 10) => {
  const { data, error } = await supabase
    .from('user')
    .select('id_user, nom, prenom, point_total, avatar_url')
    .order('point_total', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
};

module.exports = { getProfile, getLeaderboard };
