# Documentation API — EcoTrack
**Étudiants :** Hamza — Ali — Soufiane — Fatima Zahra
**Date :** Mars 2026

Base URL : `http://localhost:5000`

---

## Authentification

Toutes les routes protégées nécessitent un header :
```
Authorization: Bearer <access_token>
```

---

## Auth

### POST /api/auth/register
Créer un nouveau compte.

**Body :**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123",
  "nom": "Dupont",
  "prenom": "Jean"
}
```

**Réponse 201 :**
```json
{
  "message": "Inscription réussie",
  "userId": "uuid",
  "email": "user@example.com"
}
```

---

### POST /api/auth/login
Se connecter et obtenir un JWT.

**Body :**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Réponse 200 :**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": { "id": "uuid", "email": "user@example.com" }
}
```

**Erreur 401 :** Identifiants incorrects
**Erreur 429 :** Trop de tentatives (5 max / 15 min)

---

### POST /api/auth/refresh
Renouveler l'access token.

**Body :**
```json
{ "refreshToken": "eyJ..." }
```

**Réponse 200 :**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

---

## Conteneurs (Bins)

### GET /api/bins
Liste tous les conteneurs. Résultat mis en cache 1 heure.

**Query params optionnels :**
- `etat` : actif | inactif | maintenance
- `id_zone` : UUID de la zone
- `id_type_dechets` : UUID du type de déchets

**Réponse 200 :**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id_conteneur": "uuid",
      "reference": "BIN-001",
      "adresse": "10 rue de la Paix",
      "latitude": 48.8566,
      "longitude": 2.3522,
      "capacite_totale": 500,
      "etat": "actif",
      "id_zone": "uuid",
      "id_type_dechets": "uuid"
    }
  ]
}
```

---

### GET /api/bins/:id
Détail d'un conteneur.

**Réponse 200 :** Objet conteneur
**Erreur 404 :** Conteneur introuvable

---

### POST /api/bins
Créer un conteneur. Rôle requis : **admin**

**Headers :** `Authorization: Bearer <token>`

**Body :**
```json
{
  "reference": "BIN-001",
  "adresse": "10 rue de la Paix",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "capacite_totale": 500,
  "etat": "actif",
  "id_zone": "uuid",
  "id_type_dechets": "uuid"
}
```

**Réponse 201 :** Objet conteneur créé
**Erreur 400 :** Données invalides
**Erreur 401 :** Token manquant
**Erreur 403 :** Rôle insuffisant

---

### PUT /api/bins/:id
Modifier un conteneur. Rôle requis : **manager**

**Headers :** `Authorization: Bearer <token>`

**Body :** Tous les champs sont optionnels
```json
{
  "etat": "maintenance",
  "adresse": "Nouvelle adresse"
}
```

**Réponse 200 :** Objet conteneur modifié
**Erreur 404 :** Conteneur introuvable

---

### DELETE /api/bins/:id
Supprimer un conteneur. Rôle requis : **admin**

**Headers :** `Authorization: Bearer <token>`

**Réponse 200 :**
```json
{ "success": true, "message": "Conteneur uuid supprimé avec succès" }
```

**Erreur 404 :** Conteneur introuvable

---

## Health Checks

### GET /health
```json
{ "status": "ok", "uptime": 42.3, "timestamp": "2026-03-04T15:00:00.000Z" }
```

### GET /health/db
```json
{ "status": "ok", "database": "Supabase connecté" }
```
Retourne **503** si Supabase est inaccessible.

### GET /health/redis
```json
{ "status": "ok", "redis": "Redis connecté" }
```
Retourne **503** si Redis est inaccessible.

---

## Codes d'erreur

| Code | Signification |
|---|---|
| 400 | Données invalides |
| 401 | Token manquant ou invalide |
| 403 | Rôle insuffisant |
| 404 | Ressource introuvable |
| 429 | Trop de requêtes |
| 500 | Erreur serveur |
| 503 | Service indisponible |
