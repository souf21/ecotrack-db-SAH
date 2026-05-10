SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict hza7LCV9Ckpn7EGHRdiZ8lp19oqoa2zIpJeJkwzcrWZAB74qFlPFYhAmfI0ZhmN

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: badge; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."badge" ("id_badge", "nom", "description", "icon_url", "niveau", "created_at") VALUES
	('b0000001-0000-0000-0000-000000000001', 'Premier Pas', 'Premier signalement soumis', NULL, 1, '2026-05-09 11:00:22.731124+00'),
	('b0000001-0000-0000-0000-000000000002', 'Eco-Actif', '5 signalements soumis', NULL, 2, '2026-05-09 11:00:22.731124+00'),
	('b0000001-0000-0000-0000-000000000003', 'Eco-Heros', '20 signalements soumis', NULL, 3, '2026-05-09 11:00:22.731124+00');


--
-- Data for Name: type_dechets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."type_dechets" ("id_type_dechets", "libelle", "couleur", "created_at", "updated_at") VALUES
	('cccccccc-0000-0000-0000-000000000001', 'Plastique', '#FFEB3B', '2026-05-08 22:43:34.502863+00', '2026-05-08 22:43:34.502863+00'),
	('cccccccc-0000-0000-0000-000000000002', 'Verre', '#4CAF50', '2026-05-08 22:43:34.502863+00', '2026-05-08 22:43:34.502863+00'),
	('cccccccc-0000-0000-0000-000000000003', 'Papier/Carton', '#2196F3', '2026-05-08 22:43:34.502863+00', '2026-05-08 22:43:34.502863+00'),
	('cccccccc-0000-0000-0000-000000000004', 'Ordures Menageres', '#9E9E9E', '2026-05-08 22:43:34.502863+00', '2026-05-08 22:43:34.502863+00');


--
-- Data for Name: zone; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."zone" ("id_zone", "nom_zone", "code_postal", "description", "created_at", "updated_at") VALUES
	('bbbbbbbb-0000-0000-0000-000000000001', 'Paris Centre', '75001', NULL, '2026-05-08 22:43:34.502863+00', '2026-05-08 22:43:34.502863+00'),
	('bbbbbbbb-0000-0000-0000-000000000002', 'Paris Nord', '75018', NULL, '2026-05-08 22:43:34.502863+00', '2026-05-08 22:43:34.502863+00'),
	('bbbbbbbb-0000-0000-0000-000000000003', 'Paris Est', '75011', NULL, '2026-05-08 22:43:34.502863+00', '2026-05-08 22:43:34.502863+00');


--
-- Data for Name: conteneur; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."conteneur" ("id_conteneur", "reference", "adresse", "etat", "latitude", "longitude", "capacite_totale", "date_installation", "id_zone", "id_type_dechets", "created_at", "updated_at", "metadata") VALUES
	('dddddddd-0000-0000-0000-000000000001', 'BIN-001', '1 rue de Rivoli, Paris', 'actif', 48.856600, 2.352200, 500, NULL, 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', '2026-05-09 09:19:19.833717+00', '2026-05-09 09:19:19.833717+00', NULL),
	('dddddddd-0000-0000-0000-000000000002', 'BIN-002', '5 place du Tertre, Paris', 'actif', 48.886700, 2.340800, 300, NULL, 'bbbbbbbb-0000-0000-0000-000000000002', 'cccccccc-0000-0000-0000-000000000002', '2026-05-09 09:19:19.833717+00', '2026-05-09 09:19:19.833717+00', NULL),
	('dddddddd-0000-0000-0000-000000000003', 'BIN-003', '12 rue de la Bastille, Paris', 'actif', 48.853300, 2.369800, 750, NULL, 'bbbbbbbb-0000-0000-0000-000000000003', 'cccccccc-0000-0000-0000-000000000003', '2026-05-09 09:19:19.833717+00', '2026-05-10 14:19:40.230948+00', NULL),
	('75f5e791-1d36-461c-ae23-ca28534d5cbc', 'BIN-004', '12 Rue de Turenne, Paris', 'actif', 48.857900, 2.363400, 500, NULL, 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000003', '2026-05-10 13:00:59.04663+00', '2026-05-10 14:20:51.950875+00', NULL),
	('7de85053-407c-48b8-93ab-92665457c193', 'BIN-005', '45 Boulevard Saint-Germain, 75005 Paris', 'actif', 48.851600, 2.346000, 750, NULL, 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', '2026-05-10 13:25:55.646482+00', '2026-05-10 14:21:37.318629+00', NULL);


--
-- Data for Name: capteur; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."capteur" ("id_capteur", "reference", "type", "date_installation", "statut", "id_conteneur", "created_at", "updated_at") VALUES
	('ffffffff-0000-0000-0000-000000000001', 'CAP-BIN001-REMPL', 'remplissage', '2026-01-01', 'actif', 'dddddddd-0000-0000-0000-000000000001', '2026-05-09 09:56:51.83478+00', '2026-05-09 09:56:51.83478+00'),
	('ffffffff-0000-0000-0000-000000000002', 'CAP-BIN002-REMPL', 'remplissage', '2026-01-01', 'actif', 'dddddddd-0000-0000-0000-000000000002', '2026-05-09 09:56:51.83478+00', '2026-05-09 09:56:51.83478+00'),
	('ffffffff-0000-0000-0000-000000000003', 'CAP-BIN003-REMPL', 'remplissage', '2026-01-01', 'actif', 'dddddddd-0000-0000-0000-000000000003', '2026-05-09 09:56:51.83478+00', '2026-05-09 09:56:51.83478+00'),
	('ba74282a-ae6c-4623-bc11-9225da94a449', 'CAP-BIN-004-REMPL', 'remplissage', '2026-05-10', 'actif', '75f5e791-1d36-461c-ae23-ca28534d5cbc', '2026-05-10 13:08:24.963414+00', '2026-05-10 13:08:24.963414+00'),
	('82fbb92a-0b55-4a7c-b4be-e860c489bfd2', 'CAP-BIN-005-REMPL', 'remplissage', '2026-05-10', 'actif', '7de85053-407c-48b8-93ab-92665457c193', '2026-05-10 13:25:55.646482+00', '2026-05-10 13:25:55.646482+00');


--
-- Data for Name: defi; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."defi" ("id_defi", "titre", "description", "statut", "points_recompense", "date_debut", "date_fin", "created_at", "updated_at") VALUES
	('d0000001-0000-0000-0000-000000000001', 'Mois du Recyclage', 'Signalez 5 debordements de conteneurs ce mois-ci et gagnez des points bonus !', 'actif', 50, '2026-05-01', '2026-05-31', '2026-05-09 11:00:22.731124+00', '2026-05-09 11:00:22.731124+00');


--
-- Data for Name: type_tournee; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."type_tournee" ("id_type_tournee", "libelle", "created_at") VALUES
	('eeeeeeee-0000-0000-0000-000000000001', 'Collecte reguliere', '2026-05-09 08:57:10.488043+00'),
	('eeeeeeee-0000-0000-0000-000000000002', 'Collecte urgente', '2026-05-09 08:57:10.488043+00'),
	('eeeeeeee-0000-0000-0000-000000000003', 'Gros dechets', '2026-05-09 08:57:10.488043+00'),
	('eeeeeeee-0000-0000-0000-000000000004', 'Verre et recyclables', '2026-05-09 08:57:10.488043+00');


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user" ("id_user", "nom", "prenom", "email", "adresse", "date_inscription", "point_total", "avatar_url", "telephone", "created_at", "updated_at") VALUES
	('a76037c9-18e8-4bf6-8572-56339666f279', 'gestionnaire', 'souf', 'gestionnaire@ecotrack.fr', NULL, '2026-05-08', 0, NULL, NULL, '2026-05-08 10:32:37.40041+00', '2026-05-08 10:34:55.904498+00'),
	('c8b7c3d7-e13f-46fe-8f39-98e17779b1ad', 'Agent', 'Fin', 'agent1@ecotrack.fr', NULL, '2026-05-09', 0, NULL, NULL, '2026-05-09 12:36:40.255059+00', '2026-05-09 12:36:40.255059+00'),
	('cc6f42e2-6315-400f-a589-22f78c68a709', 'Agent', 'Brad', 'agent2@ecotrack.fr ', NULL, '2026-05-10', 0, NULL, NULL, '2026-05-10 12:31:12.175147+00', '2026-05-10 12:31:12.175147+00'),
	('97369761-a99c-495f-a687-57616b7e319c', 'Agent', 'Reece', 'agent@ecotrack.fr', NULL, '2026-05-10', 0, NULL, NULL, '2026-05-10 12:41:51.829093+00', '2026-05-10 12:41:51.829093+00'),
	('b3594c18-fde8-489a-bbc4-281f2ad4441e', 'SOUFIANE', 'Citoyen', 'citoyen1@ecotrack.fr', NULL, '2026-05-08', 30, NULL, '0664647459', '2026-05-08 09:43:29.573572+00', '2026-05-10 12:48:15.552747+00'),
	('65f05256-b0e4-4f86-bb0d-65e6f390cc4e', 'Citoyen', 'Ali', 'citoyen@ecotrack.fr', NULL, '2026-05-10', 0, NULL, NULL, '2026-05-10 14:53:47.778719+00', '2026-05-10 14:53:47.778719+00');


--
-- Data for Name: vehicule; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."vehicule" ("matricule", "marque", "modele", "type_vehicule", "capacite", "created_at", "id_agent") VALUES
	('VH-75-001', 'Renault', 'Master', 'Camion benne', 8000, '2026-05-09 08:57:10.488043+00', 'c8b7c3d7-e13f-46fe-8f39-98e17779b1ad'),
	('VH-75-002', 'Iveco', 'Daily', 'Camion benne', 5000, '2026-05-09 08:57:10.488043+00', 'cc6f42e2-6315-400f-a589-22f78c68a709'),
	('VH-75-003', 'Mercedes', 'Sprinter', 'Vehicule leger', 2000, '2026-05-09 08:57:10.488043+00', '97369761-a99c-495f-a687-57616b7e319c');


--
-- Data for Name: tournee; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tournee" ("id_tournee", "date", "heure_debut", "heure_fin", "statut", "id_type_tournee", "matricule", "created_at", "updated_at") VALUES
	('2334c1ed-b825-47df-b238-42c76f5e4cd6', '2026-05-10', NULL, NULL, 'terminée', 'eeeeeeee-0000-0000-0000-000000000003', 'VH-75-001', '2026-05-10 13:07:15.717457+00', '2026-05-10 13:07:19.959391+00'),
	('e5d1be1c-1e4e-436b-bb05-4fafe64ff293', '2026-05-10', NULL, NULL, 'terminée', 'eeeeeeee-0000-0000-0000-000000000002', 'VH-75-001', '2026-05-10 13:50:00.726304+00', '2026-05-10 13:50:02.565545+00'),
	('d0e71e7f-6aa4-4318-aadb-825c976f6dc1', '2026-05-10', NULL, NULL, 'terminée', 'eeeeeeee-0000-0000-0000-000000000002', 'VH-75-003', '2026-05-10 14:06:32.889364+00', '2026-05-10 14:15:58.582647+00'),
	('a99b3965-d125-47e6-b757-f887158f465a', '2026-05-10', NULL, NULL, 'terminée', 'eeeeeeee-0000-0000-0000-000000000003', 'VH-75-002', '2026-05-10 14:25:56.436647+00', '2026-05-10 14:25:59.890188+00');


--
-- Data for Name: etape_tournee; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."etape_tournee" ("id_tournee", "id_conteneur", "ordre", "heure_prevue") VALUES
	('2334c1ed-b825-47df-b238-42c76f5e4cd6', 'dddddddd-0000-0000-0000-000000000002', 1, NULL),
	('2334c1ed-b825-47df-b238-42c76f5e4cd6', 'dddddddd-0000-0000-0000-000000000003', 2, NULL),
	('e5d1be1c-1e4e-436b-bb05-4fafe64ff293', 'dddddddd-0000-0000-0000-000000000001', 1, NULL),
	('e5d1be1c-1e4e-436b-bb05-4fafe64ff293', 'dddddddd-0000-0000-0000-000000000002', 2, NULL),
	('e5d1be1c-1e4e-436b-bb05-4fafe64ff293', 'dddddddd-0000-0000-0000-000000000003', 3, NULL),
	('d0e71e7f-6aa4-4318-aadb-825c976f6dc1', 'dddddddd-0000-0000-0000-000000000001', 1, NULL),
	('d0e71e7f-6aa4-4318-aadb-825c976f6dc1', 'dddddddd-0000-0000-0000-000000000002', 2, NULL),
	('d0e71e7f-6aa4-4318-aadb-825c976f6dc1', '75f5e791-1d36-461c-ae23-ca28534d5cbc', 3, NULL),
	('d0e71e7f-6aa4-4318-aadb-825c976f6dc1', 'dddddddd-0000-0000-0000-000000000003', 4, NULL),
	('d0e71e7f-6aa4-4318-aadb-825c976f6dc1', '7de85053-407c-48b8-93ab-92665457c193', 5, NULL),
	('a99b3965-d125-47e6-b757-f887158f465a', 'dddddddd-0000-0000-0000-000000000001', 1, NULL),
	('a99b3965-d125-47e6-b757-f887158f465a', 'dddddddd-0000-0000-0000-000000000002', 2, NULL),
	('a99b3965-d125-47e6-b757-f887158f465a', 'dddddddd-0000-0000-0000-000000000003', 3, NULL),
	('a99b3965-d125-47e6-b757-f887158f465a', '75f5e791-1d36-461c-ae23-ca28534d5cbc', 4, NULL),
	('a99b3965-d125-47e6-b757-f887158f465a', '7de85053-407c-48b8-93ab-92665457c193', 5, NULL);


--
-- Data for Name: mesure_2026_02; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: mesure_2026_03; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: participation_defi; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: realise; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."realise" ("id_user", "id_tournee") VALUES
	('c8b7c3d7-e13f-46fe-8f39-98e17779b1ad', '2334c1ed-b825-47df-b238-42c76f5e4cd6'),
	('c8b7c3d7-e13f-46fe-8f39-98e17779b1ad', 'e5d1be1c-1e4e-436b-bb05-4fafe64ff293'),
	('97369761-a99c-495f-a687-57616b7e319c', 'd0e71e7f-6aa4-4318-aadb-825c976f6dc1'),
	('cc6f42e2-6315-400f-a589-22f78c68a709', 'a99b3965-d125-47e6-b757-f887158f465a');


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."role" ("id_role", "nom", "description", "created_at") VALUES
	('554f53a5-6b4c-450d-9c57-88c22667a176', 'gestionnaire', NULL, '2026-05-08 09:39:17.221189+00'),
	('fff65684-8304-4d51-ab13-feb582559368', 'citoyen', NULL, '2026-05-08 09:40:05.514721+00'),
	('aaaaaaaa-0000-0000-0000-000000000002', 'agent', 'Agent de collecte', '2026-05-08 22:43:34.502863+00');


--
-- Data for Name: signalement; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."signalement" ("id_signalement", "type", "description", "statut", "photo_url", "date_signalement", "id_conteneur", "id_user", "created_at", "updated_at") VALUES
	('5f41c6c3-23d3-4464-9c93-d4d46309ca17', 'plein', 'conteneur plein', 'traité', NULL, '2026-05-09 12:13:15.71257+00', 'dddddddd-0000-0000-0000-000000000001', 'b3594c18-fde8-489a-bbc4-281f2ad4441e', '2026-05-09 12:13:15.71257+00', '2026-05-10 12:48:15.52334+00');


--
-- Data for Name: user_badge; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_badge" ("id_user", "id_badge", "date_obtention") VALUES
	('b3594c18-fde8-489a-bbc4-281f2ad4441e', 'b0000001-0000-0000-0000-000000000001', '2026-05-09');


--
-- Data for Name: user_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_role" ("id_user", "id_role", "date_attribution") VALUES
	('b3594c18-fde8-489a-bbc4-281f2ad4441e', 'fff65684-8304-4d51-ab13-feb582559368', '2026-05-08'),
	('a76037c9-18e8-4bf6-8572-56339666f279', '554f53a5-6b4c-450d-9c57-88c22667a176', NULL),
	('c8b7c3d7-e13f-46fe-8f39-98e17779b1ad', 'aaaaaaaa-0000-0000-0000-000000000002', NULL),
	('cc6f42e2-6315-400f-a589-22f78c68a709', 'aaaaaaaa-0000-0000-0000-000000000002', NULL),
	('97369761-a99c-495f-a687-57616b7e319c', 'aaaaaaaa-0000-0000-0000-000000000002', NULL),
	('65f05256-b0e4-4f86-bb0d-65e6f390cc4e', 'fff65684-8304-4d51-ab13-feb582559368', NULL);


--
-- PostgreSQL database dump complete
--

-- \unrestrict hza7LCV9Ckpn7EGHRdiZ8lp19oqoa2zIpJeJkwzcrWZAB74qFlPFYhAmfI0ZhmN

RESET ALL;
