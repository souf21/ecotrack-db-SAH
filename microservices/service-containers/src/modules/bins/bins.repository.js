// src/modules/bins/bins.repository.js
// COUCHE REPOSITORY : accès base de données pour les conteneurs
// La table s'appelle 'conteneur' dans Supabase

const supabase = require('../../config/supabase');

// Récupère tous les conteneurs avec filtres optionnels
const findAll = async (filters = {}) => {
  let query = supabase
    .from('conteneur')
    .select(`
      *,
      zone(nom_zone),
      type_dechets(libelle)
    `); // on récupère aussi le nom de la zone et le type de déchets

  // Filtre par zone si fourni : /api/conteneurs?id_zone=xxx
  if (filters.id_zone) {
    query = query.eq('id_zone', filters.id_zone);
  }

  // Filtre par état si fourni : /api/conteneurs?etat=actif
  if (filters.etat) {
    query = query.eq('etat', filters.etat);
  }

  // Filtre par type de déchets
  if (filters.id_type_dechets) {
    query = query.eq('id_type_dechets', filters.id_type_dechets);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Récupère un conteneur par son ID
const findById = async (id) => {
  const { data, error } = await supabase
    .from('conteneur')
    .select(`
      *,
      zone(nom_zone),
      type_dechets(libelle)
    `)
    .eq('id_conteneur', id)
    .single();

  if (error) throw error;
  return data;
};

// Crée un nouveau conteneur
const create = async (conteneurData) => {
  const { data, error } = await supabase
    .from('conteneur')
    .insert(conteneurData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Met à jour un conteneur
const update = async (id, binData) => {
  const { data, error } = await supabase
    .from('conteneur')
    .update({
      ...binData,
      updated_at: new Date().toISOString()  // met à jour la date auto
    })
    .eq('id_conteneur', id)
    .select();  // ← retire .single()

  if (error) throw error;

  // data est un tableau (normalement 1 élément)
  if (data.length === 0) {
    throw new NotFoundError(`Conteneur ${id} introuvable`);
  }

  return data[0];  // retourne le premier (et unique) élément mis à jour
};

// Supprime un conteneur
const remove = async (id) => {
  const { error } = await supabase
    .from('conteneur')
    .delete()
    .eq('id_conteneur', id);

  if (error) throw error;
  return true;
};

module.exports = { findAll, findById, create, update, remove };