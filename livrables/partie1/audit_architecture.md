# Audit Architecture — API EcoTrack
**Étudiants :** Hamza/ALI/Soufiane/Fatima Zahra  
**Date :** Mars 2026  
**Projet :** EcoTrack API — Refactorisation vers une architecture professionnelle

---

## 1. Analyse du code original

### Problèmes identifiés dans `auth.controller.js`

#### La route contient-elle de la logique métier ?
**OUI.** La fonction `register` fait en une seule fois :
- La création du compte Supabase Auth
- L'insertion dans la table `public.user`
- La recherche du rôle "citizen"
- L'assignation du rôle à l'utilisateur

Toute cette logique métier devrait être dans une couche Service dédiée.

#### La route fait-elle directement des requêtes SQL ?
**OUI.** Les appels Supabase (équivalent requêtes SQL) sont directement dans le controller :
```javascript
const { data } = await supabase.from('user').insert({...})
const { data } = await supabase.from('role').select('id_role')
const { data } = await supabase.from('user_role').insert({...})
```
Ces accès base de données devraient être isolés dans une couche Repository.

#### Y a-t-il des try/catch partout dans les routes ?
**OUI.** Chaque fonction (register, login, refresh) a son propre bloc try/catch indépendant. Il n'existe pas de gestionnaire d'erreurs centralisé. Résultat : le code de gestion d'erreurs est dupliqué partout.

#### Le code est-il testable unitairement ?
**NON.** Impossible de tester la logique métier (ex: assignation du rôle citizen) sans :
- Lancer un vrai serveur Express
- Avoir une connexion Supabase active
- Simuler de vraies requêtes HTTP

---

## 2. Responsabilités mélangées

Dans la fonction `register` originale, on compte **6 responsabilités différentes** dans une seule fonction :

| # | Responsabilité | Problème |
|---|---|---|
| 1 | Réception HTTP | Devrait rester dans la route |
| 2 | Validation des données | Devrait être dans un middleware dédié |
| 3 | Logique métier (création compte + assignation rôle) | Devrait être dans le Service |
| 4 | Accès base de données (3 appels Supabase) | Devrait être dans le Repository |
| 5 | Formatage de la réponse JSON | Devrait être dans le Controller |
| 6 | Gestion des erreurs (try/catch) | Devrait être centralisé dans un middleware global |

---

## 3. Autres problèmes identifiés

### Dans `users.routes.js`
- Code commenté laissé dans le fichier (mauvaise pratique)
- `console.log('authController =', authController)` en production
- Plusieurs versions du même code coexistent dans le même fichier

### Dans `roles.middleware.js` (version originale)
- `next()` suivi de `res.status(500)` après — provoque un crash car on ne peut pas envoyer deux réponses
- Le bloc `try` n'avait pas de `catch` correspondant

### Dans `auth.controller.js`
- Fonction `refresh` cassée : `res.json({` manquait, rendant la fonction inutilisable

### Dans `server.js` / `index.js`
- Deux fichiers faisaient la même chose (démarrer le serveur)
- `dotenv` n'était pas chargé au bon endroit
- Variables d'environnement non chargées au démarrage

### Dans `app.js`
- `dotenv` non chargé → variables SUPABASE_URL et SUPABASE_ANON_KEY indisponibles
- Pas de middleware de gestion d'erreurs global

---

