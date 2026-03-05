// src/modules/bins/bins.routes.js
// COUCHE ROUTES : définit les URLs uniquement

const express = require('express');
const router = express.Router();
const binsController = require('./bins.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const rolesMiddleware = require('../../middlewares/roles.middleware');

// Lecture — tout le monde peut voir les conteneurs
router.get('/', binsController.getAll);
router.get('/:id', binsController.getById);

// Création — admin seulement
router.post('/', authMiddleware, rolesMiddleware('admin'), binsController.create);

// Modification — manager ou admin
router.put('/:id', authMiddleware, rolesMiddleware('manager'), binsController.update);

// Suppression — admin seulement
router.delete('/:id', authMiddleware, rolesMiddleware('admin'), binsController.remove);

module.exports = router;