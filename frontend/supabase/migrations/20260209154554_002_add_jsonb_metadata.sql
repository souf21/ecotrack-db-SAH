ALTER TABLE conteneur
ADD COLUMN metadata JSONB;

-- Exemple index GIN sur metadata
CREATE INDEX idx_conteneur_metadata ON conteneur USING GIN(metadata);
