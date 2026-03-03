-- Table partitionnée
CREATE TABLE mesure_partitioned (
    id_mesure uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    valeur decimal(10,2),
    datetime timestamptz NOT NULL,
    unite varchar(20),
    id_capteur uuid NOT NULL REFERENCES capteur(id_capteur),
    created_at timestamptz DEFAULT now()
) PARTITION BY RANGE (datetime);

-- Exemple : partitions mensuelles
CREATE TABLE mesure_2026_02 PARTITION OF mesure_partitioned
FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

CREATE TABLE mesure_2026_03 PARTITION OF mesure_partitioned
FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');

-- Migration des données existantes
INSERT INTO mesure_partitioned (id_mesure, valeur, datetime, unite, id_capteur, created_at)
SELECT id_mesure, valeur, datetime, unite, id_capteur, created_at FROM mesure;
