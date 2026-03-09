-- ================================
-- requetes.sql - 40 requêtes ECOTRACK
-- ================================

-- A. CRUD Basique (10)

-- 1. SELECT tous conteneurs
SELECT * FROM conteneur LIMIT 20;

-- 2. INSERT nouveau conteneur
INSERT INTO conteneur (reference, adresse, etat, latitude, longitude, capacite_totale, date_installation, id_zone, id_type_dechets)
VALUES ('CONT-TEST', 'Test adresse', 'Opérationnel', 45.7640, 4.8357, 1000, CURRENT_DATE, 1, 1);

-- 3. UPDATE statut conteneur
UPDATE conteneur SET etat = 'Hors service' WHERE reference = 'CONT-TEST';

-- 4. DELETE conteneur test
DELETE FROM conteneur WHERE reference = 'CONT-TEST';

-- 5. SELECT user par email
SELECT * FROM "user" WHERE email = 'agent1@ecotrack.fr';

-- 6. INSERT signalement
INSERT INTO signalement (type, description, statut, id_conteneur, id_user) VALUES ('Plein', 'Conteneur déborde', 'nouveau', 1, 1);

-- 7. UPDATE statut signalement
UPDATE signalement SET statut = 'résolu' WHERE id_signalement = (SELECT max(id_signalement) FROM signalement);

-- 8. SELECT tournées du jour
SELECT * FROM tournee WHERE date = CURRENT_DATE;

-- 9. INSERT mesure
INSERT INTO mesure (valeur, datetime, unite, id_capteur) VALUES (85.5, NOW(), '%', 1);

-- 10. DELETE ancienne mesure (exemple)
DELETE FROM mesure WHERE datetime < '2025-01-01';

-- B. Recherches & Filtres (10)

-- 11. Conteneurs pleins (>80%)
SELECT c.* FROM conteneur c
JOIN capteur cap ON cap.id_conteneur = c.id_conteneur
JOIN mesure m ON m.id_capteur = cap.id_capteur
WHERE m.valeur > 80 AND m.datetime > NOW() - interval '1 day'
ORDER BY m.valeur DESC LIMIT 20;

-- 12. Users par nom LIKE
SELECT * FROM "user" WHERE nom ILIKE '%dupont%';

-- 13. Signalements entre dates
SELECT * FROM signalement WHERE date_signalement BETWEEN '2025-12-01' AND '2025-12-31';

-- 14. Tournées planifiées
SELECT * FROM tournee WHERE statut = 'planifiée' ORDER BY date;

-- 15. Conteneurs par zone
SELECT * FROM conteneur WHERE id_zone = 1 LIMIT 10;

-- 16. Mesures par capteur ORDER BY datetime DESC
SELECT * FROM mesure WHERE id_capteur = 1 ORDER BY datetime DESC LIMIT 50;

-- 17. Users avec points > 100
SELECT * FROM "user" WHERE point_total > 100;

-- 18. Défis actifs
SELECT * FROM defi WHERE statut = 'actif';

-- 19. Conteneurs par type déchet
SELECT * FROM conteneur WHERE id_type_dechets = 1;

-- 20. Signalements statut 'nouveau' LIMIT 10
SELECT * FROM signalement WHERE statut = 'nouveau' ORDER BY date_signalement DESC LIMIT 10;

-- C. Jointures (10)

-- 21. Conteneurs avec zone et type déchets
SELECT c.*, z.nom_zone, t.libelle 
FROM conteneur c
JOIN zone z ON c.id_zone = z.id_zone
JOIN type_dechets t ON c.id_type_dechets = t.id_type_dechets;

-- 22. Mesures avec conteneur et zone
SELECT m.*, c.reference, z.nom_zone
FROM mesure m
JOIN capteur cap ON m.id_capteur = cap.id_capteur
JOIN conteneur c ON cap.id_conteneur = c.id_conteneur
JOIN zone z ON c.id_zone = z.id_zone
LIMIT 50;

-- 23. Signalements avec user et conteneur
SELECT s.*, u.nom || ' ' || u.prenom AS signaleur, c.reference
FROM signalement s
JOIN "user" u ON s.id_user = u.id_user
LEFT JOIN conteneur c ON s.id_conteneur = c.id_conteneur;

-- 24. Tournées avec véhicule et type
SELECT t.*, v.marque || ' ' || v.modele, tt.libelle
FROM tournee t
JOIN vehicule v ON t.matricule = v.matricule
JOIN type_tournee tt ON t.id_type_tournee = tt.id_type_tournee;

-- 25. Étapes tournées avec conteneur
SELECT et.*, c.reference, c.adresse
FROM etape_tournee et
JOIN conteneur c ON et.id_conteneur = c.id_conteneur;

-- 26. Users avec rôles
SELECT u.*, r.nom AS role
FROM "user" u
JOIN user_role ur ON u.id_user = ur.id_user
JOIN role r ON ur.id_role = r.id_role;

-- 27. Tournées réalisées par agent
SELECT t.*, u.nom || ' ' || u.prenom AS agent
FROM tournee t
JOIN realise r ON t.id_tournee = r.id_tournee
JOIN "user" u ON r.id_user = u.id_user;

-- 28. Participations défis avec user et défi
SELECT p.*, u.nom, d.titre
FROM participation_defi p
JOIN "user" u ON p.id_user = u.id_user
JOIN defi d ON p.id_defi = d.id_defi;

-- 29. Badges obtenus avec user
SELECT ub.*, u.nom, b.nom AS badge
FROM user_badge ub
JOIN "user" u ON ub.id_user = u.id_user
JOIN badge b ON ub.id_badge = b.id_badge;

-- 30. Conteneurs avec dernière mesure
SELECT c.*, m.valeur, m.datetime
FROM conteneur c
JOIN capteur cap ON c.id_conteneur = cap.id_conteneur
JOIN mesure m ON cap.id_capteur = m.id_capteur
WHERE m.datetime = (SELECT max(datetime) FROM mesure m2 WHERE m2.id_capteur = cap.id_capteur);

-- D. Agrégations & Statistiques (10)

-- 31. Nombre conteneurs par zone
SELECT z.nom_zone, COUNT(*) AS nb_conteneurs
FROM conteneur c
JOIN zone z ON c.id_zone = z.id_zone
GROUP BY z.nom_zone;

-- 32. Taux remplissage moyen par type déchet
SELECT t.libelle, AVG(m.valeur) AS taux_moyen
FROM mesure m
JOIN capteur cap ON m.id_capteur = cap.id_capteur
JOIN conteneur c ON cap.id_conteneur = c.id_conteneur
JOIN type_dechets t ON c.id_type_dechets = t.id_type_dechets
WHERE m.datetime > NOW() - interval '1 day'
GROUP BY t.libelle;

-- 33. Nombre signalements par statut
SELECT statut, COUNT(*) FROM signalement GROUP BY statut;

-- 34. Points totaux par user (top 10)
SELECT nom || ' ' || prenom, point_total FROM "user" ORDER BY point_total DESC LIMIT 10;

-- 35. Nombre mesures par jour (7 derniers jours)
SELECT date(datetime) AS jour, COUNT(*) 
FROM mesure 
WHERE datetime > NOW() - interval '7 days'
GROUP BY jour ORDER BY jour;

-- 36. Conteneurs >90% remplis (avec HAVING)
SELECT c.id_conteneur, AVG(m.valeur) AS taux
FROM mesure m
JOIN capteur cap ON m.id_capteur = cap.id_capteur
JOIN conteneur c ON cap.id_conteneur = c.id_conteneur
WHERE m.datetime > NOW() - interval '1 day'
GROUP BY c.id_conteneur
HAVING AVG(m.valeur) > 90;

-- 37. Utilisateurs avec le plus de signalements
SELECT u.id_user, u.nom, COUNT(s.id_signalement) AS nb
FROM "user" u
LEFT JOIN signalement s ON u.id_user = s.id_user
GROUP BY u.id_user, u.nom
ORDER BY nb DESC LIMIT 10;

-- 38. Progression moyenne par défi (CTE)
WITH prog AS (
    SELECT id_defi, AVG(progression) AS avg_prog
    FROM participation_defi
    GROUP BY id_defi
)
SELECT d.titre, COALESCE(prog.avg_prog, 0)
FROM defi d
LEFT JOIN prog ON d.id_defi = prog.id_defi;

-- 39. Nombre tournées par véhicule
SELECT v.matricule, COUNT(t.id_tournee) AS nb_tournees
FROM vehicule v
LEFT JOIN tournee t ON v.matricule = t.matricule
GROUP BY v.matricule;

-- 40. Sous-requête : Users ayant complété un défi
SELECT * FROM "user" u
WHERE EXISTS (
    SELECT 1 FROM participation_defi p
    WHERE p.id_user = u.id_user AND p.progression = 100
);