# Diagramme UML — Base de données EcoTrack

> Généré depuis les migrations Supabase (`001` → `008`).  
> Rendu Mermaid : VS Code (extension Markdown Preview Mermaid), GitHub, Notion, draw.io.

---

## Modèle Conceptuel de Données (MCD) — Vue focalisée

> **[ CAPTURE D'ÉCRAN À INSÉRER ICI ]**  
> Schéma entité-association centré sur les trois tables clés du projet :
>
> | Table | Nature | Particularité |
> |---|---|---|
> | `conteneur` | Entité principale | Géolocalisée, métadonnées JSONB, liée à une zone et un type de déchet |
> | `mesure` | Hypertable IoT | Série temporelle horodatée, rattachée à un capteur → conteneur |
> | `signalement` | Entité événementielle | Créée par un utilisateur, optionnellement liée à un conteneur |
>
> **Sources pour générer cette capture :**
> - **Supabase Studio** → *Table Editor* → bouton « Schema Visualizer »
> - **pgAdmin** → clic droit sur la base → *ERD for Database*
> - **DBeaver** → *Database* → *ER Diagram*
>
> ```
> ┌──────────────────────────────────────────────────────┐
> │                                                      │
> │   [ Capture d'écran du MCD à coller ici ]            │
> │   Focus : conteneur · mesure (hypertable) ·          │
> │            signalement                               │
> │                                                      │
> └──────────────────────────────────────────────────────┘
> ```
>
> *Syntaxe pour insérer l'image une fois disponible :*  
> `![MCD EcoTrack](../assets/mcd_conteneur_mesure_signalement.png)`

---

```mermaid
erDiagram

    %% ── GÉOGRAPHIE ──────────────────────────────────────────
    zone {
        uuid    id_zone       PK
        varchar nom_zone
        varchar code_postal
        text    description
    }

    %% ── DÉCHETS & CONTENEURS ─────────────────────────────────
    type_dechets {
        uuid    id_type_dechets  PK
        varchar libelle
        varchar couleur
    }

    conteneur {
        uuid    id_conteneur      PK
        varchar reference
        text    adresse
        varchar etat
        decimal latitude
        decimal longitude
        integer capacite_totale
        date    date_installation
        jsonb   metadata
        uuid    id_zone           FK
        uuid    id_type_dechets   FK
    }

    %% ── IoT : CAPTEURS & MESURES ─────────────────────────────
    capteur {
        uuid    id_capteur        PK
        varchar reference
        varchar type
        date    date_installation
        varchar statut
        uuid    id_conteneur      FK
    }

    mesure {
        uuid        id_mesure   PK
        decimal     valeur
        timestamptz datetime
        varchar     unite
        uuid        id_capteur  FK
    }

    %% ── UTILISATEURS & RÔLES ─────────────────────────────────
    user {
        uuid    id_user         PK "→ auth.users"
        varchar nom
        varchar prenom
        varchar email
        text    adresse
        date    date_inscription
        integer point_total
        text    avatar_url
        varchar telephone
    }

    role {
        uuid    id_role     PK
        varchar nom
        text    description
    }

    user_role {
        uuid id_user    FK
        uuid id_role    FK
        date date_attribution
    }

    %% ── SIGNALEMENTS ─────────────────────────────────────────
    signalement {
        uuid        id_signalement   PK
        varchar     type
        text        description
        varchar     statut
        text        photo_url
        timestamptz date_signalement
        uuid        id_conteneur     FK
        uuid        id_user          FK
    }

    %% ── COLLECTE : TOURNÉES & VÉHICULES ──────────────────────
    type_tournee {
        uuid    id_type_tournee  PK
        varchar libelle
    }

    vehicule {
        varchar matricule      PK
        varchar marque
        varchar modele
        varchar type_vehicule
        integer capacite
        uuid    id_agent       FK "→ user"
    }

    tournee {
        uuid    id_tournee      PK
        date    date
        time    heure_debut
        time    heure_fin
        varchar statut
        uuid    id_type_tournee FK
        varchar matricule       FK
    }

    etape_tournee {
        uuid    id_tournee   FK
        uuid    id_conteneur FK
        integer ordre
        time    heure_prevue
    }

    realise {
        uuid id_user    FK
        uuid id_tournee FK
    }

    %% ── GAMIFICATION ─────────────────────────────────────────
    defi {
        uuid    id_defi           PK
        varchar titre
        text    description
        varchar statut
        integer points_recompense
        date    date_debut
        date    date_fin
    }

    badge {
        uuid    id_badge     PK
        varchar nom
        text    description
        text    icon_url
        integer niveau
    }

    participation_defi {
        uuid    id_user       FK
        uuid    id_defi       FK
        integer progression
    }

    user_badge {
        uuid id_user         FK
        uuid id_badge        FK
        date date_obtention
    }

    %% ── RELATIONS ────────────────────────────────────────────

    zone          ||--o{  conteneur          : "contient"
    type_dechets  ||--o{  conteneur          : "classifie"

    conteneur     ||--o{  capteur            : "équipé de"
    capteur       ||--o{  mesure             : "génère"

    conteneur     |o--o{  signalement        : "signalé via"
    user          ||--o{  signalement        : "crée"

    user          ||--o{  user_role          : ""
    role          ||--o{  user_role          : ""

    user          ||--o{  vehicule           : "agent responsable"

    type_tournee  ||--o{  tournee            : "catégorise"
    vehicule      |o--o{  tournee            : "effectue"

    tournee       ||--o{  etape_tournee      : ""
    conteneur     ||--o{  etape_tournee      : ""

    user          ||--o{  realise            : ""
    tournee       ||--o{  realise            : ""

    user          ||--o{  participation_defi : ""
    defi          ||--o{  participation_defi : ""

    user          ||--o{  user_badge         : ""
    badge         ||--o{  user_badge         : ""
```

---

## Légende des domaines

| Domaine | Tables |
|---|---|
| Géographie | `zone` |
| Déchets & Conteneurs | `type_dechets`, `conteneur` |
| IoT | `capteur`, `mesure` |
| Utilisateurs | `user` (→ auth.users Supabase), `role`, `user_role` |
| Signalements | `signalement` |
| Collecte | `type_tournee`, `vehicule`, `tournee`, `etape_tournee`, `realise` |
| Gamification | `defi`, `badge`, `participation_defi`, `user_badge` |

## Tables de jonction (N:M)

| Table | Entités liées | Attributs propres |
|---|---|---|
| `user_role` | user ↔ role | `date_attribution` |
| `etape_tournee` | tournee ↔ conteneur | `ordre`, `heure_prevue` |
| `realise` | user ↔ tournee | — |
| `participation_defi` | user ↔ defi | `progression` |
| `user_badge` | user ↔ badge | `date_obtention` |

## Clés étrangères notables

| Table | Colonne | Cible | ON DELETE |
|---|---|---|---|
| `conteneur` | `id_zone` | zone | RESTRICT |
| `conteneur` | `id_type_dechets` | type_dechets | RESTRICT |
| `capteur` | `id_conteneur` | conteneur | CASCADE |
| `mesure` | `id_capteur` | capteur | CASCADE |
| `signalement` | `id_conteneur` | conteneur | SET NULL |
| `signalement` | `id_user` | user | CASCADE |
| `vehicule` | `id_agent` | user | SET NULL |
| `tournee` | `matricule` | vehicule | SET NULL |
| `user` | `id_user` | auth.users | CASCADE |
