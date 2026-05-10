-- Auto-create a fill sensor + initial 0% reading whenever a new conteneur is inserted

CREATE OR REPLACE FUNCTION create_fill_sensor_for_conteneur()
RETURNS TRIGGER AS $$
DECLARE
  v_capteur_id uuid;
BEGIN
  INSERT INTO capteur (reference, type, statut, date_installation, id_conteneur)
  VALUES (
    'CAP-' || NEW.reference || '-REMPL',
    'remplissage',
    'actif',
    CURRENT_DATE,
    NEW.id_conteneur
  )
  RETURNING id_capteur INTO v_capteur_id;

  INSERT INTO mesure (id_capteur, valeur, unite, datetime)
  VALUES (v_capteur_id, 0, '%', NOW());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_fill_sensor
  AFTER INSERT ON conteneur
  FOR EACH ROW
  EXECUTE FUNCTION create_fill_sensor_for_conteneur();

-- Fix existing bins that have no sensor yet (BIN-004 etc.)
DO $$
DECLARE
  r RECORD;
  v_capteur_id uuid;
BEGIN
  FOR r IN
    SELECT c.id_conteneur, c.reference
    FROM conteneur c
    WHERE NOT EXISTS (
      SELECT 1 FROM capteur cap
      WHERE cap.id_conteneur = c.id_conteneur
        AND cap.type = 'remplissage'
    )
  LOOP
    INSERT INTO capteur (reference, type, statut, date_installation, id_conteneur)
    VALUES ('CAP-' || r.reference || '-REMPL', 'remplissage', 'actif', CURRENT_DATE, r.id_conteneur)
    RETURNING id_capteur INTO v_capteur_id;

    INSERT INTO mesure (id_capteur, valeur, unite, datetime)
    VALUES (v_capteur_id, 0, '%', NOW());
  END LOOP;
END $$;

-- Reliable function to get latest fill % per container
CREATE OR REPLACE FUNCTION get_latest_fill_per_container()
RETURNS TABLE(id_conteneur uuid, fill_pct numeric, measured_at timestamptz)
LANGUAGE sql
STABLE
AS $$
  SELECT DISTINCT ON (cap.id_conteneur)
    cap.id_conteneur,
    m.valeur      AS fill_pct,
    m.datetime    AS measured_at
  FROM capteur cap
  JOIN mesure m ON m.id_capteur = cap.id_capteur
  WHERE cap.type = 'remplissage'
    AND m.unite   = '%'
  ORDER BY cap.id_conteneur, m.datetime DESC;
$$;