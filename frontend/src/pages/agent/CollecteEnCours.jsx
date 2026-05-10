import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { getUser } from '../../services/auth';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function CollecteEnCours({ user }) {
  const [conteneurs, setConteneurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');

  const center = [48.8566, 2.3522];

  useEffect(() => {
    async function fetchPoints() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('conteneur')
          .select('id_conteneur, reference, adresse, latitude, longitude, capacite, etat, type_dechets:id_type_dechets(nom)')
          .not('latitude', 'is', null)
          .not('longitude', 'is', null);

        if (error) throw error;
        setConteneurs(data || []);
      } catch (err) {
        console.error('[CollecteEnCours] fetch:', err.message);
        setConteneurs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPoints();
  }, []);

  const types = [...new Set(conteneurs.map(c => c.type_dechets?.nom).filter(Boolean))];

  const filtered = conteneurs.filter(c => {
    const matchSearch = !search ||
      c.reference?.toLowerCase().includes(search.toLowerCase()) ||
      c.adresse?.toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || c.type_dechets?.nom === filterType;
    return matchSearch && matchType;
  });

  if (loading) return <div className="py-12 text-center text-gray-400">Chargement de la carte...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-800">Points de collecte</h1>
        <p className="text-emerald-700 mt-1">{conteneurs.length} conteneur(s) sur la carte</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Rechercher un conteneur..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
        >
          <option value="">Tous les types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="h-112.5 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {filtered.map(c => (
            <Marker key={c.id_conteneur} position={[Number(c.latitude), Number(c.longitude)]}>
              <Popup>
                <div className="min-w-45">
                  <strong>{c.reference}</strong><br />
                  {c.adresse && <span className="text-gray-600">{c.adresse}</span>}<br />
                  {c.type_dechets?.nom && <span className="text-emerald-600">{c.type_dechets.nom}</span>}
                  {c.capacite && <span> • {c.capacite}L</span>}
                  <br />
                  <span className={c.etat === 'alerte' ? 'text-red-600 font-semibold' : 'text-gray-500'}>
                    État : {c.etat || 'N/A'}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(c => (
          <div key={c.id_conteneur} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-gray-800">{c.reference}</div>
                {c.adresse && <div className="text-gray-500 text-sm">{c.adresse}</div>}
              </div>
              <div className="flex flex-col items-end gap-1">
                {c.type_dechets?.nom && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                    {c.type_dechets.nom}
                  </span>
                )}
                {c.etat === 'alerte' && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    Alerte
                  </span>
                )}
              </div>
            </div>
            {c.capacite && (
              <div className="mt-3 text-sm text-gray-500">Capacité : {c.capacite}L</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
