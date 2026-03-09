# Matrice RBAC - EcoTrack (Sprint Janvier 2026)

| Action / Endpoint                          | Citizen | Agent/Collecteur | Gestionnaire | Admin | Service |
|--------------------------------------------|---------|------------------|--------------|-------|---------|
| POST /api/auth/register                    | Oui     | Oui              | Oui          | Oui   | Non     |
| POST /api/auth/login                       | Oui     | Oui              | Oui          | Oui   | Non     |
| POST /api/auth/refresh                     | Oui     | Oui              | Oui          | Oui   | Non     |
| GET /api/auth/me                           | Oui     | Oui              | Oui          | Oui   | Non     |
| POST /api/signalements (signaler)          | Oui     | Non              | Non          | Non   | Non     |
| GET /api/signalements (voir tous)          | Non     | Oui              | Oui          | Oui   | Non     |
| POST /api/containers (créer conteneur)     | Non     | Non              | Oui          | Oui   | Non     |
| PUT /api/containers/:id                    | Non     | Non              | Oui          | Oui   | Non     |
| DELETE /api/containers/:id                 | Non     | Non              | Non          | Oui   | Non     |
| POST /api/tours/optimize (optimiser tournée)| Non     | Non              | Oui          | Oui   | Non     |
| GET /api/auth/admin-only (test RBAC)       | Non     | Non              | Non          | Oui   | Non     |

**Légende**  
- Oui = Autorisé  
- Non = Refusé (403 Forbidden)  

**Rôles définis**  
- citizen : utilisateur standard (défaut)  
- agent/collecteur : collecte et validation  
- gestionnaire : gestion conteneurs/tournées  
- admin : droits totaux  
- service : usage interne/API (non utilisé pour l’instant)