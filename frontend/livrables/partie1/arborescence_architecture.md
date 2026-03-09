# Architecture EcoTrack API — Structure des dossiers
**Étudiants :** Hamza/ALI/Soufiane/Fatima Zahra  
**Date :** Mars 2026

---

## Arborescence complète

```
ecotrack-db-SAH/
└── backend/
    ├── package.json
    ├── .env                          → variables d'environnement (jamais committé)
    ├── .env.example                  → exemple de variables (committé)
    ├── ecosystem.config.js           → configuration PM2 (clustering)
    │
    └── src/
        ├── server.js                 → point d'entrée : charge dotenv, démarre le serveur
        ├── app.js                    → configure Express, middlewares globaux, routes
        │
        ├── config/
        │   └── supabase.js           → connexion Supabase (singleton)
        │
        ├── errors/
        │   └── AppError.js           → classes d'erreurs personnalisées
        │                               (NotFoundError, ValidationError, etc.)
        │
        ├── middlewares/
        │   ├── auth.middleware.js    → vérifie le JWT, injecte req.user
        │   ├── roles.middleware.js   → vérifie les rôles (RBAC)
        │   └── validate.middleware.js → valide req.body avec schémas Joi
        │
        └── modules/
            ├── users/
            │   ├── users.routes.js       → ROUTES : définit les URLs /api/auth
            │   └── auth.controller.js    → CONTROLLER : gère register/login/refresh
            │
            ├── bins/
            │   ├── bins.routes.js        → ROUTES : définit les URLs /api/bins
            │   ├── bins.controller.js    → CONTROLLER : extrait params, appelle service
            │   ├── bins.service.js       → SERVICE : logique métier des conteneurs
            │   └── bins.repository.js    → REPOSITORY : accès Supabase table conteneur
            │
            ├── measurements/
            │   ├── measurements.routes.js
            │   ├── measurements.controller.js
            │   ├── measurements.service.js
            │   └── measurements.repository.js
            │
            └── stats/
                ├── stats.routes.js
                ├── stats.controller.js
                └── stats.service.js
```

## Flux d'une requête

```
Client HTTP
    ↓
bins.routes.js        → router.get('/', binsController.getAll)
    ↓
bins.controller.js    → extrait req.query, appelle binsService.getAllBins()
    ↓
bins.service.js       → applique la logique métier, appelle binsRepository.findAll()
    ↓
bins.repository.js    → exécute la requête Supabase
    ↓
Réponse JSON au client
```
