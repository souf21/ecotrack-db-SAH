import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../services/supabase';

export default function AgentCarte() {
  const [conteneurs, setConteneurs] = useState([]);
  const [fillMap, setFillMap]       = useState({});
  const [loading, setLoading]       = useState(true);
  const [filterAlert, setFilterAlert] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    const [binsRes, fillRes] = await Promise.all([
      supabase.from('conteneur').select('id_conteneur, reference, adresse, latitude, longitude, etat, zone(nom_zone), type_dechets(libelle)'),
      supabase.rpc('get_latest_fill_per_container'),
    ]);

    setConteneurs(binsRes.data || []);

    const map = {};
    (fillRes.data || []).forEach(row => {
      map[row.id_conteneur] = Math.round(Number(row.fill_pct));
    });
    setFillMap(map);
    setLoading(false);
  }

  const withCoords = useMemo(
    () => conteneurs.filter(c => c.latitude != null && c.longitude != null),
    [conteneurs]
  );

  const displayed = useMemo(
    () => filterAlert ? withCoords.filter(c => (fillMap[c.id_conteneur] ?? 0) > 80) : withCoords,
    [withCoords, fillMap, filterAlert]
  );

  const alertCount = useMemo(
    () => conteneurs.filter(c => (fillMap[c.id_conteneur] ?? 0) > 80).length,
    [conteneurs, fillMap]
  );

  const center = displayed.length > 0
    ? [displayed[0].latitude, displayed[0].longitude]
    : [48.8566, 2.3522];

  function markerColor(id) {
    const fill = fillMap[id] ?? 0;
    if (fill > 80) return '#ef4444';
    if (fill > 50) return '#f97316';
    return '#00C896';
  }

  if (loading) return <div className="py-12 text-center text-gray-400">Chargement de la carte...</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Carte des conteneurs</h1>
          <p className="text-sm text-gray-400">{withCoords.length} conteneur(s) géolocalisé(s)</p>
        </div>
        <div className="flex items-center gap-3">
          {alertCount > 0 && (
            <button
              onClick={() => setFilterAlert(v => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                filterAlert
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
              }`}
            >
              ⚠ {alertCount} alerte{alertCount > 1 ? 's' : ''} (&gt;80%)
            </button>
          )}
          <button onClick={fetchData}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
            Rafraîchir
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-full bg-[#00C896]" /> Normal (&lt;50%)</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-full bg-orange-400" /> Moyen (50–80%)</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-full bg-red-500" /> Plein (&gt;80%)</span>
      </div>

      {/* Map */}
      <div className="h-120 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <MapContainer center={center} zoom={displayed.length > 0 ? 13 : 10} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {displayed.map(c => {
            const fill = fillMap[c.id_conteneur];
            return (
              <CircleMarker
                key={c.id_conteneur}
                center={[Number(c.latitude), Number(c.longitude)]}
                radius={fill != null && fill > 80 ? 14 : 10}
                pathOptions={{ color: markerColor(c.id_conteneur), fillColor: markerColor(c.id_conteneur), fillOpacity: 0.85, weight: 2 }}
              >
                <Popup>
                  <div className="text-sm min-w-37.5">
                    <div className="font-bold text-gray-800 mb-1">{c.reference}</div>
                    {c.adresse && <div className="text-gray-500 text-xs mb-1">{c.adresse}</div>}
                    {c.zone?.nom_zone && <div className="text-gray-400 text-xs mb-2">{c.zone.nom_zone}</div>}
                    {fill != null ? (
                      <div className="mt-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${fill}%`, backgroundColor: markerColor(c.id_conteneur) }} />
                          </div>
                          <span className="font-semibold text-xs" style={{ color: markerColor(c.id_conteneur) }}>{fill}%</span>
                        </div>
                        {fill > 80 && <div className="text-xs font-semibold text-red-600">⚠ Collecte requise</div>}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">Aucune mesure</div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Alert list */}
      {alertCount > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-red-700 mb-3">Conteneurs à collecter en priorité</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {conteneurs
              .filter(c => (fillMap[c.id_conteneur] ?? 0) > 80)
              .sort((a, b) => (fillMap[b.id_conteneur] ?? 0) - (fillMap[a.id_conteneur] ?? 0))
              .map(c => (
                <div key={c.id_conteneur} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-red-100">
                  <div>
                    <span className="font-mono text-xs font-bold text-gray-800">{c.reference}</span>
                    {c.adresse && <span className="text-xs text-gray-400 ml-2">— {c.adresse}</span>}
                  </div>
                  <span className="text-sm font-bold text-red-600">{fillMap[c.id_conteneur]}%</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {withCoords.length === 0 && (
        <div className="text-center py-12 text-gray-400 bg-white border border-gray-100 rounded-2xl">
          Aucun conteneur géolocalisé pour le moment.
        </div>
      )}
    </div>
  );
}
