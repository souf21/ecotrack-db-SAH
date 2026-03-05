// src/modules/bins/bins.routes.js
const express = require('express');
const router = express.Router();
const binsController = require('./bins.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const rolesMiddleware = require('../../middlewares/roles.middleware');
const validate = require('../../middlewares/validate.middleware');
const { createBinSchema, updateBinSchema } = require('./bins.validation');
const { cache } = require('../../middlewares/cache.middleware');

/**
 * @swagger
 * tags:
 *   name: Conteneurs
 *   description: Gestion des conteneurs de déchets
 */

/**
 * @swagger
 * /api/bins:
 *   get:
 *     summary: Liste tous les conteneurs
 *     tags: [Conteneurs]
 *     parameters:
 *       - in: query
 *         name: etat
 *         schema:
 *           type: string
 *           enum: [actif, inactif, maintenance]
 *         description: Filtrer par état
 *       - in: query
 *         name: id_zone
 *         schema:
 *           type: string
 *         description: Filtrer par zone (UUID)
 *     responses:
 *       200:
 *         description: Liste des conteneurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 */
router.get('/', cache(3600), binsController.getAll);

/**
 * @swagger
 * /api/bins/{id}:
 *   get:
 *     summary: Détail d'un conteneur
 *     tags: [Conteneurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID du conteneur
 *     responses:
 *       200:
 *         description: Conteneur trouvé
 *       404:
 *         description: Conteneur introuvable
 */
router.get('/:id', cache(3600), binsController.getById);

/**
 * @swagger
 * /api/bins:
 *   post:
 *     summary: Créer un conteneur
 *     tags: [Conteneurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reference, latitude, longitude, capacite_totale, id_zone, id_type_dechets]
 *             properties:
 *               reference:
 *                 type: string
 *                 example: BIN-001
 *               latitude:
 *                 type: number
 *                 example: 48.8566
 *               longitude:
 *                 type: number
 *                 example: 2.3522
 *               capacite_totale:
 *                 type: integer
 *                 example: 500
 *               etat:
 *                 type: string
 *                 enum: [actif, inactif, maintenance]
 *               id_zone:
 *                 type: string
 *                 example: uuid
 *               id_type_dechets:
 *                 type: string
 *                 example: uuid
 *     responses:
 *       201:
 *         description: Conteneur créé
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Token manquant
 *       403:
 *         description: Rôle insuffisant
 */
router.post('/',
  authMiddleware,
  rolesMiddleware('admin'),
  validate(createBinSchema),
  binsController.create
);

/**
 * @swagger
 * /api/bins/{id}:
 *   put:
 *     summary: Modifier un conteneur
 *     tags: [Conteneurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conteneur modifié
 *       404:
 *         description: Conteneur introuvable
 */
router.put('/:id',
  authMiddleware,
  rolesMiddleware('manager'),
  validate(updateBinSchema),
  binsController.update
);

/**
 * @swagger
 * /api/bins/{id}:
 *   delete:
 *     summary: Supprimer un conteneur
 *     tags: [Conteneurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conteneur supprimé
 *       401:
 *         description: Token manquant
 *       403:
 *         description: Rôle insuffisant
 */
router.delete('/:id',
  authMiddleware,
  rolesMiddleware('admin'),
  binsController.remove
);

module.exports = router;