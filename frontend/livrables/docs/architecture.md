# Architecture — EcoTrack API
**Étudiants :** Hamza — Ali — Soufiane — Fatima Zahra
**Date :** Mars 2026

---

## Vue d'ensemble

L'API EcoTrack suit une architecture en 4 couches strictement séparées. Chaque couche a une responsabilité unique et ne connaît que la couche immédiatement inférieure.

```
Client HTTP
    ↓
Routes        → Définit les URLs
    ↓
Controllers   → Gère HTTP (req, res)
    ↓
Services      → Logique métier
    ↓
Repositories  → Accès base de données
    ↓
Supabase
```

---

## Structure des dossiers

```
backend/
├── ecosystem.config.js       → Configuration PM2
├── .env.example              → Variables d'environnement
└── src/
    ├── app.js                → Configuration Express
    ├── server.js             → Démarrage serveur
    ├── config/
    │   ├── supabase.js       → Client Supabase
    │   ├── redis.js          → Client Redis
    │   ├── database.js       → Pool + monitoring
    │   └── logger.js         → Winston logger
    ├── errors/
    │   └── AppError.js       → Erreurs personnalisées
    ├── middlewares/
    │   ├── auth.middleware.js       → Vérification JWT
    │   ├── roles.middleware.js      → RBAC
    │   ├── validate.middleware.js   → Validation Joi
    │   ├── cache.middleware.js      → Cache Redis
    │   └── rateLimit.middleware.js  → Rate Limiting
    └── modules/
        ├── users/
        │   ├── users.routes.js
        │   └── auth.controller.js
        ├── bins/
        │   ├── bins.routes.js
        │   ├── bins.controller.js
        │   ├── bins.service.js
        │   ├── bins.repository.js
        │   ├── bins.validation.js
        │   └── __tests__/
        │       ├── bins.service.test.js
        │       └── bins.routes.test.js
        └── stats/
            └── health.routes.js
```

---

## Rôle de chaque couche

### Routes (`*.routes.js`)
- Définit uniquement les URLs
- Branche les middlewares dans le bon ordre
- Maximum 1 ligne par route

### Controllers (`*.controller.js`)
- Extrait les données de `req.params`, `req.query`, `req.body`
- Appelle le Service
- Retourne le bon code HTTP
- Passe les erreurs au middleware global avec `next(err)`

### Services (`*.service.js`)
- Contient toute la logique métier
- Ne connaît pas Express (pas de req/res)
- Utilise uniquement le Repository pour les données
- Lance des erreurs typées (NotFoundError, ValidationError)

### Repositories (`*.repository.js`)
- Contient uniquement les requêtes Supabase
- Si on change de base de données, seul ce fichier change
- Retourne les données brutes

---

## Flux d'une requête

```
POST /api/bins
    ↓
authMiddleware       → vérifie le JWT
    ↓
rolesMiddleware      → vérifie le rôle admin
    ↓
validate(schema)     → valide req.body avec Joi
    ↓
binsController.create → extrait req.body, appelle service
    ↓
binsService.createBin → valide règles métier, appelle repository
    ↓
binsRepository.create → INSERT dans Supabase
    ↓
Réponse HTTP 201
```

---

## Gestion des erreurs

Toutes les erreurs remontent via `next(err)` jusqu'au middleware global dans `app.js` :

```javascript
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(err.status || 500).json({ error: err.message });
});
```

Classes d'erreurs personnalisées :

| Classe | Code HTTP | Usage |
|---|---|---|
| NotFoundError | 404 | Ressource introuvable |
| ValidationError | 400 | Données invalides |
| UnauthorizedError | 401 | Non authentifié |
| ForbiddenError | 403 | Accès refusé |
