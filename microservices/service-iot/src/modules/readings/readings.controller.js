const service = require('./readings.service');

const ingest = async (req, res, next) => {
  try {
    const data = await service.ingest(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

const ingestBatch = async (req, res, next) => {
  try {
    const result = await service.ingestBatch(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err) { next(err); }
};

const getHistory = async (req, res, next) => {
  try {
    const data = await service.getHistory(req.params.capteurId, req.query);
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

const getLatestByContainer = async (req, res, next) => {
  try {
    const data = await service.getLatestByContainer(req.params.conteneurId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getAlerts = async (req, res, next) => {
  try {
    const data = await service.getAlerts();
    res.json({ success: true, count: data.length, threshold: parseInt(process.env.FILL_ALERT_THRESHOLD || '80'), data });
  } catch (err) { next(err); }
};

const resetContainers = async (req, res, next) => {
  try {
    const { container_ids } = req.body;
    if (!Array.isArray(container_ids) || !container_ids.length) {
      return res.status(400).json({ error: 'container_ids doit être un tableau non vide' });
    }
    const data = await service.resetContainers(container_ids);
    res.status(201).json({ success: true, reset_count: data.length, data });
  } catch (err) { next(err); }
};

module.exports = { ingest, ingestBatch, getHistory, getLatestByContainer, getAlerts, resetContainers };
