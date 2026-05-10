const repo          = require('./readings.repository');
const sensorRepo    = require('../sensors/sensors.repository');
const { NotFoundError, ValidationError } = require('../../errors/AppError');

const THRESHOLD = () => parseInt(process.env.FILL_ALERT_THRESHOLD || '80');

// Validate sensor exists before inserting
const validateSensor = async (id_capteur) => {
  const sensor = await sensorRepo.findById(id_capteur);
  if (!sensor) throw new NotFoundError(`Capteur ${id_capteur} introuvable`);
  if (sensor.statut === 'inactif') throw new ValidationError(`Capteur ${id_capteur} est inactif`);
  return sensor;
};

const ingest = async (reading) => {
  const sensor = await validateSensor(reading.id_capteur);
  const stored = await repo.insert(reading);

  // Tell the caller whether this reading crossed the alert threshold.
  // When the bin is emptied the value drops back below threshold — alert resolves itself.
  const threshold = THRESHOLD();
  const alert = reading.unite === '%' && Number(reading.valeur) >= threshold
    ? { triggered: true, threshold, fill_level: Number(reading.valeur), id_conteneur: sensor.conteneur?.id_conteneur }
    : { triggered: false };

  return { ...stored, alert };
};

const ingestBatch = async (readings) => {
  const sensors = await Promise.all(readings.map(r => validateSensor(r.id_capteur)));
  const data    = await repo.insertBatch(readings);
  const threshold = THRESHOLD();

  const alerts = readings
    .map((r, i) => ({ ...r, sensor: sensors[i] }))
    .filter(r => r.unite === '%' && Number(r.valeur) >= threshold)
    .map(r => ({ id_conteneur: r.sensor.conteneur?.id_conteneur, fill_level: Number(r.valeur) }));

  return { count: data.length, alerts_triggered: alerts.length, alerts, readings: data };
};

const getHistory = (id_capteur, query) =>
  repo.findBySensor(id_capteur, {
    limit: parseInt(query.limit) || 100,
    from:  query.from,
    to:    query.to
  });

const getLatestByContainer = (id_conteneur) =>
  repo.findLatestByContainer(id_conteneur);

const getAlerts = () => repo.findAlerts(THRESHOLD());

const resetContainers = (containerIds) => repo.resetContainers(containerIds);

module.exports = { ingest, ingestBatch, getHistory, getLatestByContainer, getAlerts, resetContainers };
