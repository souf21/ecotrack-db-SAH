-- Add id_agent FK to vehicule so each vehicle is assigned to one agent

ALTER TABLE vehicule
  ADD COLUMN IF NOT EXISTS id_agent uuid
    REFERENCES "user"(id_user) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_vehicule_id_agent ON vehicule(id_agent);
