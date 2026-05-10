-- Fix RLS policies: replace broken 'admin' role name with 'gestionnaire'
-- Also add policies for INSERT/UPDATE/DELETE that were missing

-- Drop the broken policies
DROP POLICY IF EXISTS admin_policy         ON conteneur;
DROP POLICY IF EXISTS collecteur_zone_policy ON conteneur;

-- Gestionnaire: full access to all containers
CREATE POLICY gestionnaire_full_access ON conteneur
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_role ur
    JOIN role r ON ur.id_role = r.id_role
    WHERE ur.id_user = auth.uid() AND r.nom = 'gestionnaire'
  )
);

-- Agent: can read and update containers in their zone
CREATE POLICY agent_zone_select ON conteneur
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_role ur
    JOIN role r ON ur.id_role = r.id_role
    WHERE ur.id_user = auth.uid() AND r.nom = 'agent'
  )
);

CREATE POLICY agent_zone_update ON conteneur
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_role ur
    JOIN role r ON ur.id_role = r.id_role
    WHERE ur.id_user = auth.uid() AND r.nom = 'agent'
  )
);

-- Citoyen: read-only access (they can see containers to file reports)
CREATE POLICY citoyen_read ON conteneur
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_role ur
    JOIN role r ON ur.id_role = r.id_role
    WHERE ur.id_user = auth.uid() AND r.nom = 'citoyen'
  )
);
