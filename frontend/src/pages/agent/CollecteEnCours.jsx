import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function PointsDeCollecte() {
  const [conteneurs, setConteneurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');

  // Centre de Paris
  const center = [48.8566, 2.3522];

  useEffect(() => {
    // Simulation de données (tu pourras remplacer par Supabase plus tard)
    const mockData = [
      { id: 1, reference: "ECO-0002", lat: 48.8566, lng: 2.3522, adresse: "2ème Arrondissement", type: "RECYCLABLE", capacite: 360, remplissage: 52 },
      { id: 2, reference: "ECO-0003", lat: 48.8630, lng: 2.3400, adresse: "3ème Arrondissement", type: "ORGANIQUE", capacite: 660, remplissage: 9 },
      { id: 3, reference: "ECO-0004", lat: 48.8500, lng: 2.3700, adresse: "4ème Arrondissement", type: "ENCOMBRANTS", capacite: 1100, remplissage: 71 },
      { id: 4, reference: "ECO-0005", lat: 48.8700, lng: 2.3000, adresse: "5ème Arrondissement", type: "OMR", capacite: 240, remplissage: 66 },
      { id: 5, reference: "ECO-0006", lat: 48.8400, lng: 2.3800, adresse: "13ème Arrondissement", type: "RECYCLABLE", capacite: 420, remplissage: 88 },
    ];
    setConteneurs(mockData);
    setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    return conteneurs.filter(c => {
      const matchSearch = !search || 
        c.reference.toLowerCase().includes(search.toLowerCase()) ||
        c.adresse.toLowerCase().includes(search.toLowerCase());
      const matchType = !filterType || c.type === filterType;
      return matchSearch && matchType;
    });
  }, [conteneurs, search, filterType]);

  if (loading) return <div className="py-12 text-center">Chargement de la carte...</div>;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-800">Trouvez un point de collecte près de chez vous</h1>
        <p className="text-emerald-700 mt-1">2 000 conteneurs connectés sur toute la métropole</p>
      </div>

      {/* Recherche + Filtre */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-4 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un point de collecte..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-5 py-3 focus:outline-none focus:border-emerald-500"
        >
          <option value="">Tous les types</option>
          <option value="RECYCLABLE">Recyclable</option>
          <option value="ORGANIQUE">Organique</option>
          <option value="ENCOMBRANTS">Encombrants</option>
          <option value="OMR">OMR</option>
        </select>
      </div>

      {/* Carte Interactive */}
      <div className="h-[480px] rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
        <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {filtered.map((c) => (
            <Marker key={c.id} position={[c.lat, c.lng]}>
              <Popup>
                <div className="min-w-[200px]">
                  <strong className="text-lg">{c.reference}</strong><br />
                  {c.adresse}<br />
                  <span className="text-emerald-600">{c.type}</span> • {c.capacite}L<br />
                  Remplissage : <strong>{c.remplissage}%</strong>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Liste en cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-xl">{c.reference}</div>
                <div className="text-gray-500">{c.adresse}</div>
              </div>
              <span className="px-4 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                {c.type}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Remplissage</span>
                <span className="font-semibold">{c.remplissage}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${c.remplissage > 75 ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${c.remplissage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}