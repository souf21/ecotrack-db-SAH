SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict YwFh2pfLK1oNRBPuT1pBXcgLCOIsloW0xkaoqZQ8BkchkpPhNEufiTaLsnRZKIq

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
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'a737f977-e336-4f32-a53c-edf66556df17', '{"action":"user_signedup","actor_id":"a88778ce-4686-44e3-9199-241f984f62a8","actor_username":"soufiane.remmal@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-05-07 17:39:38.926424+00', ''),
	('00000000-0000-0000-0000-000000000000', '2598a8a7-8736-4c04-8a91-2eb8308088d8', '{"action":"login","actor_id":"a88778ce-4686-44e3-9199-241f984f62a8","actor_username":"soufiane.remmal@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-07 17:39:38.942261+00', ''),
	('00000000-0000-0000-0000-000000000000', '0f7d3581-63c3-4fcf-b448-7ae018d4ed08', '{"action":"user_signedup","actor_id":"d55985b7-0ff4-4ba3-9ed0-1e2605df231b","actor_username":"citoyen@ecotrack.fr","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-05-07 17:41:09.229919+00', ''),
	('00000000-0000-0000-0000-000000000000', '03355b06-035f-4b75-9163-91d150d1648f', '{"action":"login","actor_id":"d55985b7-0ff4-4ba3-9ed0-1e2605df231b","actor_username":"citoyen@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-07 17:41:09.254481+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6070d14-dd83-41ab-8f92-0d67148ffa94', '{"action":"user_repeated_signup","actor_id":"d55985b7-0ff4-4ba3-9ed0-1e2605df231b","actor_username":"citoyen@ecotrack.fr","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2026-05-07 17:41:31.600785+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ca9b06f-2370-45a8-92de-a2574d789667', '{"action":"user_repeated_signup","actor_id":"d55985b7-0ff4-4ba3-9ed0-1e2605df231b","actor_username":"citoyen@ecotrack.fr","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2026-05-07 17:41:34.030982+00', ''),
	('00000000-0000-0000-0000-000000000000', '736171a2-6339-471c-8a00-d70fbb65343f', '{"action":"login","actor_id":"d55985b7-0ff4-4ba3-9ed0-1e2605df231b","actor_username":"citoyen@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-07 17:41:44.951289+00', ''),
	('00000000-0000-0000-0000-000000000000', '7172418e-e4c2-4a8c-b683-e7c3e1942a57', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"soufiane.remmal21@gmail.com","user_id":"3a1ba0bf-9de1-4ca5-a796-5cc7a0aa3fcf","user_phone":""}}', '2026-05-07 17:50:13.564727+00', ''),
	('00000000-0000-0000-0000-000000000000', '5ec45783-beb3-4179-8756-962ce2c00fc9', '{"action":"login","actor_id":"3a1ba0bf-9de1-4ca5-a796-5cc7a0aa3fcf","actor_username":"soufiane.remmal21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-07 17:52:59.720002+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd788bca1-1c4c-4634-96a3-a070e27e6b1a', '{"action":"token_refreshed","actor_id":"3a1ba0bf-9de1-4ca5-a796-5cc7a0aa3fcf","actor_username":"soufiane.remmal21@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-08 09:34:22.342381+00', ''),
	('00000000-0000-0000-0000-000000000000', '68af8f55-2d67-4dc9-a18e-fc33e90b3add', '{"action":"token_revoked","actor_id":"3a1ba0bf-9de1-4ca5-a796-5cc7a0aa3fcf","actor_username":"soufiane.remmal21@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-08 09:34:22.343412+00', ''),
	('00000000-0000-0000-0000-000000000000', '24ac26d2-6bd8-46ac-8527-203ebc90bca6', '{"action":"login","actor_id":"a88778ce-4686-44e3-9199-241f984f62a8","actor_username":"soufiane.remmal@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 09:35:41.752264+00', ''),
	('00000000-0000-0000-0000-000000000000', 'adbd8707-9351-412c-ad00-0cd12f77d28a', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"gestionnaire@ecotrack.fr","user_id":"a76037c9-18e8-4bf6-8572-56339666f279","user_phone":""}}', '2026-05-08 09:36:55.206317+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e4145083-f05f-40a0-a066-49ff2128874c', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 09:37:04.410249+00', ''),
	('00000000-0000-0000-0000-000000000000', '091c8a8c-a357-4ab2-8652-9e54ead86b5b', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 09:37:14.74096+00', ''),
	('00000000-0000-0000-0000-000000000000', '0202f961-157b-426c-9426-230c18a46d99', '{"action":"user_repeated_signup","actor_id":"d55985b7-0ff4-4ba3-9ed0-1e2605df231b","actor_username":"citoyen@ecotrack.fr","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2026-05-08 09:43:21.111728+00', ''),
	('00000000-0000-0000-0000-000000000000', '4847b19b-9fd6-4073-b3c1-2cdd43745db6', '{"action":"user_signedup","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-05-08 09:43:29.500841+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c1eafa56-2519-4205-be82-de8a7dcb4a8f', '{"action":"login","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 09:43:29.521898+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bcf73677-aedb-44d6-aa47-df0dc2e71071', '{"action":"login","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 09:43:37.243956+00', ''),
	('00000000-0000-0000-0000-000000000000', '070e6981-1d14-4e4a-bef9-fa8039f9c03e', '{"action":"logout","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-08 10:28:55.974917+00', ''),
	('00000000-0000-0000-0000-000000000000', '235ae35b-dba5-4630-b992-319afa56bff4', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 10:34:18.689086+00', ''),
	('00000000-0000-0000-0000-000000000000', '7fcd6214-27ab-41dc-9cf8-bb8da6d9af62', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 10:35:15.283491+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd25954cc-46a7-479a-b0e9-e064d762ba6c', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-08 10:57:49.33098+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd59c0c90-6b2b-43d8-a239-b141c3fe3993', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"agent@ecotrack.fr","user_id":"bf12f073-ba1f-457e-ad7b-cb4ef894ab2a","user_phone":""}}', '2026-05-08 11:00:59.058457+00', ''),
	('00000000-0000-0000-0000-000000000000', '5acbe125-302a-4e73-9826-03194fb7a0e0', '{"action":"login","actor_id":"bf12f073-ba1f-457e-ad7b-cb4ef894ab2a","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 11:02:29.601437+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c44ce814-03ed-4e86-8136-62430516ab90', '{"action":"token_refreshed","actor_id":"bf12f073-ba1f-457e-ad7b-cb4ef894ab2a","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-08 12:32:22.313912+00', ''),
	('00000000-0000-0000-0000-000000000000', '8265c4d4-3ac5-4c0c-8814-a5efe30a5b3c', '{"action":"token_revoked","actor_id":"bf12f073-ba1f-457e-ad7b-cb4ef894ab2a","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-08 12:32:22.316114+00', ''),
	('00000000-0000-0000-0000-000000000000', '6305faa8-86dc-44ad-b7df-c61a8634ae64', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"agent@ecotrack.fr","user_id":"bf12f073-ba1f-457e-ad7b-cb4ef894ab2a","user_phone":""}}', '2026-05-08 12:35:11.51232+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f3716dc-f82b-4139-83c9-a1e3573b1001', '{"action":"login","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 12:38:34.808881+00', ''),
	('00000000-0000-0000-0000-000000000000', '0e831347-bc7e-4839-b0ce-2e9b90f7ecbb', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"agent@ecotrack.fr","user_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","user_phone":""}}', '2026-05-08 12:39:53.84914+00', ''),
	('00000000-0000-0000-0000-000000000000', '8e187210-3d63-44b5-9d9d-34844914f98a', '{"action":"logout","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-08 12:46:27.20824+00', ''),
	('00000000-0000-0000-0000-000000000000', '080ba4fc-7289-4552-b6db-03e641d7d56b', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 12:46:39.402519+00', ''),
	('00000000-0000-0000-0000-000000000000', '3489be3b-6ac8-46f5-9485-cb3529ba3ada', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 12:46:42.388588+00', ''),
	('00000000-0000-0000-0000-000000000000', '4c75286f-e9a3-46ec-a2bd-271f3dfde509', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 12:46:43.368807+00', ''),
	('00000000-0000-0000-0000-000000000000', '6c7785eb-6d3b-4630-8431-9469c7dedec7', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 12:46:44.178604+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ecb07fc7-0ff9-47df-b556-bd12a1ae23d2', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 12:46:44.875256+00', ''),
	('00000000-0000-0000-0000-000000000000', '3d33f091-ce15-4458-aa1a-d0f7b901f097', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 12:47:04.651663+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f2ae3529-aaa7-4e7b-a4b4-b564aa73313b', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-08 12:47:07.337199+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b370e10e-09ea-4407-b3e9-c9e5bbb265ec', '{"action":"user_signedup","actor_id":"bec7ac85-6e76-4f6b-a7c4-c927c5de2289","actor_username":"qorchifadwa@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-05-08 19:31:16.301361+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d0d2006-7020-4ae5-8fac-fa9048b828c2', '{"action":"login","actor_id":"bec7ac85-6e76-4f6b-a7c4-c927c5de2289","actor_username":"qorchifadwa@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 19:31:16.328248+00', ''),
	('00000000-0000-0000-0000-000000000000', '740415a5-1793-428e-831b-9b851ecf497a', '{"action":"login","actor_id":"bec7ac85-6e76-4f6b-a7c4-c927c5de2289","actor_username":"qorchifadwa@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 19:31:23.947038+00', ''),
	('00000000-0000-0000-0000-000000000000', '325ac374-5955-4ddd-bf6b-f604585717b1', '{"action":"user_signedup","actor_id":"4ae88cf9-42d6-43f7-ad90-7660f1775a28","actor_username":"test.citoyen@ecotrack.fr","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-05-08 21:06:16.757217+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd995cabf-f6a1-4639-b5ac-a129b6d8a743', '{"action":"login","actor_id":"4ae88cf9-42d6-43f7-ad90-7660f1775a28","actor_username":"test.citoyen@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 21:06:16.767578+00', ''),
	('00000000-0000-0000-0000-000000000000', '724956ef-c614-49ef-949b-8454718c39b0', '{"action":"login","actor_id":"4ae88cf9-42d6-43f7-ad90-7660f1775a28","actor_username":"test.citoyen@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 21:07:17.263002+00', ''),
	('00000000-0000-0000-0000-000000000000', '55cdc2cf-7637-4cba-abc9-784559760b9f', '{"action":"login","actor_id":"4ae88cf9-42d6-43f7-ad90-7660f1775a28","actor_username":"test.citoyen@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 21:12:37.412116+00', ''),
	('00000000-0000-0000-0000-000000000000', 'be4ca45c-5671-42c6-83f1-019ca7a61d9d', '{"action":"token_refreshed","actor_id":"4ae88cf9-42d6-43f7-ad90-7660f1775a28","actor_username":"test.citoyen@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-08 21:12:54.763294+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ba77a995-0d89-4665-87ec-0132e476330b', '{"action":"token_revoked","actor_id":"4ae88cf9-42d6-43f7-ad90-7660f1775a28","actor_username":"test.citoyen@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-08 21:12:54.764082+00', ''),
	('00000000-0000-0000-0000-000000000000', '0df1cef2-f55c-439f-93fa-b0111e264eed', '{"action":"token_refreshed","actor_id":"bec7ac85-6e76-4f6b-a7c4-c927c5de2289","actor_username":"qorchifadwa@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-08 21:15:04.338072+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c601ec66-b40d-4ffa-b660-101fb1137d9b', '{"action":"token_revoked","actor_id":"bec7ac85-6e76-4f6b-a7c4-c927c5de2289","actor_username":"qorchifadwa@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-05-08 21:15:04.338715+00', ''),
	('00000000-0000-0000-0000-000000000000', '21a0376b-6caa-4ef2-93d7-2fdec8de1311', '{"action":"logout","actor_id":"bec7ac85-6e76-4f6b-a7c4-c927c5de2289","actor_username":"qorchifadwa@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-08 21:15:06.529522+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da06086f-89f1-40ea-bcab-cf99ea670bf3', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 21:15:21.086895+00', ''),
	('00000000-0000-0000-0000-000000000000', '95233080-b182-4e18-9bfd-c9bd290cce15', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 21:18:39.149771+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd4a76070-59de-4267-95ad-cef8529dab66', '{"action":"token_refreshed","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-08 22:45:24.954791+00', ''),
	('00000000-0000-0000-0000-000000000000', '120286d9-29e0-4140-aae6-c259e3751fb8', '{"action":"token_revoked","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-08 22:45:24.956635+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a155c1b2-1491-47e2-b710-a116aec4927a', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 22:46:15.345116+00', ''),
	('00000000-0000-0000-0000-000000000000', '98e383d8-5317-4dfe-b54c-ef89d9872d7f', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-08 23:06:16.59933+00', ''),
	('00000000-0000-0000-0000-000000000000', '9ea1510b-defc-4972-abb7-7128d4f5db62', '{"action":"login","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:07:10.189722+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6624e51-ca29-443a-a0af-a749bb574a6c', '{"action":"logout","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-08 23:11:00.538915+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2ec5d65-6d41-48a5-8a74-f79572dae7b7', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:11:18.110448+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f006fd1f-4318-4fe3-9cc7-0c748ceb4164', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-08 23:11:55.684801+00', ''),
	('00000000-0000-0000-0000-000000000000', '159490d3-5c3c-48ef-8f5a-05539a2fea61', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:12:14.584409+00', ''),
	('00000000-0000-0000-0000-000000000000', '216c3ffa-d384-4733-a492-549a675c621a', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:12:18.47204+00', ''),
	('00000000-0000-0000-0000-000000000000', '38c99439-0065-4a09-b3c6-c984cdb3264b', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:12:19.273892+00', ''),
	('00000000-0000-0000-0000-000000000000', '020753c9-b27f-4021-bc66-e2bd83ad0558', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:12:19.555802+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dea841a0-452b-4c7f-bc4c-a6b1754da922', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:12:19.717702+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b99d1d84-cac7-416a-867e-e7a94eb5e5f3', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:12:19.885549+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cb9ee16f-6f42-4bd3-b48b-63f387f18b80', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:12:20.204609+00', ''),
	('00000000-0000-0000-0000-000000000000', '1411e45d-5240-4eb5-8dc0-01aaab789942', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:13:39.579037+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ab6bc0ad-bcae-4237-ae7d-e9c692edd45e', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:13:40.479474+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c51d2711-1c02-4412-a13c-312580fd1871', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:13:41.137022+00', ''),
	('00000000-0000-0000-0000-000000000000', 'deab5b10-d53f-48de-aa8f-05d968e6851f', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:13:41.719896+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c7976af-9d6d-49c2-85fa-4fb8410a7d71', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:13:42.131462+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f4bfe653-e294-4bd6-9c6e-6235a1112e3f', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:13:42.361299+00', ''),
	('00000000-0000-0000-0000-000000000000', '926c7072-4890-4441-aa6b-319b940b9bf8', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:13:42.558714+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e6f0a7f0-e3fc-43b1-b1f0-1fae1dc7b03d', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:13:42.711287+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2df2cd6-b0ff-4a88-90f3-29b27d2c820e', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:13:42.89003+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ed66afcc-8114-480a-9bf5-1b0c9c6f059b', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:13:43.074495+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b0e70f86-09d1-491c-b6ce-5fd3caffe099', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:13:43.311991+00', ''),
	('00000000-0000-0000-0000-000000000000', '8d771200-cb61-4334-ae49-960efb003050', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:13:55.698164+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ed38400a-b537-46af-90bc-d6c6854e3a53', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-08 23:13:56.759166+00', ''),
	('00000000-0000-0000-0000-000000000000', '1385b825-1358-4c29-abfa-4d6af17cd2c3', '{"action":"token_refreshed","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-09 00:59:53.291478+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6f16892-7fb5-424b-9ccc-795fd6159956', '{"action":"token_revoked","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-09 00:59:53.300277+00', ''),
	('00000000-0000-0000-0000-000000000000', '029df5c9-7843-4ec3-a82e-e7e239ad90da', '{"action":"token_refreshed","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-09 08:35:01.821265+00', ''),
	('00000000-0000-0000-0000-000000000000', '89471e39-e506-4f72-953b-25b90093ee59', '{"action":"token_revoked","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-09 08:35:01.823155+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd8a8a959-935c-4139-9ad1-50784d84fb70', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 09:13:01.412298+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c8710902-756a-42f8-bad2-b192aee07bbd', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 09:31:25.783883+00', ''),
	('00000000-0000-0000-0000-000000000000', '5e0d1916-5b96-434c-aee1-e28c1d616010', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 09:34:20.535703+00', ''),
	('00000000-0000-0000-0000-000000000000', '1284aebc-3a9b-429c-8bbe-a495130a0af1', '{"action":"token_refreshed","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-09 10:32:34.657975+00', ''),
	('00000000-0000-0000-0000-000000000000', '0319879b-62b6-4198-9d25-17c2abbd14e5', '{"action":"token_revoked","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-09 10:32:34.659586+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd3ebd4a0-4839-43ca-b35a-8e153b95a691', '{"action":"token_refreshed","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-09 11:15:58.121523+00', ''),
	('00000000-0000-0000-0000-000000000000', '6f3724fb-44d8-4d76-9f56-42929e560231', '{"action":"token_revoked","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-09 11:15:58.123795+00', ''),
	('00000000-0000-0000-0000-000000000000', '5fb68e64-2c23-45c2-8a19-f3340dd9fbf8', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-09 11:16:00.335913+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd52eb7aa-3e29-426e-a9b3-8747347ada79', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 11:16:12.200207+00', ''),
	('00000000-0000-0000-0000-000000000000', '260e625d-0628-4ae8-ae2f-6ff075e0f05c', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 11:42:22.850705+00', ''),
	('00000000-0000-0000-0000-000000000000', '74753d12-3586-4d02-b4bb-2e222302d8dc', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 11:42:23.852519+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c80f2ea1-3f24-4003-a331-9d612e85af5c', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 11:50:31.289878+00', ''),
	('00000000-0000-0000-0000-000000000000', '59be7d06-b0ec-4de7-ba0e-a17a9df8d3ef', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-09 11:52:18.157091+00', ''),
	('00000000-0000-0000-0000-000000000000', '486f8f50-a9d2-4373-a970-f062cd6a05d7', '{"action":"login","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 11:52:41.758424+00', ''),
	('00000000-0000-0000-0000-000000000000', '7605a8ac-9c69-452b-8f85-476acdbbba91', '{"action":"logout","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-09 11:58:51.606641+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ab32c89c-f69a-4709-a13e-c0c5596888ef', '{"action":"login","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 11:59:19.319253+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f97c86cd-a292-4bd7-b5b8-efe2573d1975', '{"action":"logout","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-09 11:59:44.812558+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e6466340-a53e-447d-88a5-242d278d0f27', '{"action":"login","actor_id":"bec7ac85-6e76-4f6b-a7c4-c927c5de2289","actor_username":"qorchifadwa@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 11:59:58.766146+00', ''),
	('00000000-0000-0000-0000-000000000000', '5bcfcf30-738e-42df-a8ec-2832ca7853ad', '{"action":"logout","actor_id":"bec7ac85-6e76-4f6b-a7c4-c927c5de2289","actor_username":"qorchifadwa@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-09 12:08:25.621134+00', ''),
	('00000000-0000-0000-0000-000000000000', '68abc529-db0d-4208-be75-fceb191895d4', '{"action":"login","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 12:08:54.215747+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e7851ff1-6619-452e-9a99-120ac2114d4f', '{"action":"logout","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-09 12:14:19.590753+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f9bc1309-b91a-4967-a3bf-d39fb6a424a1', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 12:14:37.599426+00', ''),
	('00000000-0000-0000-0000-000000000000', '4f6a6ab1-86d0-4567-a8cf-7b0e6a66ba37', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-09 12:17:40.553428+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d1ec685-9840-4855-93ed-43e9395ab001', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 12:18:00.248194+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e95660fb-5360-40d1-be2e-b065c7f476b0', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 12:18:01.259271+00', ''),
	('00000000-0000-0000-0000-000000000000', '5152e0da-f625-4be4-ba2e-32c102fcd31e', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 12:24:19.705636+00', ''),
	('00000000-0000-0000-0000-000000000000', '116d75fb-ba87-46af-bde2-eacbd2edc9db', '{"action":"login","actor_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 12:24:24.346173+00', ''),
	('00000000-0000-0000-0000-000000000000', '98126696-bccd-4af6-9414-42cedb1fc375', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 12:24:43.800732+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e480b26b-269c-48f3-b040-f379400a8cd7', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"agent@ecotrack.fr","user_id":"74fa1916-0b24-4f13-85bf-07729e7af4a3","user_phone":""}}', '2026-05-09 12:27:51.625946+00', ''),
	('00000000-0000-0000-0000-000000000000', '527298bb-3be9-4fdd-a8fb-b404c8f7a7cb', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"agent@ecotrack.fr","user_id":"c26e21f8-0015-4874-be0c-2de9999f7621","user_phone":""}}', '2026-05-09 12:28:13.686136+00', ''),
	('00000000-0000-0000-0000-000000000000', '1eab96b8-4653-43a1-a8a4-8a9e0a8d1b3f', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-09 12:30:09.985582+00', ''),
	('00000000-0000-0000-0000-000000000000', '0c19cb8a-bbee-4df2-8978-dbf5b1135f8d', '{"action":"login","actor_id":"c26e21f8-0015-4874-be0c-2de9999f7621","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 12:30:20.352009+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c8412c4a-6915-4432-be85-bc83b2b24028', '{"action":"login","actor_id":"c26e21f8-0015-4874-be0c-2de9999f7621","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 12:30:21.491809+00', ''),
	('00000000-0000-0000-0000-000000000000', '28ff868f-5341-407b-9766-c5bb8cafc52e', '{"action":"login","actor_id":"c26e21f8-0015-4874-be0c-2de9999f7621","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 12:30:23.076372+00', ''),
	('00000000-0000-0000-0000-000000000000', '0998a5b8-ce10-4c8a-a808-93eb88a27ce5', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"agent1@ecotrack.fr","user_id":"c8b7c3d7-e13f-46fe-8f39-98e17779b1ad","user_phone":""}}', '2026-05-09 12:35:54.531258+00', ''),
	('00000000-0000-0000-0000-000000000000', '05e2193a-d004-403e-ab3c-b9f1fb132c71', '{"action":"login","actor_id":"c8b7c3d7-e13f-46fe-8f39-98e17779b1ad","actor_username":"agent1@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 12:37:51.898892+00', ''),
	('00000000-0000-0000-0000-000000000000', '5bf02603-0853-4c42-8c0d-ff27265d8468', '{"action":"login","actor_id":"c8b7c3d7-e13f-46fe-8f39-98e17779b1ad","actor_username":"agent1@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 12:39:20.076312+00', ''),
	('00000000-0000-0000-0000-000000000000', '0a3f319b-ef70-48ec-a16c-762f3c3ee6f1', '{"action":"logout","actor_id":"c8b7c3d7-e13f-46fe-8f39-98e17779b1ad","actor_username":"agent1@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-09 12:39:58.574795+00', ''),
	('00000000-0000-0000-0000-000000000000', '5efdebb0-c0c3-4249-b1e8-714353e08934', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-09 12:40:29.045542+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a092a109-af6e-454d-b68b-4da73e0bb485', '{"action":"token_refreshed","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-10 09:52:02.999464+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fb5ba761-ee64-4b72-adbc-886a534d7264', '{"action":"token_revoked","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-10 09:52:03.001422+00', ''),
	('00000000-0000-0000-0000-000000000000', '632df30f-2382-42b7-8651-05dc69b83d0b', '{"action":"token_refreshed","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-10 11:26:07.679152+00', ''),
	('00000000-0000-0000-0000-000000000000', '03afc4c8-7e2d-4b6b-9262-5645c338b5c2', '{"action":"token_revoked","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"token"}', '2026-05-10 11:26:07.681669+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd8434bb3-af2d-45bf-9a7a-0ef6638a85f6', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 11:47:41.506576+00', ''),
	('00000000-0000-0000-0000-000000000000', '735a0c63-385b-49ee-b439-85dd64ad7b3b', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 11:47:55.065719+00', ''),
	('00000000-0000-0000-0000-000000000000', '79f7b401-b8b4-4412-a977-1122800ff155', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"agent@ecotrack.fr","user_id":"c26e21f8-0015-4874-be0c-2de9999f7621","user_phone":""}}', '2026-05-10 12:30:17.130053+00', ''),
	('00000000-0000-0000-0000-000000000000', '04f799fb-5297-4044-9fb9-ebbd431833c5', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"agent2@ecotrack.fr","user_id":"cc6f42e2-6315-400f-a589-22f78c68a709","user_phone":""}}', '2026-05-10 12:30:36.975769+00', ''),
	('00000000-0000-0000-0000-000000000000', '868e3fed-4541-44af-908b-5373e4c81ba2', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 12:33:33.833572+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ffaedad3-ac81-4646-b49f-de6922071928', '{"action":"login","actor_id":"c8b7c3d7-e13f-46fe-8f39-98e17779b1ad","actor_username":"agent1@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 12:33:49.694293+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd22bd217-8b12-4382-9c13-a980082e08e9', '{"action":"logout","actor_id":"c8b7c3d7-e13f-46fe-8f39-98e17779b1ad","actor_username":"agent1@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 12:34:18.596873+00', ''),
	('00000000-0000-0000-0000-000000000000', '9f68dc79-1b43-4e65-9e20-ee54071654c7', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 12:34:34.118673+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd7f32b4a-2bf0-4e56-87f0-5eac45f88ca9', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 12:34:41.796756+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd11874ff-2358-41dc-bd20-0f97d494139d', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 12:34:50.031209+00', ''),
	('00000000-0000-0000-0000-000000000000', '725533a1-38c0-45f7-8726-532236f152b8', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"agent@ecotrack.fr","user_id":"97369761-a99c-495f-a687-57616b7e319c","user_phone":""}}', '2026-05-10 12:41:03.594598+00', ''),
	('00000000-0000-0000-0000-000000000000', '77f8eeef-0f5f-4fc1-805a-37ca7de60307', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 12:46:01.60259+00', ''),
	('00000000-0000-0000-0000-000000000000', '9595589e-bfcd-4937-ac59-a0fe43cbb0ac', '{"action":"login","actor_id":"97369761-a99c-495f-a687-57616b7e319c","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 12:46:17.349643+00', ''),
	('00000000-0000-0000-0000-000000000000', '20eeba3f-2af5-4ec4-9a7e-f772f534066c', '{"action":"logout","actor_id":"97369761-a99c-495f-a687-57616b7e319c","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 12:46:30.178554+00', ''),
	('00000000-0000-0000-0000-000000000000', '45494cf3-f72f-417c-a5ed-34b9e125eaad', '{"action":"login","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 12:46:45.67072+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d7a68d8-8175-4dfe-8e8f-4abc1186e00a', '{"action":"logout","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 12:47:43.749132+00', ''),
	('00000000-0000-0000-0000-000000000000', '2fe74b5e-60c3-407f-8701-f5c92480cd3c', '{"action":"login","actor_id":"97369761-a99c-495f-a687-57616b7e319c","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 12:48:06.561728+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c86c6231-8e13-4953-88fc-47ef01b3e525', '{"action":"logout","actor_id":"97369761-a99c-495f-a687-57616b7e319c","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 12:48:29.025065+00', ''),
	('00000000-0000-0000-0000-000000000000', '908c7a2d-665c-4688-a46e-cdfaaa75fee2', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 12:48:43.409516+00', ''),
	('00000000-0000-0000-0000-000000000000', '878f1e6c-7fd9-4cb5-a5d4-2067d7f00fd4', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 12:50:03.049045+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ae16f055-1fc7-4199-9dc6-cd6e015b806e', '{"action":"login","actor_id":"97369761-a99c-495f-a687-57616b7e319c","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 12:50:16.73614+00', ''),
	('00000000-0000-0000-0000-000000000000', '3ed3a788-3b09-4fae-a15b-ab3f548e143a', '{"action":"logout","actor_id":"97369761-a99c-495f-a687-57616b7e319c","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 12:57:37.312737+00', ''),
	('00000000-0000-0000-0000-000000000000', '733bbe23-c09e-4c84-82a6-eff5fc224249', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 12:57:52.30971+00', ''),
	('00000000-0000-0000-0000-000000000000', '7fc36eb8-d924-4159-9221-7bc3fcf8f55c', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 12:58:30.20993+00', ''),
	('00000000-0000-0000-0000-000000000000', 'beca88d7-19aa-4292-a035-a5e111254218', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 12:58:43.48916+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c5a5f2e3-db37-4434-b1b6-23312cabc374', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 13:15:05.107505+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a401c682-d862-4d62-9c9c-17e2c20de5ce', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 13:15:16.772145+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c77ce647-9ad0-452c-9553-8d7a02c9ebd7', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 13:15:48.11945+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ed1617ea-3a8e-4692-a44f-1b2e98c8813e', '{"action":"login","actor_id":"cc6f42e2-6315-400f-a589-22f78c68a709","actor_username":"agent2@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 13:16:24.243448+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f63c0e70-dceb-49d3-a4ea-40c4634bdb0b', '{"action":"logout","actor_id":"cc6f42e2-6315-400f-a589-22f78c68a709","actor_username":"agent2@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 13:19:30.517931+00', ''),
	('00000000-0000-0000-0000-000000000000', '5304b6c4-ff75-4b85-b683-138cb8eed1c9', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 13:19:42.990909+00', ''),
	('00000000-0000-0000-0000-000000000000', '40c0cb41-48e4-4239-8298-f1007cbf2418', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 13:54:42.871157+00', ''),
	('00000000-0000-0000-0000-000000000000', '7bb12273-4bd1-4c57-b51d-3aa5ac623d62', '{"action":"login","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 13:54:59.273114+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a4220ede-7dbe-40e9-b396-1a176192fb48', '{"action":"logout","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 13:56:48.701928+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fdcfd518-1970-4493-824c-f99e164a0983', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 13:57:04.399359+00', ''),
	('00000000-0000-0000-0000-000000000000', '9a9129c5-dc76-47bd-83af-26b7f6d9a737', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 14:06:35.770545+00', ''),
	('00000000-0000-0000-0000-000000000000', '19bcf9cc-06d9-43da-b45f-1e64441f9901', '{"action":"login","actor_id":"97369761-a99c-495f-a687-57616b7e319c","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 14:06:49.185498+00', ''),
	('00000000-0000-0000-0000-000000000000', '38f3d5ea-fbbd-4157-8a5f-e4617d095af5', '{"action":"logout","actor_id":"97369761-a99c-495f-a687-57616b7e319c","actor_username":"agent@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 14:16:12.232468+00', ''),
	('00000000-0000-0000-0000-000000000000', '5f9d7b76-1291-4f23-8d81-d5e5988d13d1', '{"action":"login","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 14:16:25.967559+00', ''),
	('00000000-0000-0000-0000-000000000000', '0d7f817e-c355-4954-894d-8324087a111a', '{"action":"logout","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 14:17:59.784919+00', ''),
	('00000000-0000-0000-0000-000000000000', '2c674074-e36a-41e1-8069-91403c4fbd19', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 14:18:57.248838+00', ''),
	('00000000-0000-0000-0000-000000000000', '55456a4b-f516-4f78-bc94-1ab9d07e9fb9', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 14:21:39.356235+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b4adeba3-391a-4e8a-8ec3-b3ea85e1b1d1', '{"action":"login","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 14:21:56.534856+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd751c4d2-d76f-4c98-a11f-84bacc413eec', '{"action":"logout","actor_id":"b3594c18-fde8-489a-bbc4-281f2ad4441e","actor_username":"citoyen1@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 14:25:12.170272+00', ''),
	('00000000-0000-0000-0000-000000000000', '6cc8be98-44d0-4468-bb15-d8f340ada19c', '{"action":"login","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 14:25:32.411213+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c184a62f-5f5c-4855-8148-a69a41afd2bb', '{"action":"logout","actor_id":"a76037c9-18e8-4bf6-8572-56339666f279","actor_username":"gestionnaire@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 14:46:25.997255+00', ''),
	('00000000-0000-0000-0000-000000000000', '2975039a-605d-417c-ae2b-9f1bdc12f6d2', '{"action":"login","actor_id":"bec7ac85-6e76-4f6b-a7c4-c927c5de2289","actor_username":"qorchifadwa@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 14:46:48.142172+00', ''),
	('00000000-0000-0000-0000-000000000000', '0bc4bd5b-497e-4c57-a370-ced8b63cc4d3', '{"action":"logout","actor_id":"bec7ac85-6e76-4f6b-a7c4-c927c5de2289","actor_username":"qorchifadwa@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-05-10 14:47:01.005494+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b4dec7a7-0dae-4bf2-abd1-38b8ba435a54', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"test.citoyen@ecotrack.fr","user_id":"4ae88cf9-42d6-43f7-ad90-7660f1775a28","user_phone":""}}', '2026-05-10 14:51:50.073554+00', ''),
	('00000000-0000-0000-0000-000000000000', '517df494-75a4-4786-82d8-73e57e15993c', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"soufiane.remmal@gmail.com","user_id":"a88778ce-4686-44e3-9199-241f984f62a8","user_phone":""}}', '2026-05-10 14:51:50.073672+00', ''),
	('00000000-0000-0000-0000-000000000000', 'db827614-b6f2-400f-96fa-f43ac98b312c', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"qorchifadwa@gmail.com","user_id":"bec7ac85-6e76-4f6b-a7c4-c927c5de2289","user_phone":""}}', '2026-05-10 14:51:50.077688+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f1b82dc1-0b0a-4f4f-9040-b08b2cce3d02', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"soufiane.remmal21@gmail.com","user_id":"3a1ba0bf-9de1-4ca5-a796-5cc7a0aa3fcf","user_phone":""}}', '2026-05-10 14:51:50.080798+00', ''),
	('00000000-0000-0000-0000-000000000000', '3926e36f-fd15-4734-8cdf-6b89613d369f', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"citoyen@ecotrack.fr","user_id":"d55985b7-0ff4-4ba3-9ed0-1e2605df231b","user_phone":""}}', '2026-05-10 14:52:00.91606+00', ''),
	('00000000-0000-0000-0000-000000000000', '83ce65cf-8650-4eb5-83a9-a4dffea5836f', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"citoyen@ecotrack.fr","user_id":"65f05256-b0e4-4f86-bb0d-65e6f390cc4e","user_phone":""}}', '2026-05-10 14:52:27.479027+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd798f9d2-6c44-454b-915b-fb1bf9ab1999', '{"action":"login","actor_id":"65f05256-b0e4-4f86-bb0d-65e6f390cc4e","actor_username":"citoyen@ecotrack.fr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-05-10 14:54:20.048418+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b8f83d0b-b1c0-4b07-8faa-8aa73bb27966', '{"action":"logout","actor_id":"65f05256-b0e4-4f86-bb0d-65e6f390cc4e","actor_username":"citoyen@ecotrack.fr","actor_via_sso":false,"log_type":"account"}', '2026-05-10 14:54:29.181345+00', '');


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '65f05256-b0e4-4f86-bb0d-65e6f390cc4e', 'authenticated', 'authenticated', 'citoyen@ecotrack.fr', '$2a$10$OFSwuMaLhUtRQUDw63jqueO8wyZuXhUX709YmMHt4EODxG.iLaDje', '2026-05-10 14:52:27.48311+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-10 14:54:20.050411+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-10 14:52:27.467068+00', '2026-05-10 14:54:20.056128+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '97369761-a99c-495f-a687-57616b7e319c', 'authenticated', 'authenticated', 'agent@ecotrack.fr', '$2a$10$KiVOm1avm9etCmpvV.yE9.J7zLr/UKPVz7iHXsENVWLIqgYPTp/fq', '2026-05-10 12:41:03.596206+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-10 14:06:49.186476+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-10 12:41:03.591931+00', '2026-05-10 14:06:49.188974+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'c8b7c3d7-e13f-46fe-8f39-98e17779b1ad', 'authenticated', 'authenticated', 'agent1@ecotrack.fr', '$2a$10$vOavWE6vokYb9Jvtp8Z/uuyLuAqY2X3Upq6gAmKUxG9Zl8Scy7np2', '2026-05-09 12:35:54.533681+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-10 12:33:49.695359+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-09 12:35:54.525378+00', '2026-05-10 12:33:49.698444+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b3594c18-fde8-489a-bbc4-281f2ad4441e', 'authenticated', 'authenticated', 'citoyen1@ecotrack.fr', '$2a$10$ZLMU2ChKXmAp9bOpdvyf8.9wRIXYE4GlQDLfhrXhDhRQm42/YcBxW', '2026-05-08 09:43:29.501471+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-10 14:21:56.535952+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "b3594c18-fde8-489a-bbc4-281f2ad4441e", "email": "citoyen1@ecotrack.fr", "email_verified": true, "phone_verified": false}', NULL, '2026-05-08 09:43:29.494633+00', '2026-05-10 14:21:56.538741+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a76037c9-18e8-4bf6-8572-56339666f279', 'authenticated', 'authenticated', 'gestionnaire@ecotrack.fr', '$2a$10$t3pqM8Src48HyVoPyv3pE.RGel7I/OIPDqKRmsibLr1JWtegTLILa', '2026-05-08 09:36:55.20773+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-10 14:25:32.412116+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-08 09:36:55.202684+00', '2026-05-10 14:25:32.414785+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'cc6f42e2-6315-400f-a589-22f78c68a709', 'authenticated', 'authenticated', 'agent2@ecotrack.fr', '$2a$10$yP12nXiwHm7PB4mO0r4ApOHRUEG6xoqOww2KNNpMRPbuyvusjpNJO', '2026-05-10 12:30:36.977223+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-05-10 13:16:24.244435+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-10 12:30:36.971951+00', '2026-05-10 13:16:24.247005+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('a76037c9-18e8-4bf6-8572-56339666f279', 'a76037c9-18e8-4bf6-8572-56339666f279', '{"sub": "a76037c9-18e8-4bf6-8572-56339666f279", "email": "gestionnaire@ecotrack.fr", "email_verified": false, "phone_verified": false}', 'email', '2026-05-08 09:36:55.205155+00', '2026-05-08 09:36:55.205183+00', '2026-05-08 09:36:55.205183+00', 'f4231644-aedc-4362-aaaa-0a750fcefe7a'),
	('b3594c18-fde8-489a-bbc4-281f2ad4441e', 'b3594c18-fde8-489a-bbc4-281f2ad4441e', '{"sub": "b3594c18-fde8-489a-bbc4-281f2ad4441e", "email": "citoyen1@ecotrack.fr", "email_verified": false, "phone_verified": false}', 'email', '2026-05-08 09:43:29.498879+00', '2026-05-08 09:43:29.498903+00', '2026-05-08 09:43:29.498903+00', '2dd8715d-9c38-4270-a8c5-78ee11b3b4e3'),
	('c8b7c3d7-e13f-46fe-8f39-98e17779b1ad', 'c8b7c3d7-e13f-46fe-8f39-98e17779b1ad', '{"sub": "c8b7c3d7-e13f-46fe-8f39-98e17779b1ad", "email": "agent1@ecotrack.fr", "email_verified": false, "phone_verified": false}', 'email', '2026-05-09 12:35:54.529116+00', '2026-05-09 12:35:54.529163+00', '2026-05-09 12:35:54.529163+00', '5305a900-a67b-4dce-824c-d598f7582912'),
	('cc6f42e2-6315-400f-a589-22f78c68a709', 'cc6f42e2-6315-400f-a589-22f78c68a709', '{"sub": "cc6f42e2-6315-400f-a589-22f78c68a709", "email": "agent2@ecotrack.fr", "email_verified": false, "phone_verified": false}', 'email', '2026-05-10 12:30:36.974368+00', '2026-05-10 12:30:36.974403+00', '2026-05-10 12:30:36.974403+00', 'e3d19fe9-1f26-4c8e-8b5f-a77628b0231a'),
	('97369761-a99c-495f-a687-57616b7e319c', '97369761-a99c-495f-a687-57616b7e319c', '{"sub": "97369761-a99c-495f-a687-57616b7e319c", "email": "agent@ecotrack.fr", "email_verified": false, "phone_verified": false}', 'email', '2026-05-10 12:41:03.593545+00', '2026-05-10 12:41:03.593569+00', '2026-05-10 12:41:03.593569+00', '4b144a56-79b8-4a4b-a40b-5891da258b1f'),
	('65f05256-b0e4-4f86-bb0d-65e6f390cc4e', '65f05256-b0e4-4f86-bb0d-65e6f390cc4e', '{"sub": "65f05256-b0e4-4f86-bb0d-65e6f390cc4e", "email": "citoyen@ecotrack.fr", "email_verified": false, "phone_verified": false}', 'email', '2026-05-10 14:52:27.4745+00', '2026-05-10 14:52:27.474647+00', '2026-05-10 14:52:27.474647+00', 'f25be5c0-3da2-4385-8cfd-2a57c4b4a3a0');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 106, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict YwFh2pfLK1oNRBPuT1pBXcgLCOIsloW0xkaoqZQ8BkchkpPhNEufiTaLsnRZKIq

RESET ALL;
