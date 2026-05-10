const Joi = require('joi');

const readingSchema = Joi.object({
  id_capteur: Joi.string().uuid().required(),
  valeur:     Joi.number().required()
                .messages({ 'any.required': 'La valeur du capteur est obligatoire' }),
  unite:      Joi.string().max(20).default('%'),
  datetime:   Joi.string().isoDate().optional()
});

const batchSchema = Joi.array()
  .items(readingSchema)
  .min(1).max(500)
  .required()
  .messages({
    'array.min': 'Au moins une mesure est requise',
    'array.max': 'Maximum 500 mesures par batch'
  });

module.exports = { readingSchema, batchSchema };
