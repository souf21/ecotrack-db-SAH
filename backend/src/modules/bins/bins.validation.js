// src/modules/bins/bins.validation.js
// Schémas Joi pour valider les données des conteneurs

const Joi = require('joi');

// Schéma pour la CRÉATION d'un conteneur (POST)
const createBinSchema = Joi.object({
  reference: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'La référence est obligatoire',
      'string.min': 'La référence doit faire au moins 2 caractères',
      'any.required': 'La référence est obligatoire'
    }),

  adresse: Joi.string()
    .max(255)
    .optional(),

  latitude: Joi.number()
    .min(-90)
    .max(90)
    .required()
    .messages({
      'number.min': 'La latitude doit être entre -90 et 90',
      'number.max': 'La latitude doit être entre -90 et 90',
      'any.required': 'La latitude est obligatoire'
    }),

  longitude: Joi.number()
    .min(-180)
    .max(180)
    .required()
    .messages({
      'number.min': 'La longitude doit être entre -180 et 180',
      'number.max': 'La longitude doit être entre -180 et 180',
      'any.required': 'La longitude est obligatoire'
    }),

  capacite_totale: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .required()
    .messages({
      'number.min': 'La capacité doit être positive',
      'number.max': 'La capacité ne peut pas dépasser 10000 litres',
      'any.required': 'La capacité est obligatoire'
    }),

  etat: Joi.string()
    .valid('actif', 'inactif', 'maintenance')
    .default('actif')
    .messages({
      'any.only': "L'état doit être : actif, inactif ou maintenance"
    }),

  id_zone: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': "L'id_zone doit être un UUID valide",
      'any.required': 'La zone est obligatoire'
    }),

  id_type_dechets: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': "L'id_type_dechets doit être un UUID valide",
      'any.required': 'Le type de déchets est obligatoire'
    })
});

// Schéma pour la MISE À JOUR d'un conteneur (PUT)
// Tous les champs sont optionnels — on met à jour seulement ce qu'on envoie
const updateBinSchema = Joi.object({
  reference: Joi.string().min(2).max(50).optional(),
  adresse: Joi.string().max(255).optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  capacite_totale: Joi.number().integer().min(1).max(10000).optional(),
  etat: Joi.string().valid('actif', 'inactif', 'maintenance').optional(),
  id_zone: Joi.string().uuid().optional(),
  id_type_dechets: Joi.string().uuid().optional()
});

module.exports = { createBinSchema, updateBinSchema };