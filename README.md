# EcoTrack

Plateforme de gestion intelligente des déchets urbains — microservices + React + Supabase.

**École :** INGETIS Paris — Master DevSecOps  
**Équipe :** Hamza — Ali — Soufiane — Fatima Zahra

---

## Architecture

```
nginx (port 80)
  ├── /api/auth         → service-auth         (port 5001)
  ├── /api/bins         → service-containers   (port 5002)
  ├── /api/routes       → service-routes       (port 5003)
  ├── /api/iot          → service-iot          (port 5004)
  ├── /api/gamification → service-gamification (port 5005)
  └── /api/analytics    → service-analytics    (port 5006)

Frontend (React + Vite)  →  http://localhost:5173
Database                 →  Supabase local (PostgreSQL) → http://127.0.0.1:54323
Cache                    →  Redis (via Docker)
```

---

## Prérequis

Installer ces outils avant de commencer :

| Outil | Version | Commande d'installation |
|---|---|---|
| Node.js | v18+ | https://nodejs.org |
| Docker Desktop | dernière | https://docker.com |
| Supabase CLI | dernière | `npm install -g supabase` |

Vérifier que Docker Desktop est **démarré** avant de continuer.

---

## Installation complète (à faire une seule fois)

### Étape 1 — Cloner le projet

```bash
git clone https://github.com/souf21/ecotrack-db-SAH
cd ecotrack-db-SAH
```

---

### Étape 2 — Démarrer Supabase en local

```bash
supabase start
```

Cela lance PostgreSQL, Auth et Storage dans Docker.  
Attendre que la commande affiche les URLs (environ 30 secondes au premier lancement).

> Studio (interface base de données) : **http://127.0.0.1:54323**

---

### Étape 3 — Charger le schéma et les données

```bash
supabase db reset
```

Cette commande fait **trois choses en une** :
1. Recrée la base de données propre
2. Applique toutes les migrations (`supabase/migrations/`)
3. Charge les données de `supabase/seed.sql` (bacs, zones, véhicules, tournées, utilisateurs…)

> Ne pas sauter cette étape — elle crée aussi les triggers et fonctions SQL nécessaires au bon fonctionnement.

---

### Étape 4 — Charger les comptes utilisateurs (logins)

```bash
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f supabase/seed_auth.sql
```

> Si `psql` n'est pas installé, ouvrir **http://127.0.0.1:54323**, aller dans **SQL Editor**, et coller le contenu du fichier `supabase/seed_auth.sql`.

---

### Étape 5 — Configurer les variables d'environnement

Copier les fichiers `.env.example` pour chaque microservice :

```bash
cp microservices/service-auth/.env.example         microservices/service-auth/.env
cp microservices/service-containers/.env.example   microservices/service-containers/.env
cp microservices/service-routes/.env.example       microservices/service-routes/.env
cp microservices/service-iot/.env.example          microservices/service-iot/.env
cp microservices/service-gamification/.env.example microservices/service-gamification/.env
cp microservices/service-analytics/.env.example    microservices/service-analytics/.env
cp microservices/api-gateway/.env.example          microservices/api-gateway/.env
```

> Les valeurs par défaut fonctionnent directement avec `supabase start`. Aucune modification nécessaire pour le développement local.

---

### Étape 6 — Démarrer les microservices

```bash
cd microservices
docker compose up --build
```

La première fois, Docker télécharge et construit les images (quelques minutes).  
Les fois suivantes : `docker compose up` suffit (sans `--build`).

Garder ce terminal ouvert. Les services tournent sur les ports 5001–5006.

---

### Étape 7 — Démarrer le frontend

Dans un **nouveau terminal** :

```bash
cd frontend
npm install
npm run dev
```

L'application est accessible sur **http://localhost:5173**

---

### Étape 8 — Démarrer le simulateur IoT (optionnel mais recommandé)

Dans un **nouveau terminal** :

```bash
cd microservices/service-iot
node simulator.js
```

Le simulateur incrémente automatiquement le remplissage de chaque bac toutes les **5 minutes**.  
Il détecte les nouveaux bacs et les resets sans avoir besoin d'être redémarré.

```bash
node simulator.js 10000       # toutes les 10 secondes (pour tester)
node simulator.js 1000 fast   # mode rapide (pour tester les alertes)
```

---

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Gestionnaire | gestionnaire@ecotrack.fr | *(voir seed_auth.sql)* |
| Agent | agent@ecotrack.fr | *(voir seed_auth.sql)* |
| Citoyen | citoyen@ecotrack.fr | *(voir seed_auth.sql)* |

---

## Rôles et accès

| Rôle | Accès |
|---|---|
| **Gestionnaire** | Conteneurs, zones, tournées, véhicules, agents, alertes IoT, analytics |
| **Agent de collecte** | Ses tournées (démarrer / terminer), carte des bacs avec niveaux de remplissage |
| **Citoyen** | Carte des points de collecte, signalements, récompenses & badges |

---

## Résumé des commandes (usage quotidien)

```bash
# Démarrer Supabase
supabase start

# Démarrer les microservices (dans microservices/)
docker compose up

# Démarrer le frontend (dans frontend/)
npm run dev

# Démarrer le simulateur IoT (dans microservices/service-iot/)
node simulator.js

# Arrêter Supabase proprement
supabase stop
```

---

## Dépannage

**`supabase start` échoue** → vérifier que Docker Desktop est démarré.

**`docker compose up` échoue sur un port occupé** → un autre service utilise déjà ce port. Arrêter l'application concernée ou changer le PORT dans le `.env`.

**Les bacs n'apparaissent pas sur la carte** → les bacs doivent avoir une latitude et longitude renseignées. Les modifier dans Gestionnaire → Conteneurs.

**Le remplissage ne se met pas à jour** → vérifier que le simulateur est en cours d'exécution (`node simulator.js`).

**Réinitialiser complètement la base** → `supabase db reset` (recharge toutes les migrations + seed).
