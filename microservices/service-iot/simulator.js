/**
 * EcoTrack IoT Simulator — dynamic version
 *
 * - Loads all active fill sensors from DB at startup
 * - Auto-detects new bins every 30 seconds (no restart needed)
 * - Reads the real stored value before each tick → detects resets immediately
 * - Each bin has independent fill state (resetting bin A doesn't affect bin B)
 *
 * Usage:
 *   node simulator.js           → ticks every 5 seconds
 *   node simulator.js 2000      → ticks every 2 seconds
 *   node simulator.js 1000 fast → fast-fill mode for testing alerts quickly
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const API_KEY  = process.env.IOT_API_KEY           || 'dev-iot-key-ecotrack';
const IOT_URL  = process.env.IOT_GATEWAY_URL || 'http://localhost:80/api/iot/readings';
const INTERVAL = parseInt(process.argv[2])         || 300_000;
const FAST     = process.argv.includes('fast');

// Read directly from Supabase — no dependency on service-iot being up
const supabase = createClient(
  process.env.SUPABASE_URL              || 'http://127.0.0.1:54321',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// All currently tracked sensors — keyed by id_capteur for fast lookup
const sensors = {};

// ── DB helpers ────────────────────────────────────────────────────────────────

async function getStoredFill(capteurId) {
  const { data } = await supabase
    .from('mesure')
    .select('valeur')
    .eq('id_capteur', capteurId)
    .eq('unite', '%')
    .order('datetime', { ascending: false })
    .limit(1)
    .single();
  return data ? Number(data.valeur) : null;
}

async function loadAllSensors() {
  const { data, error } = await supabase
    .from('capteur')
    .select('id_capteur, id_conteneur, conteneur(reference)')
    .eq('type', 'remplissage')
    .eq('statut', 'actif');

  if (error) {
    console.error('[simulator] DB error loading sensors:', error.message);
    return [];
  }
  return data || [];
}

// ── Sensor management ─────────────────────────────────────────────────────────

async function addSensor(row, isNew = false) {
  const id    = row.id_capteur;
  const label = row.conteneur?.reference || row.id_conteneur.slice(0, 8);

  const stored = await getStoredFill(id);
  const fill   = stored ?? 0;

  sensors[id] = { id, containerId: row.id_conteneur, bin: label, fill, _alerting: false };

  const tag = isNew ? '[+] New bin detected' : '   ';
  console.log(`${tag} ${label}: starting at ${fill.toFixed(1)}%`);
}

// Polls for sensors not yet in our map and registers them
async function discoverNewSensors() {
  const rows = await loadAllSensors();
  for (const row of rows) {
    if (!sensors[row.id_capteur]) {
      await addSensor(row, true);
    }
  }
}

// ── Tick ─────────────────────────────────────────────────────────────────────

async function tick(sensor) {
  // Always read the latest stored value first — detects external resets
  const stored = await getStoredFill(sensor.id);

  if (stored !== null && stored < sensor.fill - 5) {
    // Fill dropped by more than 5% externally (reset after tournée terminée)
    console.log(`  ↩ ${sensor.bin}: reset detected (${sensor.fill.toFixed(1)}% → ${stored.toFixed(1)}%) — restarting from ${stored.toFixed(1)}%`);
    sensor.fill = stored;
  } else if (stored !== null) {
    sensor.fill = stored;
  }

  // Increment fill level
  const increment = FAST ? (Math.random() * 8 + 2) : (Math.random() * 1.5 + 0.2);
  sensor.fill     = Math.min(100, sensor.fill + increment);

  const body = {
    id_capteur: sensor.id,
    valeur:     parseFloat(sensor.fill.toFixed(1)),
    unite:      '%',
    datetime:   new Date().toISOString(),
  };

  try {
    const res  = await fetch(IOT_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': API_KEY },
      body:    JSON.stringify(body),
    });
    const data = await res.json();

    if (res.ok) {
      const alertNow    = !!data.data?.alert?.triggered;
      const alertTag    = alertNow                          ? ' ⚠️  ALERT'    : '';
      const resolvedTag = !alertNow && sensor._alerting     ? ' ✅ RESOLVED'  : '';
      sensor._alerting  = alertNow;
      console.log(`[${new Date().toTimeString().slice(0, 8)}] ${sensor.bin}: ${body.valeur}%${alertTag}${resolvedTag}`);
    } else {
      console.error(`[${sensor.bin}] ERROR ${res.status}:`, data.error || JSON.stringify(data));
    }
  } catch (err) {
    console.error(`[${sensor.bin}] NETWORK ERROR:`, err.message);
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

async function init() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  EcoTrack IoT Simulator');
  console.log(`  Tick     : every ${INTERVAL}ms  |  Mode: ${FAST ? 'FAST-FILL' : 'normal'}`);
  console.log(`  Target   : ${IOT_URL}`);
  console.log('  Loading sensors from DB…');
  console.log('');

  const rows = await loadAllSensors();
  if (!rows.length) {
    console.error('  No active fill sensors found. Run the migration first.');
    process.exit(1);
  }

  for (const row of rows) await addSensor(row, false);

  console.log('');
  console.log(`  ${Object.keys(sensors).length} sensor(s) active. Simulator running…`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Main tick — send a reading for every tracked sensor
  const runTick = () => Object.values(sensors).forEach(tick);
  runTick();
  setInterval(runTick, INTERVAL);

  // Discovery tick — check for new bins every 30 seconds
  setInterval(discoverNewSensors, 30_000);
}

init();
