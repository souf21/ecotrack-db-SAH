-- Mesures
CREATE INDEX idx_mesure_capteur ON mesure (id_capteur);
CREATE INDEX idx_mesure_capteur_datetime ON mesure (id_capteur, datetime DESC);

-- Signalements
CREATE INDEX idx_signalement_user ON signalement (id_user);
CREATE INDEX idx_signalement_conteneur ON signalement (id_conteneur);
CREATE INDEX idx_signalement_statut ON signalement (statut);

-- Etapes Tournee
CREATE INDEX idx_etape_tournee ON etape_tournee (id_tournee);

-- Tournees
CREATE INDEX idx_tournee_statut_date ON tournee (statut, date);
