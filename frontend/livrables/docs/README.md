# EcoTrack API

**Étudiants :** Hamza — Ali — Soufiane — Fatima Zahra
**Date :** Mars 2026
**École :** INGETIS Paris — Master DevSecOps

API REST pour la gestion des conteneurs de déchets connectés.

---

## Prérequis

- Node.js v18+
- Redis (via WSL sur Windows)
- Compte Supabase

---

## Installation

```bash
# 1. Cloner le projet
git clone https://github.com/souf21/ecotrack-db-SAH
cd ecotrack-db-SAH/backend

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Remplir les valeurs dans .env

# 4. Démarrer Redis (WSL)
wsl
sudo service redis-server start
exit
```

---

## Lancement

```bash
# Développement
npm run dev

# Production avec PM2 (clustering)
pm2 start ecosystem.config.js

# Vérifier que tout tourne
pm2 list
```

---

## Tests

```bash
# Lancer tous les tests avec couverture
npm test
```

---

## Endpoints principaux

| Méthode | Route | Description | Auth |
|---|---|---|---|
| GET | /ping | Test de vie | Non |
| GET | /health | Santé API | Non |
| GET | /health/db | Santé base de données | Non |
| GET | /health/redis | Santé Redis | Non |
| POST | /api/auth/register | Créer un compte | Non |
| POST | /api/auth/login | Se connecter | Non |
| POST | /api/auth/refresh | Renouveler token | Non |
| GET | /api/bins | Liste des conteneurs | Non |
| GET | /api/bins/:id | Détail conteneur | Non |
| POST | /api/bins | Créer conteneur | Admin |
| PUT | /api/bins/:id | Modifier conteneur | Manager |
| DELETE | /api/bins/:id | Supprimer conteneur | Admin |

---

## Variables d'environnement

Voir `.env.example` pour la liste complète.
