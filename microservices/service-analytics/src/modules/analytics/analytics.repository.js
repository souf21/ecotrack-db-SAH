const supabase  = require('../../config/supabase');

const THRESHOLD = () => parseInt(process.env.FILL_ALERT_THRESHOLD || '80');

// Helper — group an array of objects by a key and count occurrences
const countBy = (arr, key) =>
  (arr || []).reduce((acc, item) => {
    const val = item[key] || 'Inconnu';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

// sinceDate from a "30d" / "7d" / "90d" string
const since = (period) => {
  const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
};

// ── Overview KPIs ─────────────────────────────────────────────────────────────
const getOverview = async () => {
  const from30d = since('30d');

  const [
    { count: totalContainers },
    { count: activeContainers },
    { count: activeSensors },
    { data: tournees },
    { data: signalements },
    { data: users },
    { data: badges }
  ] = await Promise.all([
    supabase.from('conteneur').select('*', { count: 'exact', head: true }),
    supabase.from('conteneur').select('*', { count: 'exact', head: true }).eq('etat', 'actif'),
    supabase.from('capteur').select('*', { count: 'exact', head: true }).eq('statut', 'actif').eq('type', 'remplissage'),
    supabase.from('tournee').select('statut').gte('date', from30d),
    supabase.from('signalement').select('statut'),
    supabase.from('user').select('point_total'),
    supabase.from('user_badge').select('id_user', { count: 'exact', head: true })
  ]);

  return {
    containers: {
      total:  totalContainers  || 0,
      active: activeContainers || 0
    },
    sensors: { active: activeSensors || 0 },
    tournees_last_30d: {
      total:      tournees?.length || 0,
      by_statut:  countBy(tournees, 'statut')
    },
    signalements: {
      total:     signalements?.length || 0,
      by_statut: countBy(signalements, 'statut')
    },
    gamification: {
      total_users:              users?.length || 0,
      total_points_distributed: (users || []).reduce((s, u) => s + (u.point_total || 0), 0),
      total_badges_awarded:     badges || 0
    }
  };
};

// ── Fill level snapshot ───────────────────────────────────────────────────────
const getFillLevels = async () => {
  const { data: sensors } = await supabase
    .from('capteur')
    .select(`
      id_capteur,
      conteneur:id_conteneur(
        id_conteneur, reference, adresse, etat,
        zone:id_zone(nom_zone),
        type_dechets:id_type_dechets(libelle, couleur)
      )
    `)
    .eq('type', 'remplissage')
    .eq('statut', 'actif');

  const enriched = await Promise.all((sensors || []).map(async (sensor) => {
    const { data: latest } = await supabase
      .from('mesure')
      .select('valeur, datetime')
      .eq('id_capteur', sensor.id_capteur)
      .order('datetime', { ascending: false })
      .limit(1).single();

    return {
      id_capteur:   sensor.id_capteur,
      conteneur:    sensor.conteneur,
      fill_level:   latest ? Number(latest.valeur) : null,
      last_reading: latest?.datetime || null
    };
  }));

  const threshold = THRESHOLD();
  const withData  = enriched.filter(s => s.fill_level !== null);

  const distribution = {
    empty:   withData.filter(s => s.fill_level <  25).length,
    low:     withData.filter(s => s.fill_level >= 25 && s.fill_level < 50).length,
    medium:  withData.filter(s => s.fill_level >= 50 && s.fill_level < 75).length,
    high:    withData.filter(s => s.fill_level >= 75 && s.fill_level < threshold).length,
    alert:   withData.filter(s => s.fill_level >= threshold).length,
    no_data: enriched.length - withData.length
  };

  return {
    threshold,
    distribution,
    sensors: enriched.sort((a, b) => (b.fill_level || 0) - (a.fill_level || 0))
  };
};

// ── Tournée stats ─────────────────────────────────────────────────────────────
const getTourneeStats = async ({ period = '30d' } = {}) => {
  const { data: tournees } = await supabase
    .from('tournee')
    .select(`
      id_tournee, date, statut,
      type_tournee:id_type_tournee(libelle),
      realise(id_user, user:id_user(nom, prenom)),
      etape_tournee(id_conteneur)
    `)
    .gte('date', since(period))
    .order('date', { ascending: false });

  if (!tournees?.length) return { period, total: 0, by_statut: {}, by_type: {}, collections_by_agent: [], avg_stops: 0 };

  const byType = {};
  const agentMap = {};

  for (const t of tournees) {
    const type = t.type_tournee?.libelle || 'Inconnu';
    byType[type] = (byType[type] || 0) + 1;

    if (t.statut === 'terminée') {
      for (const r of (t.realise || [])) {
        const name = `${r.user?.prenom || ''} ${r.user?.nom || ''}`.trim() || r.id_user;
        agentMap[name] = (agentMap[name] || 0) + 1;
      }
    }
  }

  const totalStops = tournees.reduce((s, t) => s + (t.etape_tournee?.length || 0), 0);

  return {
    period,
    total:     tournees.length,
    by_statut: countBy(tournees, 'statut'),
    by_type:   byType,
    collections_by_agent: Object.entries(agentMap)
      .map(([agent, count]) => ({ agent, count }))
      .sort((a, b) => b.count - a.count),
    avg_stops: Math.round((totalStops / tournees.length) * 10) / 10
  };
};

// ── Signalement stats ─────────────────────────────────────────────────────────
const getSignalementStats = async ({ period = '30d' } = {}) => {
  const sinceTs = new Date(Date.now() - (period === '7d' ? 7 : period === '90d' ? 90 : 30) * 86400000).toISOString();

  const { data: all } = await supabase
    .from('signalement').select('statut, type');
  const { data: recent } = await supabase
    .from('signalement').select('statut, type').gte('date_signalement', sinceTs);

  return {
    period,
    all_time: {
      total:     all?.length || 0,
      by_statut: countBy(all, 'statut'),
      by_type:   countBy(all, 'type')
    },
    in_period: {
      total:     recent?.length || 0,
      by_statut: countBy(recent, 'statut'),
      by_type:   countBy(recent, 'type')
    }
  };
};

// ── Zone breakdown ────────────────────────────────────────────────────────────
const getZoneStats = async () => {
  const { data: zones } = await supabase
    .from('zone')
    .select(`
      id_zone, nom_zone, code_postal,
      conteneur:conteneur(
        id_conteneur, etat,
        capteur:capteur(id_capteur, type, statut)
      )
    `);

  const results = await Promise.all((zones || []).map(async (zone) => {
    const sensors = (zone.conteneur || [])
      .flatMap(c => c.capteur || [])
      .filter(s => s.type === 'remplissage' && s.statut === 'actif');

    const readings = await Promise.all(sensors.map(async (s) => {
      const { data: latest } = await supabase
        .from('mesure').select('valeur')
        .eq('id_capteur', s.id_capteur)
        .order('datetime', { ascending: false }).limit(1).single();
      return latest ? Number(latest.valeur) : null;
    }));

    const valid   = readings.filter(r => r !== null);
    const avgFill = valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : null;
    const alertCount = valid.filter(r => r >= THRESHOLD()).length;

    return {
      id_zone:         zone.id_zone,
      nom_zone:        zone.nom_zone,
      code_postal:     zone.code_postal,
      container_count: (zone.conteneur || []).length,
      sensor_count:    sensors.length,
      avg_fill_level:  avgFill,
      alert_count:     alertCount
    };
  }));

  return results.sort((a, b) => (b.avg_fill_level || 0) - (a.avg_fill_level || 0));
};

module.exports = { getOverview, getFillLevels, getTourneeStats, getSignalementStats, getZoneStats };
