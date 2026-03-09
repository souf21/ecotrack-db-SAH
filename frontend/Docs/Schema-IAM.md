## Description du Flux IAM - EcoTrack (Authentification + RBAC)

Ce schéma représente le flux complet d'authentification et de contrôle d'accès (IAM + RBAC) implémenté dans le projet EcoTrack.

### Phase d'Authentification initiale
1. L’utilisateur (Citizen, Agent, Gestionnaire, Admin ou Service) saisit ses identifiants (email + mot de passe) dans le **Frontend React**.
2. Le Frontend envoie une requête POST vers `/api/auth/login` (ou `/register`) au **Backend Express (Node.js)**.
3. Le Backend forward la requête vers **Supabase Auth** (serveur intégré).
4. Supabase Auth vérifie les credentials et génère un **JWT signé** (access_token + refresh_token).
5. Le JWT est retourné au Frontend, qui le stocke (localStorage ou cookie httpOnly).
6. Le Frontend utilise ce token pour toutes les requêtes protégées (header `Authorization: Bearer <token>`).

### Phase de Requêtes Protégées
7. Pour toute requête sensible, le Frontend ajoute le header Authorization avec le JWT.
8. Le **Backend Express** reçoit la requête et passe par :
   - **authMiddleware.js** : récupère le token → appelle `supabase.auth.getUser(token)` pour vérifier la signature et la validité.  
     → Si invalide ou expiré → retourne **401 Unauthorized**.
   - **rolesMiddleware('nom_rôle')** : interroge Supabase (`user_role JOIN role`) pour vérifier si l’utilisateur (via `req.user.id`) possède le rôle requis.  
     → Si rôle absent → retourne **403 Forbidden** ("Accès refusé - rôle requis").
9. Si token + rôle sont valides → la requête atteint le **Contrôleur** (ex: CRUD conteneurs, création signalement, optimisation tournées).
10. Réponse JSON retournée au Frontend.

### Couleurs et conformité
- Bleu : Phase d’authentification initiale  
- Vert : Frontend React et Supabase Auth  
- Orange : Backend Express (Node.js)  
- Vert foncé : Middlewares d’authentification et RBAC  
- Rouge : Erreurs de sécurité (401 Unauthorized, 403 Forbidden)

Ce schéma respecte :
- **M1.8** : Schéma IAM et gestion des identités/accès (RBAC avec 5 rôles)
- **M2.10** : Implémentation du flow d’authentification (OAuth/JWT via Supabase) et validation des tokens dans les APIs (middlewares auth + roles)