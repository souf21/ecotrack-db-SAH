const Joi = require('joi');

const signalementSchema = Joi.object({
  type:         Joi.string().max(50).required(),
  description:  Joi.string().required(),
  photo_url:    Joi.string().uri().optional().allow(null, ''),
  id_conteneur: Joi.string().uuid().optional().allow(null),
});

const statusSchema = Joi.object({
  statut: Joi.string().valid('nouveau', 'en_cours', 'traité', 'rejeté').required(),
});

module.exports = { signalementSchema, statusSchema };
