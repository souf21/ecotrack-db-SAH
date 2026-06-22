// tests/conteneur.test.js
// Tests unitaires — logique métier des conteneurs

const { NotFoundError, ValidationError } = require('./lib/errors');
const { createConteneurService }         = require('./lib/conteneurService');

// ─────────────────────────────────────────────────────────────
// Données de test
// ─────────────────────────────────────────────────────────────

const UUID_1 = '123e4567-e89b-12d3-a456-426614174000';
const UUID_2 = '123e4567-e89b-12d3-a456-426614174001';
const UUID_3 = '123e4567-e89b-12d3-a456-426614174002';

const mockConteneur = {
  id_conteneur:    UUID_1,
  reference:       'BIN-001',
  latitude:        48.8566,
  longitude:       2.3522,
  capacite_totale: 500,
  etat:            'actif',
  id_zone:         UUID_2,
  id_type_dechets: UUID_3
};

const validPayload = {
  reference:       'BIN-001',
  latitude:        48.8566,
  longitude:       2.3522,
  capacite_totale: 500,
  id_zone:         UUID_2,
  id_type_dechets: UUID_3
};

const makeRepo = (overrides = {}) => ({
  findAll:  jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(null),
  create:   jest.fn().mockResolvedValue(mockConteneur),
  update:   jest.fn().mockResolvedValue(mockConteneur),
  remove:   jest.fn().mockResolvedValue(true),
  ...overrides
});

// ─────────────────────────────────────────────────────────────
// SUITE : getAll
// ─────────────────────────────────────────────────────────────

describe('getAll', () => {

  test('retourne un tableau vide quand aucun conteneur', async () => {
    const service = createConteneurService(makeRepo({ findAll: jest.fn().mockResolvedValue([]) }));
    expect(await service.getAll()).toEqual([]);
  });

  test('retourne la liste complète des conteneurs', async () => {
    const service = createConteneurService(makeRepo({ findAll: jest.fn().mockResolvedValue([mockConteneur, mockConteneur]) }));
    expect(await service.getAll()).toHaveLength(2);
  });

  test('transmet les filtres au repository', async () => {
    const repo    = makeRepo({ findAll: jest.fn().mockResolvedValue([mockConteneur]) });
    const service = createConteneurService(repo);
    await service.getAll({ etat: 'actif' });
    expect(repo.findAll).toHaveBeenCalledWith({ etat: 'actif' });
  });

  test('appelle findAll exactement une fois', async () => {
    const repo    = makeRepo();
    const service = createConteneurService(repo);
    await service.getAll();
    expect(repo.findAll).toHaveBeenCalledTimes(1);
  });

});

// ─────────────────────────────────────────────────────────────
// SUITE : getById
// ─────────────────────────────────────────────────────────────

describe('getById', () => {

  test('retourne le conteneur quand il existe', async () => {
    const service = createConteneurService(makeRepo({ findById: jest.fn().mockResolvedValue(mockConteneur) }));
    expect(await service.getById(UUID_1)).toEqual(mockConteneur);
  });

  test('lance NotFoundError si ID inexistant', async () => {
    const service = createConteneurService(makeRepo());
    await expect(service.getById('x')).rejects.toThrow(NotFoundError);
  });

  test('lance NotFoundError avec statut HTTP 404', async () => {
    const service = createConteneurService(makeRepo());
    await expect(service.getById('x')).rejects.toMatchObject({ status: 404 });
  });

  test('transmet l\'ID au repository', async () => {
    const repo    = makeRepo({ findById: jest.fn().mockResolvedValue(mockConteneur) });
    const service = createConteneurService(repo);
    await service.getById(UUID_1);
    expect(repo.findById).toHaveBeenCalledWith(UUID_1);
  });

});

// ─────────────────────────────────────────────────────────────
// SUITE : create
// ─────────────────────────────────────────────────────────────

describe('create', () => {

  test('crée un conteneur avec données valides', async () => {
    const repo    = makeRepo({ create: jest.fn().mockResolvedValue(mockConteneur) });
    const service = createConteneurService(repo);
    expect(await service.create(validPayload)).toEqual(mockConteneur);
    expect(repo.create).toHaveBeenCalledTimes(1);
  });

  test('lance ValidationError si reference manquante', async () => {
    const service = createConteneurService(makeRepo());
    const { reference, ...payload } = validPayload;
    await expect(service.create(payload)).rejects.toThrow(ValidationError);
  });

  test('lance ValidationError si id_zone manquant', async () => {
    const service = createConteneurService(makeRepo());
    const { id_zone, ...payload } = validPayload;
    await expect(service.create(payload)).rejects.toThrow(ValidationError);
  });

  test('lance ValidationError si id_type_dechets manquant', async () => {
    const service = createConteneurService(makeRepo());
    const { id_type_dechets, ...payload } = validPayload;
    await expect(service.create(payload)).rejects.toThrow(ValidationError);
  });

  test('lance ValidationError si latitude > 90', async () => {
    const service = createConteneurService(makeRepo());
    await expect(service.create({ ...validPayload, latitude: 200 })).rejects.toThrow(ValidationError);
  });

  test('lance ValidationError si latitude < -90', async () => {
    const service = createConteneurService(makeRepo());
    await expect(service.create({ ...validPayload, latitude: -100 })).rejects.toThrow(ValidationError);
  });

  test('lance ValidationError si longitude > 180', async () => {
    const service = createConteneurService(makeRepo());
    await expect(service.create({ ...validPayload, longitude: 300 })).rejects.toThrow(ValidationError);
  });

  test('lance ValidationError si longitude < -180', async () => {
    const service = createConteneurService(makeRepo());
    await expect(service.create({ ...validPayload, longitude: -200 })).rejects.toThrow(ValidationError);
  });

  test('lance ValidationError si capacite_totale négative', async () => {
    const service = createConteneurService(makeRepo());
    await expect(service.create({ ...validPayload, capacite_totale: -10 })).rejects.toThrow(ValidationError);
  });

  test('lance ValidationError si capacite_totale est zéro', async () => {
    const service = createConteneurService(makeRepo());
    await expect(service.create({ ...validPayload, capacite_totale: 0 })).rejects.toThrow(ValidationError);
  });

  test('accepte coordonnées GPS aux limites exactes (±90, ±180)', async () => {
    const service = createConteneurService(makeRepo({ create: jest.fn().mockResolvedValue(mockConteneur) }));
    await expect(service.create({ ...validPayload, latitude: 90, longitude: 180 })).resolves.toBeDefined();
  });

  test('n\'appelle pas create si validation échoue', async () => {
    const repo    = makeRepo();
    const service = createConteneurService(repo);
    await expect(service.create({})).rejects.toThrow(ValidationError);
    expect(repo.create).not.toHaveBeenCalled();
  });

});

// ─────────────────────────────────────────────────────────────
// SUITE : update
// ─────────────────────────────────────────────────────────────

describe('update', () => {

  test('met à jour un conteneur existant', async () => {
    const updated = { ...mockConteneur, etat: 'maintenance' };
    const repo    = makeRepo({ findById: jest.fn().mockResolvedValue(mockConteneur), update: jest.fn().mockResolvedValue(updated) });
    const service = createConteneurService(repo);
    expect((await service.update(UUID_1, { etat: 'maintenance' })).etat).toBe('maintenance');
  });

  test('lance NotFoundError si conteneur inexistant', async () => {
    const service = createConteneurService(makeRepo());
    await expect(service.update('x', {})).rejects.toThrow(NotFoundError);
  });

  test('n\'appelle pas update si conteneur introuvable', async () => {
    const repo    = makeRepo();
    const service = createConteneurService(repo);
    await expect(service.update('x', {})).rejects.toThrow();
    expect(repo.update).not.toHaveBeenCalled();
  });

});

// ─────────────────────────────────────────────────────────────
// SUITE : delete
// ─────────────────────────────────────────────────────────────

describe('delete', () => {

  test('supprime et retourne un message de confirmation', async () => {
    const repo    = makeRepo({ findById: jest.fn().mockResolvedValue(mockConteneur) });
    const service = createConteneurService(repo);
    const result  = await service.delete(UUID_1);
    expect(result.message).toContain('supprimé');
    expect(repo.remove).toHaveBeenCalledWith(UUID_1);
  });

  test('le message contient l\'ID du conteneur', async () => {
    const repo    = makeRepo({ findById: jest.fn().mockResolvedValue(mockConteneur) });
    const service = createConteneurService(repo);
    expect((await service.delete(UUID_1)).message).toContain(UUID_1);
  });

  test('lance NotFoundError si conteneur inexistant', async () => {
    const service = createConteneurService(makeRepo());
    await expect(service.delete('x')).rejects.toThrow(NotFoundError);
  });

  test('n\'appelle pas remove si conteneur introuvable', async () => {
    const repo    = makeRepo();
    const service = createConteneurService(repo);
    await expect(service.delete('x')).rejects.toThrow();
    expect(repo.remove).not.toHaveBeenCalled();
  });

});

// ─────────────────────────────────────────────────────────────
// SUITE : classes d'erreurs
// ─────────────────────────────────────────────────────────────

describe('Erreurs métier', () => {

  test('NotFoundError a le statut HTTP 404', () => {
    const err = new NotFoundError('test');
    expect(err.status).toBe(404);
    expect(err).toBeInstanceOf(Error);
  });

  test('ValidationError a le statut HTTP 400', () => {
    const err = new ValidationError('test');
    expect(err.status).toBe(400);
    expect(err).toBeInstanceOf(Error);
  });

  test('NotFoundError utilise le message par défaut', () => {
    expect(new NotFoundError().message).toBe('Ressource introuvable');
  });

  test('ValidationError utilise le message par défaut', () => {
    expect(new ValidationError().message).toBe('Données invalides');
  });

});
