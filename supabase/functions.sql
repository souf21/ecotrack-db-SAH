CREATE OR REPLACE FUNCTION daily_stats(p_date DATE)
RETURNS TABLE(
    bin_id uuid,
    avg_fill_level numeric,
    max_fill_level numeric,
    measurements_count integer
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id_conteneur,
        AVG(m.valeur),
        MAX(m.valeur),
        COUNT(*)
    FROM mesure_partitioned m
    JOIN capteur cp ON cp.id_capteur = m.id_capteur
    JOIN conteneur c ON c.id_conteneur = cp.id_conteneur
    WHERE DATE(m.datetime) = p_date
    GROUP BY c.id_conteneur;
END;
$$ LANGUAGE plpgsql;
