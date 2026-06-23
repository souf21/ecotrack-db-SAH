import { useState, useEffect } from 'react';
import { getUser } from '../../services/auth';
import { supabase } from '../../services/supabase';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

async function resetBinFill(tournee) {
  const containerIds = (tournee.etape_tournee || [])
    .map(e => e.conteneur?.id_conteneur)
    .filter(Boolean);
  if (!containerIds.length) return;

  const { data: sensors } = await supabase
    .from('capteur')
    .select('id_capteur')
    .in('id_conteneur', containerIds)
    .eq('type', 'remplissage');

  if (!sensors?.length) return;

  const now = new Date().toISOString();
  await supabase.from('mesure').insert(
    sensors.map(s => ({ id_capteur: s.id_capteur, valeur: 0, unite: '%', datetime: now }))
  );
}

const API = '/api/routes';

const STATUS_LABELS = {
  planifiée: { label: 'Planifiée', cls: 'bg-blue-100 text-blue-700' },
  en_cours:  { label: 'En cours',  cls: 'bg-green-100 text-green-700' },
  terminée:  { label: 'Terminée',  cls: 'bg-gray-100 text-gray-500' },
};

export default function AgentTournees({ user }) {
  const [tournees, setTournees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(null);

  const token = user?.token || getUser()?.token;
  const headers = { Authorization: `Bearer ${token}` };

  const fetchTournees = async () => {
    setLoading(true);
    try {
      // GET /api/routes returns only this agent's tournées when called with agent JWT
      const res = await fetch(API, { headers });
      const data = await res.json();
      setTournees(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error('[AgentTournees] fetch:', err.message);
      setTournees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTournees(); }, []);

  const updateStatus = async (tournee, statut) => {
    setUpdating(tournee.id_tournee);
    try {
      const res = await fetch(`${API}/${tournee.id_tournee}/status`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut }),
      });
      if (!res.ok) throw new Error(await res.text());
      if (statut === 'terminée') await resetBinFill(tournee);
      await fetchTournees();
    } catch (err) {
      console.error('[AgentTournees] status update:', err.message);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Chargement de vos tournées...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mes tournées</h1>
        <p className="text-gray-500 text-sm">{tournees.length} tournée(s) assignée(s)</p>
      </div>

      {tournees.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
          <div className="text-4xl mb-3">🗺️</div>
          <p>Aucune tournée assignée pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournees.map(t => {
            const s = STATUS_LABELS[t.statut] || { label: t.statut, cls: 'bg-gray-100 text-gray-500' };
            const stops = t.etape_tournee || [];
            return (
              <div key={t.id_tournee} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-gray-800">{t.type_tournee?.libelle || 'Collecte'}</div>
                    <div className="text-sm text-gray-500">
                      {t.date ? new Date(t.date).toLocaleDateString('fr-FR') : 'Date N/A'}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.cls}`}>{s.label}</span>
                </div>
                <div className="text-sm text-gray-500 mb-4 space-y-1">
                  {t.vehicule?.matricule && <div>🚛 {t.vehicule.matricule}</div>}
                  <div>🗑️ {stops.length} arrêt(s)</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelected(t)}
                    className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Voir itinéraire
                  </button>
                  {t.statut === 'planifiée' && (
                    <button
                      onClick={() => updateStatus(t, 'en_cours')}
                      disabled={updating === t.id_tournee}
                      className="flex-1 bg-[#00C896] hover:bg-[#00b085] text-white py-2 rounded-lg text-sm disabled:opacity-60"
                    >
                      {updating === t.id_tournee ? '...' : '▶ Démarrer'}
                    </button>
                  )}
                  {t.statut === 'en_cours' && (
                    <button
                      onClick={() => updateStatus(t, 'terminée')}
                      disabled={updating === t.id_tournee}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm disabled:opacity-60"
                    >
                      {updating === t.id_tournee ? '...' : '✓ Terminer'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Carte itinéraire */}
      {selected && <TourneeMap tournee={selected} onClose={() => setSelected(null)} onStatusChange={updateStatus} updating={updating} />}
    </div>
  );
}

function TourneeMap({ tournee, onClose, onStatusChange, updating }) {
  const stops = (tournee.etape_tournee || []).sort((a, b) => a.ordre - b.ordre);
  const mapPoints = stops
    .map(e => e.conteneur?.latitude != null && e.conteneur?.longitude != null
      ? [Number(e.conteneur.latitude), Number(e.conteneur.longitude)]
      : null)
    .filter(Boolean);
  const center = mapPoints.length ? mapPoints[0] : [48.8566, 2.3522];
  const s = STATUS_LABELS[tournee.statut] || { label: tournee.statut, cls: 'bg-gray-100 text-gray-500' };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b">
          <div>
            <h2 className="font-bold text-lg">{tournee.type_tournee?.libelle || 'Tournée'} — Itinéraire</h2>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="p-5 space-y-4">
          {mapPoints.length > 0 ? (
            <div className="h-64 rounded-xl overflow-hidden border">
              <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {mapPoints.length > 1 && (
                  <Polyline positions={mapPoints} color="#00C896" weight={4} opacity={0.8} />
                )}
                {stops.map((e, i) => {
                  if (!e.conteneur?.latitude || !e.conteneur?.longitude) return null;
                  return (
                    <Marker key={i} position={[Number(e.conteneur.latitude), Number(e.conteneur.longitude)]}>
                      <Popup>
                        <strong>{i === 0 ? '🟢 Départ' : i === stops.length - 1 ? '🏁 Fin' : `Arrêt ${e.ordre}`}</strong><br />
                        {e.conteneur.reference}
                        {e.conteneur.adresse && <><br /><span className="text-gray-500">{e.conteneur.adresse}</span></>}
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          ) : (
            <div className="h-20 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 text-sm">
              Coordonnées non disponibles pour cette tournée
            </div>
          )}

          <div className="space-y-1.5">
            {stops.map((e, i) => (
              <div key={i} className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg px-3 py-2">
                <span className="w-5 h-5 bg-[#00C896] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">{e.ordre}</span>
                <span className="font-medium">{e.conteneur?.reference || '—'}</span>
                {e.conteneur?.adresse && <span className="text-gray-400 text-xs">— {e.conteneur.adresse}</span>}
              </div>
            ))}
          </div>

          {tournee.statut === 'planifiée' && (
            <button
              onClick={() => { onStatusChange(tournee, 'en_cours'); onClose(); }}
              disabled={updating === tournee.id_tournee}
              className="w-full bg-[#00C896] hover:bg-[#00b085] text-white rounded-xl py-3 font-medium disabled:opacity-60"
            >
              ▶ Démarrer cette tournée
            </button>
          )}
          {tournee.statut === 'en_cours' && (
            <button
              onClick={() => { onStatusChange(tournee, 'terminée'); onClose(); }}
              disabled={updating === tournee.id_tournee}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-medium disabled:opacity-60"
            >
              ✓ Marquer comme terminée
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
