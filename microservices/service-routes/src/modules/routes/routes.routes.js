const express = require('express');
const router  = express.Router();
const ctrl    = require('./routes.controller');
const auth    = require('../../middlewares/auth.middleware');
const roles   = require('../../middlewares/roles.middleware');
const validate = require('../../middlewares/validate.middleware');
const {
  createRouteSchema, updateRouteSchema, updateStatusSchema,
  addStopSchema, addAgentSchema
} = require('./routes.validation');

/**
 * @swagger
 * tags:
 *   name: Tournées
 *   description: Gestion des tournées de collecte
 */

// ── Reference data (public, used by forms) ───────────────────────────────────

/**
 * @swagger
 * /api/routes/types:
 *   get:
 *     summary: Liste les types de tournée
 *     tags: [Tournées]
 *     responses:
 *       200:
 *         description: Liste des types
 */
router.get('/types',    ctrl.getTypes);
router.get('/vehicles', ctrl.getVehicles);

// ── Tournées ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/routes:
 *   get:
 *     summary: Liste les tournées (gestionnaire = toutes, agent = les siennes)
 *     tags: [Tournées]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           enum: [planifiée, en_cours, terminée, annulée]
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           example: "2026-05-10"
 *     responses:
 *       200:
 *         description: Liste des tournées avec étapes et agents
 */
router.get('/', auth, ctrl.getAll);

/**
 * @swagger
 * /api/routes:
 *   post:
 *     summary: Créer une tournée (gestionnaire uniquement)
 *     tags: [Tournées]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date, id_type_tournee]
 *             properties:
 *               date:
 *                 type: string
 *                 example: "2026-05-15"
 *               heure_debut:
 *                 type: string
 *                 example: "07:00"
 *               heure_fin:
 *                 type: string
 *                 example: "12:00"
 *               id_type_tournee:
 *                 type: string
 *                 format: uuid
 *               matricule:
 *                 type: string
 *                 example: "VH-75-001"
 *               stops:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_conteneur:
 *                       type: string
 *                       format: uuid
 *                     ordre:
 *                       type: integer
 *               agents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       201:
 *         description: Tournée créée
 */
router.post('/', auth, roles('gestionnaire'), validate(createRouteSchema), ctrl.create);

/**
 * @swagger
 * /api/routes/{id}:
 *   get:
 *     summary: Détail d'une tournée
 *     tags: [Tournées]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', auth, ctrl.getById);

/**
 * @swagger
 * /api/routes/{id}:
 *   put:
 *     summary: Modifier les métadonnées d'une tournée (gestionnaire)
 *     tags: [Tournées]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', auth, roles('gestionnaire'), validate(updateRouteSchema), ctrl.update);

/**
 * @swagger
 * /api/routes/{id}:
 *   delete:
 *     summary: Supprimer une tournée planifiée (gestionnaire)
 *     tags: [Tournées]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', auth, roles('gestionnaire'), ctrl.remove);

// ── Status ────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/routes/{id}/status:
 *   patch:
 *     summary: Changer le statut (gestionnaire ou agent assigné)
 *     tags: [Tournées]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [statut]
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [planifiée, en_cours, terminée, annulée]
 */
router.patch('/:id/status', auth, roles(['gestionnaire', 'agent']), validate(updateStatusSchema), ctrl.updateStatus);

// ── Stops ─────────────────────────────────────────────────────────────────────
router.post(  '/:id/stops',                auth, roles('gestionnaire'), validate(addStopSchema), ctrl.addStop);
router.delete('/:id/stops/:conteneurId',   auth, roles('gestionnaire'), ctrl.removeStop);

// ── Agent assignment ──────────────────────────────────────────────────────────
router.post(  '/:id/agents',               auth, roles('gestionnaire'), validate(addAgentSchema), ctrl.addAgent);
router.delete('/:id/agents/:agentId',      auth, roles('gestionnaire'), ctrl.removeAgent);

module.exports = router;
