// src/modules/bins/bins.service.js
// COUCHE SERVICE : logique métier pour les conteneurs
// N'utilise PAS req/res — ne connaît pas Express

const binsRepository = require('./bins.repository');
const { NotFoundError, ValidationError } = require('../../errors/AppError');

// Récupère tous les conteneurs
const getAllBins = async (filters = {}) => {
  const conteneurs = await binsRepository.findAll(filters);
  return conteneurs;
};

// Récupère un conteneur par ID
const getBinById = async (id) => {
  const conteneur = await binsRepository.findById(id);

  if (!conteneur) {
    throw new NotFoundError(`Conteneur avec l'ID ${id} introuvable`);
  }

  return conteneur;
};

// Crée un nouveau conteneur avec validation métier
const createBin = async (data) => {
  // Champs obligatoires
  if (!data.reference) {
    throw new ValidationError('Le champ reference est obligatoire');
  }
  if (!data.id_type_dechets) {
    throw new ValidationError('Le champ id_type_dechets est obligatoire');
  }
  if (!data.id_zone) {
    throw new ValidationError('Le champ id_zone est obligatoire');
  }

  // Validation GPS
  if (data.latitude && (data.latitude < -90 || data.latitude > 90)) {
    throw new ValidationError('La latitude doit être entre -90 et 90');
  }
  if (data.longitude && (data.longitude < -180 || data.longitude > 180)) {
    throw new ValidationError('La longitude doit être entre -180 et 180');
  }

  // Validation capacité
  if (data.capacite_totale && data.capacite_totale <= 0) {
    throw new ValidationError('La capacité doit être un nombre positif');
  }

  return await binsRepository.create(data);
};

// Met à jour un conteneur
const updateBin = async (id, data) => {
  await getBinById(id); // vérifie existence
  return await binsRepository.update(id, data);
};

// Supprime un conteneur
const deleteBin = async (id) => {
  await getBinById(id); // vérifie existence
  await binsRepository.remove(id);
  return { message: `Conteneur ${id} supprimé avec succès` };
};

module.exports = {
  getAllBins,
  getBinById,
  createBin,
  updateBin,
  deleteBin
};