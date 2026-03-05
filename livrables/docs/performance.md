# Performance — EcoTrack API
**Étudiants :** Hamza — Ali — Soufiane — Fatima Zahra
**Date :** Mars 2026

---

## 1. Clustering PM2

**Problème :** Node.js est mono-thread. Sans clustering, seul 1 cœur CPU est utilisé.

**Solution :** PM2 en mode cluster lance autant d'instances que de cœurs CPU.

**Configuration :**
```javascript
instances: 'max',
exec_mode: 'cluster'
```

**Résultat mesuré :**

| | Sans clustering | Avec clustering |
|---|---|---|
| Instances | 1 | 6 |
| Cœurs utilisés | 1/6 | 6/6 |
| Capacité théorique | ~100 req/sec | ~600 req/sec |
| Mémoire totale | ~60MB | ~380MB |

**Preuve :**
```
pm2 list
┌────┬──────────────┬─────────┬────────┐
│ 0  │ ecotrack-api │ cluster │ online │
│ 1  │ ecotrack-api │ cluster │ online │
│ 2  │ ecotrack-api │ cluster │ online │
│ 3  │ ecotrack-api │ cluster │ online │
│ 4  │ ecotrack-api │ cluster │ online │
│ 5  │ ecotrack-api │ cluster │ online │
└────┴──────────────┴─────────┴────────┘
```

---

## 2. Cache Redis

**Problème :** Chaque requête `GET /api/bins` interroge Supabase (~50ms).

**Solution :** Cache-Aside pattern avec Redis. La réponse est stockée 1 heure.

**TTL configurés :**

| Données | TTL | Raison |
|---|---|---|
| Liste des conteneurs | 1 heure | Change rarement |
| Détail conteneur | 1 heure | Change rarement |
| Stats quotidiennes | 24 heures | Calculées une fois par jour |

**Résultats mesurés :**

| | Sans cache | Avec cache |
|---|---|---|
| Temps de réponse | ~50ms | ~1ms |
| Gain | — | 50x plus rapide |
| Source | Supabase | Redis (mémoire) |

**Preuve dans les logs :**
```
[CACHE] Miss pour cache:/api/bins  → 50ms (Supabase)
[CACHE] Hit pour cache:/api/bins   → 1ms  (Redis)
```

---

## 3. Connection Pooling

**Problème :** Ouvrir une connexion PostgreSQL prend 10-50ms. Avec 1000 req/sec, c'est intenable.

**Solution :** Supabase utilise PgBouncer en interne. Notre configuration :

| Paramètre | Valeur |
|---|---|
| Workers PM2 | 6 |
| Connexions par worker | 10 |
| Max connexions total | 60 |
| Idle timeout | 30 secondes |

Formule : `6 workers × 10 connexions = 60 connexions max`

**Monitoring toutes les 30 secondes :**
```json
{
  "message": "Pool DB status",
  "responseTime": "45ms",
  "status": "healthy"
}
```

---

## 4. Logging

**Problème :** `console.log()` est synchrone et bloque le thread en production.

**Solution :** Winston (asynchrone) + Morgan pour les requêtes HTTP.

- En développement : niveau `debug` — tout est loggé
- En production : niveau `info` — seulement l'essentiel

**Logs Morgan réels :**
```
GET  /api/bins  200  36b  PostmanRuntime/7.51.0
POST /api/bins  401  26b
DELETE /api/bins/:id  401  26b
```
