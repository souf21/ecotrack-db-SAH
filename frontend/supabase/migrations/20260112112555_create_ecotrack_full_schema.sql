-- Migration: create_ecotrack_full_schema
-- Crée toutes les tables avec UUID comme PK (recommandé Supabase)

-- Activer extensions
create extension if not exists "uuid-ossp";
create extension if not exists "moddatetime";

-- 1. ZONES & DECHETS
create table zone (
    id_zone uuid primary key default uuid_generate_v4(),
    nom_zone varchar(100) not null,
    code_postal varchar(10),
    description text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
create trigger handle_updated_at_zone before update on zone for each row execute procedure moddatetime (updated_at);

create table type_dechets (
    id_type_dechets uuid primary key default uuid_generate_v4(),
    libelle varchar(100) not null,
    couleur varchar(50),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
create trigger handle_updated_at_type_dechets before update on type_dechets for each row execute procedure moddatetime (updated_at);

create table conteneur (
    id_conteneur uuid primary key default uuid_generate_v4(),
    reference varchar(100) unique not null,
    adresse text,
    etat varchar(50),
    latitude decimal(9,6),
    longitude decimal(9,6),
    capacite_totale integer,
    date_installation date,
    id_zone uuid not null references zone(id_zone) on delete restrict,
    id_type_dechets uuid not null references type_dechets(id_type_dechets) on delete restrict,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
create trigger handle_updated_at_conteneur before update on conteneur for each row execute procedure moddatetime (updated_at);

-- 2. CAPTEURS & MESURES
create table capteur (
    id_capteur uuid primary key default uuid_generate_v4(),
    reference varchar(100) unique not null,
    type varchar(50),
    date_installation date,
    statut varchar(50),
    id_conteneur uuid not null references conteneur(id_conteneur) on delete cascade,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
create trigger handle_updated_at_capteur before update on capteur for each row execute procedure moddatetime (updated_at);

create table mesure (
    id_mesure uuid primary key default uuid_generate_v4(),
    valeur decimal(10,2),
    datetime timestamp with time zone not null,
    unite varchar(20),
    id_capteur uuid not null references capteur(id_capteur) on delete cascade,
    created_at timestamptz default now()
);

-- 3. UTILISATEURS & ROLES
create table "user" (
    id_user uuid primary key references auth.users(id) on delete cascade,
    nom varchar(100),
    prenom varchar(100),
    email varchar(150) unique not null,
    adresse text,
    date_inscription date default current_date,
    point_total integer default 0,
    avatar_url text,
    telephone varchar(20),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
create trigger handle_updated_at_user before update on "user" for each row execute procedure moddatetime (updated_at);

create table role (
    id_role uuid primary key default uuid_generate_v4(),
    nom varchar(50) not null unique,
    description text,
    created_at timestamptz default now()
);

create table user_role (
    id_user uuid references "user"(id_user) on delete cascade,
    id_role uuid references role(id_role) on delete cascade,
    date_attribution date,
    primary key (id_user, id_role)
);

-- 4. SIGNALEMENTS
create table signalement (
    id_signalement uuid primary key default uuid_generate_v4(),
    type varchar(50),
    description text,
    statut varchar(50) default 'nouveau',
    photo_url text,
    date_signalement timestamptz default now(),
    id_conteneur uuid references conteneur(id_conteneur) on delete set null,
    id_user uuid not null references "user"(id_user) on delete cascade,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
create trigger handle_updated_at_signalement before update on signalement for each row execute procedure moddatetime (updated_at);

-- 5. TOURNEES & VEHICULES
create table type_tournee (
    id_type_tournee uuid primary key default uuid_generate_v4(),
    libelle varchar(100) not null,
    created_at timestamptz default now()
);

create table vehicule (
    matricule varchar(50) primary key,
    marque varchar(100),
    modele varchar(100),
    type_vehicule varchar(50),
    capacite integer,
    created_at timestamptz default now()
);

create table tournee (
    id_tournee uuid primary key default uuid_generate_v4(),
    date date not null,
    heure_debut time,
    heure_fin time,
    statut varchar(50),
    id_type_tournee uuid not null references type_tournee(id_type_tournee) on delete restrict,
    matricule varchar(50) references vehicule(matricule) on delete set null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
create trigger handle_updated_at_tournee before update on tournee for each row execute procedure moddatetime (updated_at);

create table etape_tournee (
    id_tournee uuid references tournee(id_tournee) on delete cascade,
    id_conteneur uuid references conteneur(id_conteneur) on delete cascade,
    ordre integer not null,
    heure_prevue time,
    primary key (id_tournee, id_conteneur)
);

create table realise (
    id_user uuid references "user"(id_user) on delete cascade,
    id_tournee uuid references tournee(id_tournee) on delete cascade,
    primary key (id_user, id_tournee)
);

-- 6. DEFIS & BADGES
create table defi (
    id_defi uuid primary key default uuid_generate_v4(),
    titre varchar(150),
    description text,
    statut varchar(50),
    points_recompense integer,
    date_debut date,
    date_fin date,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
create trigger handle_updated_at_defi before update on defi for each row execute procedure moddatetime (updated_at);

create table badge (
    id_badge uuid primary key default uuid_generate_v4(),
    nom varchar(100),
    description text,
    icon_url text,
    niveau integer,
    created_at timestamptz default now()
);

create table participation_defi (
    id_user uuid references "user"(id_user) on delete cascade,
    id_defi uuid references defi(id_defi) on delete cascade,
    progression integer default 0,
    primary key (id_user, id_defi)
);

create table user_badge (
    id_user uuid references "user"(id_user) on delete cascade,
    id_badge uuid references badge(id_badge) on delete cascade,
    date_obtention date,
    primary key (id_user, id_badge)
);

-- 7. INDEX
create index idx_mesure_capteur on mesure (id_capteur);
create index idx_mesure_capteur_datetime on mesure (id_capteur, datetime desc);
create index idx_signalement_user on signalement (id_user);
create index idx_signalement_conteneur on signalement (id_conteneur);
create index idx_signalement_statut on signalement (statut);
create index idx_etape_tournee on etape_tournee (id_tournee);
create index idx_tournee_statut_date on tournee (statut, date);
