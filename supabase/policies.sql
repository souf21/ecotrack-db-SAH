-- RLS conteneur
ALTER TABLE conteneur ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_containers ON conteneur
FOR SELECT
USING (id_zone = (SELECT id_zone FROM "user" WHERE id_user = auth.uid()));
