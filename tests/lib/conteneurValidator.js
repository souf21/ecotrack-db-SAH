// tests/lib/conteneurValidator.js
// Règles de validation métier pour les conteneurs

const { ValidationError } = require('./errors');

const ETATS_VALIDES = ['actif', 'inactif', 'maintenance', 'hors_service'];

const validateCreate = (data) => {
  if (!data.reference)
    throw new ValidationError('reference est obligatoire');
  if (!data.id_zone)
    throw new ValidationError('id_zone est obligatoire');
  if (!data.id_type_dechets)
    throw new ValidationError('id_type_dechets est obligatoire');

  if (data.latitude !== undefined && (data.latitude < -90 || data.latitude > 90))
    throw new ValidationError('latitude doit être entre -90 et 90');
  if (data.longitude !== undefined && (data.longitude < -180 || data.longitude > 180))
    throw new ValidationError('longitude doit être entre -180 et 180');
  if (data.capacite_totale !== undefined && data.capacite_totale <= 0)
    throw new ValidationError('capacite_totale doit être un nombre positif');
};

const validateUpdate = (data) => {
  if (data.latitude !== undefined && (data.latitude < -90 || data.latitude > 90))
    throw new ValidationError('latitude doit être entre -90 et 90');
  if (data.longitude !== undefined && (data.longitude < -180 || data.longitude > 180))
    throw new ValidationError('longitude doit être entre -180 et 180');
  if (data.capacite_totale !== undefined && data.capacite_totale <= 0)
    throw new ValidationError('capacite_totale doit être un nombre positif');
  if (data.etat !== undefined && !ETATS_VALIDES.includes(data.etat))
    throw new ValidationError(`etat doit être l'un de : ${ETATS_VALIDES.join(', ')}`);
};

module.exports = { validateCreate, validateUpdate };
