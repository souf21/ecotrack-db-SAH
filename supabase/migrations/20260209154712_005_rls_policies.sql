-- Activer RLS
ALTER TABLE conteneur ENABLE ROW LEVEL SECURITY;

-- Policy : collecteurs voient seulement leur zone
CREATE POLICY collecteur_zone_policy ON conteneur
FOR SELECT
USING (id_zone = (SELECT id_zone FROM "user" WHERE id_user = auth.uid()));

-- Policy : admin voit tout
CREATE POLICY admin_policy ON conteneur
FOR ALL
USING ((SELECT EXISTS(SELECT 1 FROM user_role ur JOIN role r ON ur.id_role = r.id_role WHERE ur.id_user = auth.uid() AND r.nom='admin')));
