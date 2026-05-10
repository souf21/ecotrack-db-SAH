const express  = require('express');
const router   = express.Router();
const ctrl     = require('./sensors.controller');
const auth     = require('../../middlewares/auth.middleware');
const roles    = require('../../middlewares/roles.middleware');
const validate = require('../../middlewares/validate.middleware');
const { createSensorSchema, updateSensorSchema } = require('./sensors.validation');

/**
 * @swagger
 * tags:
 *   name: Capteurs
 *   description: Gestion des capteurs IoT
 */

/**
 * @swagger
 * /api/iot/sensors:
 *   get:
 *     summary: Liste tous les capteurs
 *     tags: [Capteurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_conteneur
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [remplissage, temperature, batterie] }
 *       - in: query
 *         name: statut
 *         schema: { type: string, enum: [actif, inactif, maintenance] }
 */
router.get('/',    auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);

/**
 * @swagger
 * /api/iot/sensors:
 *   post:
 *     summary: Enregistrer un nouveau capteur (gestionnaire)
 *     tags: [Capteurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reference, type, id_conteneur]
 *             properties:
 *               reference:    { type: string, example: "CAP-BIN001-REMPL" }
 *               type:         { type: string, enum: [remplissage, temperature, batterie] }
 *               id_conteneur: { type: string, format: uuid }
 *               statut:       { type: string, enum: [actif, inactif, maintenance] }
 */
router.post('/',    auth, roles('gestionnaire'), validate(createSensorSchema), ctrl.create);
router.put('/:id',  auth, roles('gestionnaire'), validate(updateSensorSchema), ctrl.update);

module.exports = router;
