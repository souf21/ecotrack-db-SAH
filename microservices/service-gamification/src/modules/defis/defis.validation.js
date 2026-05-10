const Joi = require('joi');

const defiSchema = Joi.object({
  titre:             Joi.string().max(150).required(),
  description:       Joi.string().optional().allow('', null),
  points_recompense: Joi.number().integer().min(0).default(0),
  statut:            Joi.string().valid('actif', 'terminé', 'annulé').default('actif'),
  date_debut:        Joi.string().isoDate().optional().allow(null),
  date_fin:          Joi.string().isoDate().optional().allow(null),
});

const updateDefiSchema = Joi.object({
  titre:             Joi.string().max(150).optional(),
  description:       Joi.string().optional().allow('', null),
  points_recompense: Joi.number().integer().min(0).optional(),
  statut:            Joi.string().valid('actif', 'terminé', 'annulé').optional(),
  date_debut:        Joi.string().isoDate().optional().allow(null),
  date_fin:          Joi.string().isoDate().optional().allow(null),
});

module.exports = { defiSchema, updateDefiSchema };
