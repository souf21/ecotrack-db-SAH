-- ================================
-- SCHEMA COMPLET BASE DE DONNEES
-- ================================

-- ================================
-- 1. ZONES & DECHETS
-- ================================

CREATE TABLE zone (
    id_zone SERIAL PRIMARY KEY,
    nom_zone VARCHAR(100) NOT NULL,
    code_postal VARCHAR(10),
    description TEXT
);

CREATE TABLE type_dechets (
    id_type_dechets SERIAL PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL,
    couleur VARCHAR(50)
);

CREATE TABLE conteneur (
    id_conteneur SERIAL PRIMARY KEY,
    reference VARCHAR(100) UNIQUE NOT NULL,
    adresse TEXT,
    etat VARCHAR(50),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    capacite_totale INTEGER,
    date_installation DATE,
    id_zone INTEGER NOT NULL,
    id_type_dechets INTEGER NOT NULL,
    FOREIGN KEY (id_zone) REFERENCES zone(id_zone),
    FOREIGN KEY (id_type_dechets) REFERENCES type_dechets(id_type_dechets)
);

-- ================================
-- 2. CAPTEURS & MESURES
-- ================================

CREATE TABLE capteur (
    id_capteur SERIAL PRIMARY KEY,
    reference VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50),
    date_installation DATE,
    statut VARCHAR(50),
    id_conteneur INTEGER NOT NULL,
    FOREIGN KEY (id_conteneur) REFERENCES conteneur(id_conteneur)
);

CREATE TABLE mesure (
    id_mesure SERIAL PRIMARY KEY,
    valeur DECIMAL(10,2),
    datetime TIMESTAMP NOT NULL,
    unite VARCHAR(20),
    id_capteur INTEGER NOT NULL,
    FOREIGN KEY (id_capteur) REFERENCES capteur(id_capteur)
);

-- ================================
-- 3. UTILISATEURS & ROLES
-- ================================

CREATE TABLE "user" (
    id_user SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    adresse TEXT,
    date_inscription DATE DEFAULT CURRENT_DATE,
    point_total INTEGER DEFAULT 0,
    avatar_url TEXT,
    telephone VARCHAR(20)
);

CREATE TABLE role (
    id_role SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE user_role (
    id_user INTEGER,
    id_role INTEGER,
    date_attribution DATE,
    PRIMARY KEY (id_user, id_role),
    FOREIGN KEY (id_user) REFERENCES "user"(id_user),
    FOREIGN KEY (id_role) REFERENCES role(id_role)
);

-- ================================
-- 4. SIGNALEMENTS
-- ================================

CREATE TABLE signalement (
    id_signalement SERIAL PRIMARY KEY,
    type VARCHAR(50),
    description TEXT,
    statut VARCHAR(50),
    photo_url TEXT,
    date_signalement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_conteneur INTEGER,
    id_user INTEGER NOT NULL,
    FOREIGN KEY (id_conteneur) REFERENCES conteneur(id_conteneur),
    FOREIGN KEY (id_user) REFERENCES "user"(id_user)
);

-- ================================
-- 5. TOURNEES & VEHICULES
-- ================================

CREATE TABLE type_tournee (
    id_type_tournee SERIAL PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL
);

CREATE TABLE vehicule (
    matricule VARCHAR(50) PRIMARY KEY,
    marque VARCHAR(100),
    modele VARCHAR(100),
    type_vehicule VARCHAR(50),
    capacite INTEGER
);

CREATE TABLE tournee (
    id_tournee SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    heure_debut TIME,
    heure_fin TIME,
    statut VARCHAR(50),
    id_type_tournee INTEGER NOT NULL,
    matricule VARCHAR(50),
    FOREIGN KEY (id_type_tournee) REFERENCES type_tournee(id_type_tournee),
    FOREIGN KEY (matricule) REFERENCES vehicule(matricule)
);

CREATE TABLE etape_tournee (
    id_tournee INTEGER,
    id_conteneur INTEGER,
    ordre INTEGER,
    heure_prevue TIME,
    PRIMARY KEY (id_tournee, id_conteneur),
    FOREIGN KEY (id_tournee) REFERENCES tournee(id_tournee),
    FOREIGN KEY (id_conteneur) REFERENCES conteneur(id_conteneur)
);

CREATE TABLE realise (
    id_user INTEGER,
    id_tournee INTEGER,
    PRIMARY KEY (id_user, id_tournee),
    FOREIGN KEY (id_user) REFERENCES "user"(id_user),
    FOREIGN KEY (id_tournee) REFERENCES tournee(id_tournee)
);

-- ================================
-- 6. DEFIS & BADGES
-- ================================

CREATE TABLE defi (
    id_defi SERIAL PRIMARY KEY,
    titre VARCHAR(150),
    description TEXT,
    statut VARCHAR(50),
    points_recompense INTEGER,
    date_debut DATE,
    date_fin DATE
);

CREATE TABLE badge (
    id_badge SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    description TEXT,
    icon_url TEXT,
    niveau INTEGER
);

CREATE TABLE participation_defi (
    id_user INTEGER,
    id_defi INTEGER,
    progression INTEGER DEFAULT 0,
    PRIMARY KEY (id_user, id_defi),
    FOREIGN KEY (id_user) REFERENCES "user"(id_user),
    FOREIGN KEY (id_defi) REFERENCES defi(id_defi)
);

CREATE TABLE user_badge (
    id_user INTEGER,
    id_badge INTEGER,
    date_obtention DATE,
    PRIMARY KEY (id_user, id_badge),
    FOREIGN KEY (id_user) REFERENCES "user"(id_user),
    FOREIGN KEY (id_badge) REFERENCES badge(id_badge)
);

-- ================================
-- 7. INDEX
-- ================================

CREATE INDEX idx_mesure_capteur ON mesure (id_capteur);
CREATE INDEX idx_mesure_capteur_datetime ON mesure (id_capteur, datetime DESC);

CREATE INDEX idx_signalement_user ON signalement (id_user);
CREATE INDEX idx_signalement_conteneur ON signalement (id_conteneur);
CREATE INDEX idx_signalement_statut ON signalement (statut);

CREATE INDEX idx_etape_tournee ON etape_tournee (id_tournee);

CREATE INDEX idx_tournee_statut_date ON tournee (statut, date);