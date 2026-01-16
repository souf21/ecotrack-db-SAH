-- ================================
-- data.sql - Jeu de données ECOTRACK
-- ================================

-- 1. Types Déchets
INSERT INTO type_dechets (libelle, couleur) VALUES
('Verre', 'vert'),
('Papier/Carton', 'bleu'),
('Plastique/Métal', 'jaune'),
('Ordures ménagères', 'gris'),
('Bio-déchets', 'marron'),
('Encombrants', 'noir'),
('Textile', 'blanc');

-- 2. Zones
INSERT INTO zone (nom_zone, code_postal, description) VALUES
('Centre-Ville', '69001', 'Zone historique dense'),
('Part-Dieu', '69003', 'Quartier affaires'),
('Croix-Rousse', '69004', 'Quartier résidentiel pentes'),
('Vaise', '69009', 'Zone industrielle'),
('Confluence', '69002', 'Quartier moderne'),
('Gerland', '69007', 'Zone sportive et universitaire'),
('Monplaisir', '69008', 'Quartier familial'),
('Villeurbanne Centre', '69100', 'Ville limitrophe'),
('Bron', '69500', 'Banlieue est'),
('Lyon Ouest', '69005', 'Quartier ancien');

-- 3. Rôles
INSERT INTO role (nom, description) VALUES
('Citoyen', 'Utilisateur standard'),
('Agent de collecte', 'Conducteur et opérateur'),
('Administrateur', 'Gestion plateforme'),
('Modérateur', 'Validation signalements');

-- 4. Véhicules
INSERT INTO vehicule (matricule, marque, modele, type_vehicule, capacite) VALUES
('LY-001-AA', 'Renault', 'Master', 'Camion benne', 15000),
('LY-002-BB', 'Iveco', 'Daily', 'Camion compact', 12000),
('LY-003-CC', 'Mercedes', 'Actros', 'Gros porteur', 25000),
('LY-004-DD', 'Renault', 'Trucks', 'Benna', 18000),
('LY-005-EE', 'Man', 'TGM', 'Moyen', 16000),
('LY-006-FF', 'Volvo', 'FL', 'Compact', 11000),
('LY-007-GG', 'Scania', 'P', 'Heavy', 30000),
('LY-008-HH', 'Iveco', 'Eurocargo', 'Standard', 14000),
('LY-009-II', 'Renault', 'Premium', 'Benna', 17000),
('LY-010-JJ', 'Mercedes', 'Atego', 'Moyen', 13000);

-- 5. Type Tournées
INSERT INTO type_tournee (libelle) VALUES
('Collecte Verre'),
('Collecte Papier'),
('Collecte Plastique'),
('Collecte Ordures'),
('Collecte Bio');

-- 6. Utilisateurs (200 citoyens + 10 agents)
-- Citoyens (id 1 à 200)
INSERT INTO "user" (nom, prenom, email, adresse, telephone, date_inscription, point_total) 
SELECT 
    'Citoyen' || n,
    'Prénom' || n,
    'citoyen' || n || '@example.com',
    'Adresse ' || n || ', Lyon',
    '06000000' || lpad(n::text, 2, '0'),
    '2025-01-01'::date + (random() * 365)::int,
    (random() * 500)::int
FROM generate_series(1, 200) AS n;

-- Agents de collecte (id 201 à 210)
INSERT INTO "user" (nom, prenom, email, adresse, telephone, date_inscription, point_total) VALUES
('Dupont', 'Jean', 'agent1@ecotrack.fr', 'Base Vaise', '0700000001', '2024-01-01', 0),
('Martin', 'Paul', 'agent2@ecotrack.fr', 'Base Gerland', '0700000002', '2024-01-01', 0),
('Durand', 'Luc', 'agent3@ecotrack.fr', 'Base Vaise', '0700000003', '2024-01-01', 0),
('Leroy', 'Marc', 'agent4@ecotrack.fr', 'Base Confluence', '0700000004', '2024-01-01', 0),
('Moreau', 'Pierre', 'agent5@ecotrack.fr', 'Base Gerland', '0700000005', '2024-01-01', 0),
('Simon', 'Alain', 'agent6@ecotrack.fr', 'Base Vaise', '0700000006', '2024-01-01', 0),
('Michel', 'Philippe', 'agent7@ecotrack.fr', 'Base Part-Dieu', '0700000007', '2024-01-01', 0),
('Garcia', 'Louis', 'agent8@ecotrack.fr', 'Base Bron', '0700000008', '2024-01-01', 0),
('Roux', 'Henri', 'agent9@ecotrack.fr', 'Base Villeurbanne', '0700000009', '2024-01-01', 0),
('Blanc', 'Jacques', 'agent10@ecotrack.fr', 'Base Centre', '0700000010', '2024-01-01', 0);

-- Attribution rôles
INSERT INTO user_role (id_user, id_role, date_attribution) VALUES
-- Tous citoyens ont rôle Citoyen (1)
(SELECT id_user, 1, '2025-01-01' FROM "user" WHERE id_user <= 200),
-- Agents ont rôle Agent (2)
(201, 2, '2024-01-01'), (202, 2, '2024-01-01'), (203, 2, '2024-01-01'), (204, 2, '2024-01-01'),
(205, 2, '2024-01-01'), (206, 2, '2024-01-01'), (207, 2, '2024-01-01'), (208, 2, '2024-01-01'),
(209, 2, '2024-01-01'), (210, 2, '2024-01-01'),
-- Un admin (premier agent)
(201, 3, '2024-01-01');

-- 7. Conteneurs (120 pour dépasser 100)
INSERT INTO conteneur (reference, adresse, etat, latitude, longitude, capacite_totale, date_installation, id_zone, id_type_dechets)
SELECT 
    'CONT-' || lpad(n::text, 4, '0'),
    'Rue exemple ' || n || ', Lyon',
    CASE WHEN random() < 0.1 THEN 'Hors service' ELSE 'Opérationnel' END,
    45.75 + (random() * 0.1),
    4.83 + (random() * 0.1),
    600 + (random() * 1400)::int,
    '2023-01-01'::date + (random() * 700)::int,
    (random() * 9 + 1)::int,  -- id_zone 1-10
    (random() * 6 + 1)::int   -- id_type_dechets 1-7
FROM generate_series(1, 120) AS n;

-- 8. Capteurs (1 par conteneur)
INSERT INTO capteur (reference, type, date_installation, statut, id_conteneur)
SELECT 
    'CAPT-' || lpad(c.id_conteneur::text, 4, '0'),
    'Remplissage',
    c.date_installation + 7,
    'Actif',
    c.id_conteneur
FROM conteneur c;

-- 9. Défis
INSERT INTO defi (titre, description, statut, points_recompense, date_debut, date_fin) VALUES
('Signale 10 problèmes en 1 mois', 'Participe activement à la propreté', 'actif', 50, '2025-12-01', '2026-01-01'),
('Zéro déchet semaine', 'Réduire au maximum les ordures', 'actif', 100, '2025-12-15', NULL),
('Recyclage parfait', 'Trier tous les déchets correctement', 'terminé', 30, '2025-11-01', '2025-12-31'),
('Ramassage citoyen', 'Participer à une tournée collective', 'actif', 200, NULL, NULL),
('Eco Noël', 'Réduire les déchets pendant les fêtes', 'actif', 80, '2025-12-01', '2025-12-31');

-- 10. Badges
INSERT INTO badge (nom, description, icon_url, niveau) VALUES
('Premier signalement', 'Pour votre premier signalement', 'badge_premier.png', 1),
('Eco-citoyen bronze', '10 signalements validés', 'bronze.png', 1),
('Eco-citoyen argent', '50 signalements validés', 'argent.png', 2),
('Eco-citoyen or', '100 signalements validés', 'or.png', 3),
('Chasseur de conteneurs', 'Signaler 20 conteneurs différents', 'chasseur.png', 2),
('Défi maître', 'Compléter 5 défis', 'master.png', 3);

-- 11. Tournées (20)
INSERT INTO tournee (date, heure_debut, heure_fin, statut, id_type_tournee, matricule)
SELECT 
    '2025-12-' || lpad(d::text, 2, '0')::date,
    '06:00:00'::time + (random() * interval '2 hours'),
    NULL,
    CASE WHEN random() < 0.8 THEN 'terminée' ELSE 'planifiée' END,
    (random() * 4 + 1)::int,
    (SELECT matricule FROM vehicule ORDER BY random() LIMIT 1)
FROM generate_series(1, 20) d;

-- Assignation agents à tournées (réalise)
INSERT INTO realise (id_user, id_tournee)
SELECT 
    200 + (random() * 9 + 1)::int,  -- agents 201-210
    t.id_tournee
FROM tournee t, generate_series(1, 2)  -- 2 assignations par tournée en moyenne
ON CONFLICT DO NOTHING;

-- 12. Étapes tournées (environ 30)
INSERT INTO etape_tournee (id_tournee, id_conteneur, ordre, heure_prevue)
SELECT 
    t.id_tournee,
    c.id_conteneur,
    row_number() OVER (PARTITION BY t.id_tournee ORDER BY random()),
    '07:00:00'::time + (row_number() OVER (PARTITION BY t.id_tournee ORDER BY random()) * interval '15 minutes')
FROM tournee t
CROSS JOIN LATERAL (SELECT id_conteneur FROM conteneur ORDER BY random() LIMIT 5 + (random()*5)::int) c
LIMIT 30;

-- 13. Signalements (50)
INSERT INTO signalement (type, description, statut, photo_url, date_signalement, id_conteneur, id_user)
SELECT 
    CASE WHEN random()<0.5 THEN 'Plein' ELSE 'Dégradation' END,
    'Description signalement ' || n,
    CASE 
        WHEN random() < 0.3 THEN 'nouveau'
        WHEN random() < 0.7 THEN 'en cours'
        ELSE 'résolu'
    END,
    'https://example.com/photo' || n || '.jpg',
    timestamp '2025-11-01 00:00:00' + random() * interval '45 days',
    (SELECT id_conteneur FROM conteneur ORDER BY random() LIMIT 1),
    (random() * 199 + 1)::int  -- citoyens 1-200
FROM generate_series(1, 50) n;

-- 14. Mesures (1200+ sur 7 jours)
INSERT INTO mesure (valeur, datetime, unite, id_capteur)
SELECT 
    random() * 100,  -- 0-100%
    timestamp '2025-12-12 00:00:00' + random() * interval '7 days',
    '%',
    cap.id_capteur
FROM capteur cap, generate_series(1, 10)  -- 10 mesures par capteur sur la période
LIMIT 1200;

-- 15. Quelques participations et badges (exemples)
INSERT INTO participation_defi (id_user, id_defi, progression) VALUES
(1, 1, 70), (2, 1, 100), (3, 2, 50), (10, 3, 100), (50, 5, 80);

INSERT INTO user_badge (id_user, id_badge, date_obtention) VALUES
(1, 1, '2025-12-01'), (2, 2, '2025-12-10'), (3, 3, '2025-12-15');