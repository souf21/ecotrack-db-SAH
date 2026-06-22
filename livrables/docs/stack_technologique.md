# Stack Technologique — EcoTrack

## Schéma d'interconnexion

```
┌─────────────────────────────────────────────────────────────────────┐
│                          NAVIGATEUR / CLIENT                         │
│                                                                     │
│   ╔══════════════════════════════════════════════════════════════╗  │
│   ║        ⚛  REACT 19  (Vite · TypeScript · Tailwind)          ║  │
│   ║   Carte Leaflet · Tableaux · Formulaires · Graphiques        ║  │
│   ╚══════════════════════╤═══════════════════════════════════════╝  │
└──────────────────────────┼──────────────────────────────────────────┘
                           │  HTTP / REST  (JSON)
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    🐳  DOCKER  (docker-compose)                      │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                 🔀  API GATEWAY  :80                         │    │
│  │          Reverse-proxy · Auth JWT · Rate-limiting            │    │
│  └──┬──────────┬──────────┬──────────┬──────────┬──────────┬───┘    │
│     │          │          │          │          │          │         │
│     ▼          ▼          ▼          ▼          ▼          ▼         │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│  │ AUTH │  │CONT. │  │ROUTE │  │ IoT  │  │GAMIF.│  │ANALY.│       │
│  │:5001 │  │:5002 │  │:5003 │  │:5004 │  │:5005 │  │:5006 │       │
│  └──┬───┘  └──┬───┘  └──┬───┘  └──┬───┘  └──┬───┘  └──┬───┘       │
│     │          │  🟢 Node.js + Express (tous les services)  │        │
│     └──────────┴──────────┴────┬────┴──────────┴──────────┘         │
│                                │                                     │
│              ┌─────────────────┼──────────────────┐                 │
│              │                 │                  │                  │
│              ▼                 ▼                  ▼                  │
│       ┌────────────┐   ┌─────────────┐   ┌──────────────┐          │
│       │  🔴 REDIS  │   │  🐘 SUPA-   │   │   (futur)    │          │
│       │  :6379     │   │  BASE API   │   │  📨 KAFKA ?  │          │
│       │  Cache /   │   │  (PostgREST │   │  Event       │          │
│       │  Sessions  │   │  + Auth)    │   │  Streaming   │          │
│       └────────────┘   └──────┬──────┘   └──────────────┘          │
└────────────────────────────────┼─────────────────────────────────────┘
                                 │  SQL / PostgREST
                                 ▼
                    ┌────────────────────────┐
                    │  🐘  POSTGRESQL 15     │
                    │  (hébergé Supabase)    │
                    │                        │
                    │  • users / profiles    │
                    │  • containers          │
                    │  • collect_routes      │
                    │  • iot_readings        │
                    │  • gamification        │
                    │  • analytics KPIs      │
                    └────────────────────────┘
```

---

## Tableau comparatif synthétique

| Technologie | Logo | Rôle dans EcoTrack | Couche | Interconnexions |
|---|---|---|---|---|
| **React 19** | ⚛ | Interface utilisateur — carte interactive, dashboards, formulaires | Frontend | → API Gateway (HTTP/REST) |
| **Node.js + Express** | 🟢 | Logique métier de chaque microservice (Auth, IoT, Routes…) | Backend | ← API Gateway · → Supabase · → Redis |
| **PostgreSQL 15** | 🐘 | Base de données relationnelle principale — toutes les tables métier | Données | ← tous les services via Supabase SDK |
| **Supabase** | ⚡ | BaaS : héberge PostgreSQL + PostgREST + Auth + Realtime | Infra data | ← Node.js (@supabase/supabase-js) |
| **Redis 7** | 🔴 | Cache mémoire — sessions JWT, rate-limit, résultats fréquents | Cache | ← service-auth, service-containers |
| **Docker** | 🐳 | Conteneurisation et orchestration locale (docker-compose) | Infra | enveloppe tous les services |
| **Kafka** | 📨 | *(non implémenté — prévu pour event streaming IoT temps réel)* | Messaging | remplacerait les appels REST inter-services |

---

## Flux de données principaux

```
Utilisateur
    │
    │  1. Requête HTTP
    ▼
React ──────────► API Gateway ──────────► Microservice ciblé
                                               │
                      ┌────────────────────────┤
                      │                        │
                      ▼                        ▼
                   Redis                  Supabase
               (cache hit ?)          (lecture / écriture
                      │                  PostgreSQL)
                      │                        │
                      └────────────────────────┘
                                    │
                                    │  Réponse JSON
                                    ▼
                              API Gateway
                                    │
                                    ▼
                                 React
                          (mise à jour du DOM)
```

---

## Notes d'architecture

- **Kafka absent** : les microservices communiquent aujourd'hui via REST synchrone. Kafka serait pertinent pour découpler `service-iot` (ingestion capteurs) du reste et permettre du traitement de flux en temps réel.
- **Supabase ≠ PostgreSQL brut** : les services n'utilisent pas le driver `pg` directement mais le SDK `@supabase/supabase-js` qui passe par l'API PostgREST — la couche SQL reste standard (migrations `.sql`).
- **Docker Compose** : en dev, un seul fichier `docker-compose.yml` orchestre les 7 microservices + Redis. Supabase tourne en local via la CLI Supabase.
