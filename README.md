# EcoTrack

Plateforme de gestion intelligente des déchets urbains — microservices + React + Supabase.

**École :** INGETIS Paris — Master DevSecOps  
**Équipe :** Hamza — Ali — Soufiane — Fatima Zahra

---

## Architecture

```
Navigateur
    ↓
Frontend React (port 5173)
    ↓
Nginx / API Gateway (port 80)
    ├── /api/auth         → service-auth         (port 5001)
    ├── /api/bins         → service-containers   (port 5002)
    ├── /api/routes       → service-routes       (port 5003)
    ├── /api/iot          → service-iot          (port 5004)
    ├── /api/gamification → service-gamification (port 5005)
    └── /api/analytics    → service-analytics    (port 5006)
    
Base de données → Supabase local (PostgreSQL) → http://127.0.0.1:54323
Cache           → Redis (via Docker)
```

---

## Prérequis

Installer ces outils avant de commencer :

| Outil | Commande d'installation |
|---|---|
| **Node.js v18+** | https://nodejs.org |
| **Docker Desktop** | https://docker.com — le démarrer avant toute chose |
| **Supabase CLI** | Via Scoop (Windows) : `scoop install supabase` |

> Si Scoop n'est pas installé : `irm get.scoop.sh | iex` dans PowerShell, puis `scoop install supabase`.  
> Alternative sans installation : remplacer `supabase` par `npx supabase` dans toutes les commandes.

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

Lance PostgreSQL + Auth en local dans Docker. Attendre que la commande affiche les URLs (~30 secondes au premier lancement).

> Interface base de données : **http://127.0.0.1:54323**

---

### Étape 3 — Charger le schéma et les données

```bash
supabase db reset
```

Applique toutes les migrations (schéma, triggers, fonctions RPC) et charge `supabase/seed.sql` avec toutes les données de démonstration (bacs, zones, véhicules, tournées, utilisateurs).

---

### Étape 4 — Charger les comptes utilisateurs (logins)

Cette étape est **obligatoire** pour pouvoir se connecter à l'application.

1. Ouvrir **http://127.0.0.1:54323**
2. Cliquer sur **SQL Editor**
3. Copier-coller le contenu du fichier `supabase/seed_auth.sql`
4. Cliquer **Run**

> `psql` alternatif (si installé) : `psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f supabase/seed_auth.sql`

---

### Étape 5 — Configurer les variables d'environnement Docker

Créer le fichier `.env` principal lu par Docker Compose :

```bash
# Windows PowerShell
cp microservices/.env.example microservices/.env

# Mac / Linux
cp microservices/.env.example microservices/.env
```

> Ce fichier contient les clés Supabase locales (identiques sur toutes les machines) et est ignoré par Git.

---

### Étape 6 — Démarrer les microservices

```bash
cd microservices
docker compose up --build
```

Lance les 7 services + Redis en parallèle dans Docker.  
La première fois, Docker télécharge et build les images (~3-5 minutes).  
Les fois suivantes : `docker compose up` suffit (sans `--build`).

**Garder ce terminal ouvert.** Tous les services tournent ici.

> Pour vérifier que tout tourne : ouvrir Docker Desktop — 7 services doivent être verts.

---

### Étape 7 — Démarrer le frontend

Dans un **nouveau terminal** :

```bash
cd frontend
npm install
npm run dev
```

Application accessible sur **http://localhost:5173**

---

### Étape 8 — Simulateur IoT (optionnel)

Le simulateur incrémente le remplissage des bacs toutes les 5 minutes et détecte automatiquement les nouveaux bacs et les resets.

Dans un **nouveau terminal** :

```bash
cd microservices/service-iot
node simulator.js
```

Modes disponibles :
```bash
node simulator.js              # 5 minutes (défaut)
node simulator.js 10000        # 10 secondes (test)
node simulator.js 1000 fast    # mode rapide (test alertes)
```

---

## Comptes de démonstration

Les mots de passe sont dans `supabase/seed_auth.sql`.

| Rôle | Email |
|---|---|
| Gestionnaire | gestionnaire@ecotrack.fr |
| Agent de collecte | agent@ecotrack.fr |
| Citoyen | citoyen@ecotrack.fr |

---

## Rôles et accès

| Rôle | Accès |
|---|---|
| **Gestionnaire** | Conteneurs, zones, tournées, véhicules, agents, alertes IoT, analytics |
| **Agent de collecte** | Ses tournées (démarrer / terminer), carte des bacs avec niveaux de remplissage |
| **Citoyen** | Carte des points de collecte, signalements, récompenses & badges |

---

## Commandes quotidiennes

```bash
# Démarrer Supabase
supabase start

# Démarrer les microservices (dans microservices/)
docker compose up

# Démarrer le frontend (dans frontend/)
npm run dev

# Simulateur IoT (dans microservices/service-iot/)
node simulator.js

# Arrêter Supabase
supabase stop

# Réinitialiser complètement la base de données
supabase db reset
```

---

## Dépannage

| Problème | Solution |
|---|---|
| `supabase` non reconnu | Installer via Scoop : `scoop install supabase`, ou utiliser `npx supabase` |
| `docker compose up` — variables non définies | Vérifier que `microservices/.env` existe (copié depuis `.env.example`) |
| Services Docker qui crashent en boucle | Vérifier que `supabase start` tourne avant Docker |
| Impossible de se connecter | Vérifier que l'étape 4 (seed_auth.sql) a été faite via Supabase Studio |
| Bacs absents de la carte | Les bacs doivent avoir une latitude et longitude — les éditer dans Gestionnaire → Conteneurs |
| Remplissage ne se met pas à jour | Lancer le simulateur : `node simulator.js` |
| Simulateur — "fetch failed" | Vérifier que les microservices Docker tournent (`docker compose up`) |
| Réinitialiser la base | `supabase db reset` puis refaire l'étape 4 |