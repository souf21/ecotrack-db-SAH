// tests/lib/conteneurService.js
// Logique métier CRUD pour les conteneurs

const { NotFoundError, ValidationError } = require('./errors');
const { validateCreate, validateUpdate }  = require('./conteneurValidator');

const createConteneurService = (repository) => {

  const _assertExists = async (id) => {
    const conteneur = await repository.findById(id);
    if (!conteneur) throw new NotFoundError(`Conteneur ${id} introuvable`);
    return conteneur;
  };

  return {

    async getAll(filters = {}) {
      return repository.findAll(filters);
    },

    async getById(id) {
      return _assertExists(id);
    },

    async create(data) {
      validateCreate(data);
      return repository.create(data);
    },

    async update(id, data) {
      await _assertExists(id);
      validateUpdate(data);
      return repository.update(id, data);
    },

    async delete(id) {
      await _assertExists(id);
      await repository.remove(id);
      return { message: `Conteneur ${id} supprimé avec succès` };
    },

    async archive(id) {
      const conteneur = await _assertExists(id);
      if (conteneur.etat === 'archive') {
        throw new ValidationError(`Conteneur ${id} est déjà archivé`);
      }
      return repository.update(id, { etat: 'archive' });
    },

    async stats() {
      const all = await repository.findAll({});
      const total      = all.length;
      const actifs      = all.filter(b => b.etat === 'actif').length;
      const inactifs    = all.filter(b => b.etat === 'inactif').length;
      const maintenance = all.filter(b => b.etat === 'maintenance').length;
      const tauxActivite = total > 0 ? Math.round((actifs / total) * 100) : 0;
      return { total, actifs, inactifs, maintenance, tauxActivite };
    }
  };
};

module.exports = { createConteneurService };
