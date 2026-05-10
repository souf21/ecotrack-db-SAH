const Joi = require('joi');

const time = Joi.string().pattern(/^\d{2}:\d{2}(:\d{2})?$/).optional().allow(null);

const stopSchema = Joi.object({
  id_conteneur: Joi.string().uuid().required(),
  ordre:        Joi.number().integer().min(1).optional(),
  heure_prevue: time
});

const createRouteSchema = Joi.object({
  date:            Joi.string().required()
                     .messages({ 'any.required': 'La date est obligatoire (format YYYY-MM-DD)' }),
  heure_debut:     time,
  heure_fin:       time,
  statut:          Joi.string()
                     .valid('planifiée', 'en_cours', 'terminée', 'annulée')
                     .default('planifiée'),
  id_type_tournee: Joi.string().uuid().required()
                     .messages({ 'any.required': 'Le type de tournée est obligatoire' }),
  matricule:       Joi.string().optional().allow(null),
  stops:           Joi.array().items(stopSchema).optional().default([]),
  agents:          Joi.array().items(Joi.string().uuid()).optional().default([])
});

const updateRouteSchema = Joi.object({
  date:            Joi.string().optional(),
  heure_debut:     time,
  heure_fin:       time,
  id_type_tournee: Joi.string().uuid().optional(),
  matricule:       Joi.string().optional().allow(null)
});

const updateStatusSchema = Joi.object({
  statut: Joi.string()
    .valid('planifiée', 'en_cours', 'terminée', 'annulée')
    .required()
    .messages({ 'any.required': 'Le statut est obligatoire', 'any.only': 'Statut invalide' })
});

const addStopSchema = Joi.object({
  id_conteneur: Joi.string().uuid().required(),
  ordre:        Joi.number().integer().min(1).optional(),
  heure_prevue: time
});

const addAgentSchema = Joi.object({
  id_user: Joi.string().uuid().required()
    .messages({ 'any.required': 'L\'id_user de l\'agent est obligatoire' })
});

module.exports = {
  createRouteSchema, updateRouteSchema, updateStatusSchema,
  addStopSchema, addAgentSchema
};
