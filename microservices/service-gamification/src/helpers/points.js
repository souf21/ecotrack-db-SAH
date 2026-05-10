const supabase = require('../config/supabase');

// Badge UUIDs must match seed.sql
const BADGE_SIGNALEMENT_THRESHOLDS = [
  { id: 'b0000001-0000-0000-0000-000000000001', count: 1  },
  { id: 'b0000001-0000-0000-0000-000000000002', count: 5  },
  { id: 'b0000001-0000-0000-0000-000000000003', count: 20 },
];

const awardPoints = async (id_user, delta) => {
  const { data } = await supabase.from('user').select('point_total').eq('id_user', id_user).single();
  const newTotal = (data?.point_total || 0) + delta;
  await supabase.from('user').update({ point_total: newTotal }).eq('id_user', id_user);
  return newTotal;
};

const checkSignalementBadges = async (id_user) => {
  const { count } = await supabase
    .from('signalement')
    .select('*', { count: 'exact', head: true })
    .eq('id_user', id_user);

  const { data: alreadyHas } = await supabase
    .from('user_badge').select('id_badge').eq('id_user', id_user);
  const ownedIds = (alreadyHas || []).map(b => b.id_badge);
  const today    = new Date().toISOString().split('T')[0];

  for (const threshold of BADGE_SIGNALEMENT_THRESHOLDS) {
    if (count >= threshold.count && !ownedIds.includes(threshold.id)) {
      // Silently skip if badge seed wasn't run
      await supabase.from('user_badge')
        .insert({ id_user, id_badge: threshold.id, date_obtention: today });
    }
  }
};

module.exports = { awardPoints, checkSignalementBadges };
