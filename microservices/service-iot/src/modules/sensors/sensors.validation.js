const Joi = require('joi');

const createSensorSchema = Joi.object({
  reference:        Joi.string().max(100).required(),
  type:             Joi.string().valid('remplissage', 'temperature', 'batterie').required(),
  id_conteneur:     Joi.string().uuid().required(),
  statut:           Joi.string().valid('actif', 'inactif', 'maintenance').default('actif'),
  date_installation: Joi.string().optional().allow(null)
});

const updateSensorSchema = Joi.object({
  statut:   Joi.string().valid('actif', 'inactif', 'maintenance').optional(),
  reference: Joi.string().max(100).optional()
});

module.exports = { createSensorSchema, updateSensorSchema };
