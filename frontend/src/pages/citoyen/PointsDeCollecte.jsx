import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../services/supabase';

export default function PointsDeCollecte() {
  const [conteneurs, setConteneurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchConteneurs();
  }, []);

  async function fetchConteneurs() {
    setLoading(true);
    const { data, error } = await supabase
      .from('conteneur')
      .select(`
        id_conteneur,
        reference,
        adresse,
        latitude,
        longitude,
        capacite_totale,
        etat,
        zone(nom_zone),
        type_dechets(libelle)
      `);

    if (error) console.error(error);
    else setConteneurs(data || []);
    
    setLoading(false);
  }

  const filtered = useMemo(() => {
    return conteneurs.filter(c => {
      const matchSearch = !search || 
        c.reference?.toLowerCase().includes(search.toLowerCase()) ||
        c.adresse?.toLowerCase().includes(search.toLowerCase());

      const matchType = !filterType || c.type_dechets?.libelle === filterType;

      return c.latitude && c.longitude && matchSearch && matchType;
    });
  }, [conteneurs, search, filterType]);

  // Centre la carte sur le premier conteneur ou sur Paris
  const mapCenter = filtered.length > 0 
    ? [filtered[0].latitude, filtered[0].longitude] 
    : [48.8566, 2.3522];

  if (loading) return <div className="py-12 text-center">Chargement de la carte...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Points de collecte</h1>

      {/* Recherche + Filtre */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-4 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher par référence ou adresse..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 py-4 border border-gray-200 rounded-2xl focus:border-emerald-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-200 rounded-2xl px-6 py-4"
        >
          <option value="">Tous les types</option>
          {[...new Set(conteneurs.map(c => c.type_dechets?.libelle).filter(Boolean))].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Carte */}
      <div className="h-[500px] rounded-3xl overflow-hidden border border-gray-200">
        <MapContainer center={mapCenter} zoom={filtered.length > 0 ? 13 : 10} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filtered.map((c) => (
            <Marker key={c.id_conteneur} position={[c.latitude, c.longitude]}>
              <Popup>
                <div className="text-sm">
                  <strong>{c.reference}</strong><br />
                  {c.adresse}<br />
                  {c.zone?.nom_zone}<br />
                  <span className="text-emerald-600">{c.type_dechets?.libelle}</span><br />
                  {c.capacite_totale}L • {c.etat}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Liste */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div key={c.id_conteneur} className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="font-bold text-xl">{c.reference}</div>
            <div className="text-gray-500">{c.adresse}</div>
            <div className="text-sm text-gray-400 mt-1">{c.zone?.nom_zone}</div>
            <div className="mt-3 text-sm">
              <span className="font-medium">{c.capacite_totale} L</span> • {c.etat}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}