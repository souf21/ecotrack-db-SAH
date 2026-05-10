const supabase = require('../../config/supabase');

// Store a single reading
const insert = async ({ id_capteur, valeur, unite, datetime }) => {
  const { data, error } = await supabase
    .from('mesure')
    .insert({ id_capteur, valeur, unite, datetime: datetime || new Date().toISOString() })
    .select().single();
  if (error) throw error;
  return data;
};

// Store multiple readings at once (IoT devices often batch)
const insertBatch = async (readings) => {
  const rows = readings.map(r => ({
    id_capteur: r.id_capteur,
    valeur:     r.valeur,
    unite:      r.unite,
    datetime:   r.datetime || new Date().toISOString()
  }));
  const { data, error } = await supabase.from('mesure').insert(rows).select();
  if (error) throw error;
  return data;
};

// Get history for a sensor, newest first, with pagination
const findBySensor = async (id_capteur, { limit = 100, from, to } = {}) => {
  let q = supabase
    .from('mesure')
    .select('id_mesure, valeur, unite, datetime')
    .eq('id_capteur', id_capteur)
    .order('datetime', { ascending: false })
    .limit(limit);
  if (from) q = q.gte('datetime', from);
  if (to)   q = q.lte('datetime', to);
  const { data, error } = await q;
  if (error) throw error;
  return data;
};

// Latest reading per sensor for a given container
const findLatestByContainer = async (id_conteneur) => {
  const { data: sensors, error: se } = await supabase
    .from('capteur')
    .select('id_capteur, reference, type, statut')
    .eq('id_conteneur', id_conteneur);
  if (se) throw se;

  const results = await Promise.all(sensors.map(async (sensor) => {
    const { data: latest } = await supabase
      .from('mesure')
      .select('valeur, unite, datetime')
      .eq('id_capteur', sensor.id_capteur)
      .order('datetime', { ascending: false })
      .limit(1).single();
    return { ...sensor, latest_reading: latest || null };
  }));

  return results;
};

// Containers whose latest fill-level reading is at or above the threshold
const findAlerts = async (threshold) => {
  const { data: sensors, error: se } = await supabase
    .from('capteur')
    .select(`
      id_capteur, id_conteneur,
      conteneur (reference, adresse, zone(nom_zone))
    `)
    .eq('type', 'remplissage')
    .eq('statut', 'actif');
  if (se) throw se;

  const alerts = [];
  for (const sensor of sensors) {
    const { data: latest } = await supabase
      .from('mesure')
      .select('valeur, datetime')
      .eq('id_capteur', sensor.id_capteur)
      .order('datetime', { ascending: false })
      .limit(1).single();

    if (latest && Number(latest.valeur) >= threshold) {
      alerts.push({
        id_conteneur:  sensor.id_conteneur,
        reference:     sensor.conteneur?.reference,
        adresse:       sensor.conteneur?.adresse,
        zone:          sensor.conteneur?.zone?.nom_zone,
        fill_level:    Number(latest.valeur),
        last_reading:  latest.datetime,
        id_capteur:    sensor.id_capteur
      });
    }
  }

  return alerts.sort((a, b) => b.fill_level - a.fill_level);
};

// Insert a 0% reading for every active remplissage sensor linked to the given containers
const resetContainers = async (containerIds) => {
  if (!containerIds?.length) return [];

  const { data: sensors, error: se } = await supabase
    .from('capteur')
    .select('id_capteur')
    .in('id_conteneur', containerIds)
    .eq('type', 'remplissage');
  if (se) throw se;
  if (!sensors.length) return [];

  const now  = new Date().toISOString();
  const rows = sensors.map(s => ({ id_capteur: s.id_capteur, valeur: 0, unite: '%', datetime: now }));
  const { data, error } = await supabase.from('mesure').insert(rows).select();
  if (error) throw error;
  return data;
};

module.exports = { insert, insertBatch, findBySensor, findLatestByContainer, findAlerts, resetContainers };
