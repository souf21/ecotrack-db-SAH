const express   = require('express');
const router    = express.Router();
const ctrl      = require('./readings.controller');
const auth      = require('../../middlewares/auth.middleware');
const apiKey    = require('../../middlewares/apiKey.middleware');
const validate  = require('../../middlewares/validate.middleware');
const { ingestLimiter } = require('../../middlewares/rateLimit.middleware');
const { readingSchema, batchSchema } = require('./readings.validation');

/**
 * @swagger
 * tags:
 *   name: Mesures
 *   description: Ingestion et consultation des mesures capteurs
 */

// ── Ingest (IoT device → service) ────────────────────────────────────────────
// Uses API Key, not JWT. IoT devices don't have user accounts.

/**
 * @swagger
 * /api/iot/readings:
 *   post:
 *     summary: Envoyer une mesure (authentification par API Key)
 *     tags: [Mesures]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_capteur, valeur]
 *             properties:
 *               id_capteur: { type: string, format: uuid }
 *               valeur:     { type: number, example: 73.5 }
 *               unite:      { type: string, example: "%" }
 *               datetime:   { type: string, format: date-time }
 */
router.post('/',
  ingestLimiter,
  apiKey,
  validate(readingSchema),
  ctrl.ingest
);

/**
 * @swagger
 * /api/iot/readings/batch:
 *   post:
 *     summary: Envoyer plusieurs mesures en une requête (max 500)
 *     tags: [Mesures]
 *     security:
 *       - apiKeyAuth: []
 */
router.post('/batch',
  ingestLimiter,
  apiKey,
  (req, res, next) => {
    const { error, value } = batchSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ error: 'Données invalides', details: error.details.map(d => d.message) });
    req.body = value;
    next();
  },
  ctrl.ingestBatch
);

// ── Query (human users via JWT) ───────────────────────────────────────────────

/**
 * @swagger
 * /api/iot/readings/{capteurId}:
 *   get:
 *     summary: Historique d'un capteur
 *     tags: [Mesures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: capteurId
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 100 }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date-time, example: "2026-05-01T00:00:00Z" }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date-time }
 */
router.get('/:capteurId', auth, ctrl.getHistory);

module.exports = router;
