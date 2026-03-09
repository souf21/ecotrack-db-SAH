# Sécurité — EcoTrack API
**Étudiants :** Hamza — Ali — Soufiane — Fatima Zahra
**Date :** Mars 2026

---

## 1. Authentification JWT

Les routes protégées utilisent des JSON Web Tokens via Supabase Auth.

**Fonctionnement :**
1. L'utilisateur se connecte via `POST /api/auth/login`
2. Supabase retourne un access token (15 min) et un refresh token (7 jours)
3. Chaque requête protégée envoie le token dans le header : `Authorization: Bearer <token>`
4. `auth.middleware.js` vérifie le token via `supabase.auth.getUser(token)`
5. Si invalide → HTTP 401

**Pourquoi l'access token dure 15 minutes ?**
Si un attaquant vole le token, il ne peut l'utiliser que 15 minutes maximum.

---

## 2. Mots de passe

Les mots de passe sont hachés automatiquement par Supabase Auth avec bcrypt. Aucun mot de passe n'est jamais stocké en clair.

---

## 3. RBAC — Contrôle d'accès par rôles

| Rôle | GET | POST | PUT | DELETE |
|---|---|---|---|---|
| admin | Oui | Oui | Oui | Oui |
| manager | Oui | Oui | Oui | Non |
| collector | Oui | Non | Oui | Non |
| analyst | Oui | Non | Non | Non |
| citizen | Oui | Non | Non | Non |

Les rôles sont stockés dans Supabase (tables `role` et `user_role`) et vérifiés à chaque requête par `roles.middleware.js`.

---

## 4. Validation des entrées

Toutes les données entrantes sont validées avec Joi avant traitement. Si une donnée est invalide → HTTP 400 avec le détail des erreurs.

Exemples de validations :
- `latitude` : nombre entre -90 et 90
- `longitude` : nombre entre -180 et 180
- `id_zone` : UUID valide
- `etat` : uniquement actif | inactif | maintenance
- `reference` : string entre 2 et 50 caractères

---

## 5. Rate Limiting

Protection contre les attaques brute-force et DoS.

| Route | Limite | Fenêtre |
|---|---|---|
| POST /api/auth/login | 5 requêtes | 15 minutes |
| Toutes les routes /api/ | 100 requêtes | 1 minute |

Au-delà → HTTP 429 Too Many Requests.

---

## 6. Variables d'environnement

Aucun secret n'est écrit en dur dans le code. Tout est dans `.env` :
- `SUPABASE_URL` et `SUPABASE_ANON_KEY` → connexion base de données
- `JWT_SECRET` → signature des tokens

Le fichier `.env` est dans `.gitignore` et ne sera jamais commité.

---

## 7. Headers de sécurité

CORS est configuré pour n'autoriser que les origines connues. En production, `cors({ origin: 'https://votre-frontend.com' })` remplace `cors()`.
