-- Mesures
CREATE INDEX IF NOT EXISTS idx_mesure_capteur ON mesure (id_capteur);
CREATE INDEX IF NOT EXISTS idx_mesure_capteur_datetime ON mesure (id_capteur, datetime DESC);

-- Signalements
CREATE INDEX IF NOT EXISTS idx_signalement_user ON signalement (id_user);
CREATE INDEX IF NOT EXISTS idx_signalement_conteneur ON signalement (id_conteneur);
CREATE INDEX IF NOT EXISTS idx_signalement_statut ON signalement (statut);

-- Etapes Tournee
CREATE INDEX IF NOT EXISTS idx_etape_tournee ON etape_tournee (id_tournee);

-- Tournees
CREATE INDEX IF NOT EXISTS idx_tournee_statut_date ON tournee (statut, date);
