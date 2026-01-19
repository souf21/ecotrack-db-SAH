# ADR-001 : Choix de l'Authentification et RBAC

## Contexte
Besoin d'un système d'authentification sécurisé et rapide avec gestion des rôles (RBAC) pour EcoTrack.

## Décision prise
- Utilisation de **Supabase Auth** pour inscription, login, refresh et génération JWT automatique  
- Validation JWT via middleware `auth.middleware.js` (supabase.auth.getUser(token))  
- Contrôle RBAC via middleware `roles.middleware.js` (vérification dans tables `role` et `user_role`)  
- Rôle par défaut : `citizen` assigné automatiquement à l'inscription

## Alternatives rejetées
- Auth0 / Firebase : trop lourd ou payant pour un projet étudiant  
- JWT 100% maison (jsonwebtoken seul) : risque sécurité + temps de dev

## Conséquences positives
- Sécurité standard (JWT signé par Supabase)  
- Refresh token géré nativement  
- RBAC simple et extensible (ajout de rôles facile)  
- Tests faciles avec Postman

## Conséquences négatives
- Dépendance à Supabase Auth  
- Gestion manuelle de l'insertion dans `public.user`

## Preuves / Tests validés
- Captures Postman dans Docs/Captures/
- Matrice RBAC dans Docs/Matrice-RBAC.md
- Schéma IAM dans Docs/Schema-IAM.png