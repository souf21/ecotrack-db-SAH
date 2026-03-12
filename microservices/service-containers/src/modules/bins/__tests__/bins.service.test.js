// src/modules/bins/__tests__/bins.service.test.js
// Tests unitaires du Service — sans base de données, sans HTTP
// On mock le Repository pour tester uniquement la logique métier

// Mock du Repository — remplace les vraies fonctions par des fausses
jest.mock('../bins.repository');
const binsRepository = require('../bins.repository');
const binsService = require('../bins.service');
const { NotFoundError, ValidationError } = require('../../../errors/AppError');

// Données de test réutilisables
const mockBin = {
  id_conteneur: '123e4567-e89b-12d3-a456-426614174000',
  reference: 'BIN-001',
  latitude: 48.8566,
  longitude: 2.3522,
  capacite_totale: 500,
  etat: 'actif',
  id_zone: '123e4567-e89b-12d3-a456-426614174001',
  id_type_dechets: '123e4567-e89b-12d3-a456-426614174002'
};

// Réinitialise les mocks avant chaque test
beforeEach(() => {
  jest.clearAllMocks();
});

// ─────────────────────────────────────────
// TESTS : getAllBins
// ─────────────────────────────────────────
describe('getAllBins', () => {

  test('retourne la liste des conteneurs', async () => {
    // ARRANGE — le repository retourne un tableau de 2 bins
    binsRepository.findAll.mockResolvedValue([mockBin, mockBin]);

    // ACT — on appelle le service
    const result = await binsService.getAllBins();

    // ASSERT — on vérifie le résultat
    expect(result).toHaveLength(2);
    expect(binsRepository.findAll).toHaveBeenCalledTimes(1);
  });

  test('retourne un tableau vide si aucun conteneur', async () => {
    // ARRANGE
    binsRepository.findAll.mockResolvedValue([]);

    // ACT
    const result = await binsService.getAllBins();

    // ASSERT
    expect(result).toEqual([]);
  });

  test('applique les filtres correctement', async () => {
    // ARRANGE
    binsRepository.findAll.mockResolvedValue([mockBin]);
    const filters = { etat: 'actif' };

    // ACT
    await binsService.getAllBins(filters);

    // ASSERT — vérifie que le repository reçoit bien les filtres
    expect(binsRepository.findAll).toHaveBeenCalledWith({ etat: 'actif' });
  });

});

// ─────────────────────────────────────────
// TESTS : getBinById
// ─────────────────────────────────────────
describe('getBinById', () => {

  test('retourne un conteneur existant', async () => {
    // ARRANGE
    binsRepository.findById.mockResolvedValue(mockBin);

    // ACT
    const result = await binsService.getBinById('123e4567-e89b-12d3-a456-426614174000');

    // ASSERT
    expect(result).toEqual(mockBin);
    expect(binsRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('lance NotFoundError si conteneur inexistant', async () => {
    // ARRANGE — le repository retourne null
    binsRepository.findById.mockResolvedValue(null);

    // ACT + ASSERT — on vérifie que l'erreur est bien lancée
    await expect(binsService.getBinById('id-inexistant'))
      .rejects
      .toThrow(NotFoundError);
  });

});

// ─────────────────────────────────────────
// TESTS : createBin
// ─────────────────────────────────────────
describe('createBin', () => {

  test('crée un conteneur avec données valides', async () => {
    // ARRANGE
    binsRepository.create.mockResolvedValue(mockBin);

    // ACT
    const result = await binsService.createBin({
      reference: 'BIN-001',
      latitude: 48.8566,
      longitude: 2.3522,
      capacite_totale: 500,
      id_zone: '123e4567-e89b-12d3-a456-426614174001',
      id_type_dechets: '123e4567-e89b-12d3-a456-426614174002'
    });

    // ASSERT
    expect(result).toEqual(mockBin);
    expect(binsRepository.create).toHaveBeenCalledTimes(1);
  });

  test('lance ValidationError si reference manquante', async () => {
    // ACT + ASSERT
    await expect(binsService.createBin({
      latitude: 48.8566,
      longitude: 2.3522,
      capacite_totale: 500,
      id_zone: '123e4567-e89b-12d3-a456-426614174001',
      id_type_dechets: '123e4567-e89b-12d3-a456-426614174002'
    }))
      .rejects
      .toThrow(ValidationError);
  });

  test('lance ValidationError si latitude invalide', async () => {
    // ACT + ASSERT
    await expect(binsService.createBin({
      reference: 'BIN-001',
      latitude: 200,  // invalide — doit être entre -90 et 90
      longitude: 2.3522,
      capacite_totale: 500,
      id_zone: '123e4567-e89b-12d3-a456-426614174001',
      id_type_dechets: '123e4567-e89b-12d3-a456-426614174002'
    }))
      .rejects
      .toThrow(ValidationError);
  });

  test('lance ValidationError si longitude invalide', async () => {
    // ACT + ASSERT
    await expect(binsService.createBin({
      reference: 'BIN-001',
      latitude: 48.8566,
      longitude: 300,  // invalide — doit être entre -180 et 180
      capacite_totale: 500,
      id_zone: '123e4567-e89b-12d3-a456-426614174001',
      id_type_dechets: '123e4567-e89b-12d3-a456-426614174002'
    }))
      .rejects
      .toThrow(ValidationError);
  });

  test('lance ValidationError si capacite négative', async () => {
    // ACT + ASSERT
    await expect(binsService.createBin({
      reference: 'BIN-001',
      latitude: 48.8566,
      longitude: 2.3522,
      capacite_totale: -10,  // invalide
      id_zone: '123e4567-e89b-12d3-a456-426614174001',
      id_type_dechets: '123e4567-e89b-12d3-a456-426614174002'
    }))
      .rejects
      .toThrow(ValidationError);
  });

});

// ─────────────────────────────────────────
// TESTS : deleteBin
// ─────────────────────────────────────────
describe('deleteBin', () => {

  test('supprime un conteneur existant', async () => {
    // ARRANGE
    binsRepository.findById.mockResolvedValue(mockBin);
    binsRepository.remove.mockResolvedValue(true);

    // ACT
    const result = await binsService.deleteBin('123e4567-e89b-12d3-a456-426614174000');

    // ASSERT
    expect(result.message).toContain('supprimé');
    expect(binsRepository.remove).toHaveBeenCalledTimes(1);
  });

  test('lance NotFoundError si conteneur inexistant', async () => {
    // ARRANGE
    binsRepository.findById.mockResolvedValue(null);

    // ACT + ASSERT
    await expect(binsService.deleteBin('id-inexistant'))
      .rejects
      .toThrow(NotFoundError);
  });

});