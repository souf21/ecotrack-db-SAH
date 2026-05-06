import { useState } from 'react';
import { Plus, Search, Clock, Users, Trash2, MapPin, Route, Flag } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const mockTournees = [
  { 
    id: "TRN-001", 
    status: "En cours", 
    date: "2026-03-09", 
    agent: "M. Dupont", 
    zone: "Centre de Paris", 
    containers: 24, 
    time: "06:30 — en cours",
    color: "bg-green-100 text-green-700",
    points: [
      { lat: 48.8566, lng: 2.3522, ref: "ECO-0002", adresse: "Hôtel de Ville" },
      { lat: 48.8600, lng: 2.3400, ref: "ECO-0003", adresse: "Louvre" },
      { lat: 48.8635, lng: 2.3300, ref: "ECO-0004", adresse: "Opéra Garnier" },
      { lat: 48.8700, lng: 2.3000, ref: "ECO-0005", adresse: "Champs-Élysées" }
    ]
  }
];

export default function Tournees() {
  const [search, setSearch] = useState('');
  const [selectedTournee, setSelectedTournee] = useState(null);

  const filteredTournees = mockTournees.filter(t => 
    t.id.toLowerCase().includes(search.toLowerCase()) || 
    t.zone.toLowerCase().includes(search.toLowerCase())
  );

  const handleOptimizeRoute = (tour) => {
    setSelectedTournee(tour);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tournées</h1>
          <p className="text-gray-500">{filteredTournees.length} tournées</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-medium">
          <Plus size={20} /> Planifier une tournée
        </button>
      </div>

      {/* Recherche */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher une tournée..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Liste */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTournees.map((tour) => (
          <div key={tour.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all">
            <div className="flex justify-between">
              <div className="font-mono font-bold text-xl">{tour.id}</div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${tour.color}`}>
                {tour.status}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2"><Clock size={16} /> {tour.date} • {tour.time}</div>
              <div className="flex items-center gap-2"><Users size={16} /> {tour.agent}</div>
              <div className="flex items-center gap-2"><MapPin size={16} /> {tour.zone}</div>
              <div className="flex items-center gap-2"><Trash2 size={16} /> {tour.containers} conteneurs</div>
            </div>

            <button 
              onClick={() => handleOptimizeRoute(tour)}
              className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Route size={18} />
              Optimiser le trajet
            </button>
          </div>
        ))}
      </div>

      {/* ==================== ITINÉRAIRE SUR CARTE ==================== */}
      {selectedTournee && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Route className="text-emerald-600" /> 
              Itinéraire Optimisé — {selectedTournee.id}
            </h2>
            <button onClick={() => setSelectedTournee(null)} className="text-red-500 hover:text-red-700">Fermer</button>
          </div>

          <div className="h-[520px] rounded-2xl overflow-hidden border mb-4">
            <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* Ligne d'itinéraire */}
              <Polyline 
                positions={selectedTournee.points.map(p => [p.lat, p.lng])} 
                color="#10b981" 
                weight={6} 
                opacity={0.8}
              />

              {/* Points avec numérotation */}
              {selectedTournee.points.map((point, index) => {
                const isStart = index === 0;
                const isEnd = index === selectedTournee.points.length - 1;

                return (
                  <Marker key={index} position={[point.lat, point.lng]}>
                    <Popup>
                      <div className="font-medium">
                        {isStart && "🟢 Départ - "} 
                        {isEnd && "🏁 Arrivée - "}
                        {!isStart && !isEnd && `Arrêt ${index + 1} - `}
                        {point.ref}
                      </div>
                      <div className="text-sm text-gray-600">{point.adresse}</div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {/* Résumé de l'itinéraire */}
          <div className="p-4 bg-emerald-50 rounded-xl">
            <p className="font-medium text-emerald-700">
              🟢 Départ : {selectedTournee.points[0].ref} ({selectedTournee.points[0].adresse})
            </p>
            <p className="font-medium text-red-600 mt-2">
              🏁 Arrivée : {selectedTournee.points[selectedTournee.points.length - 1].ref} ({selectedTournee.points[selectedTournee.points.length - 1].adresse})
            </p>
            <p className="text-sm text-gray-600 mt-3">
              {selectedTournee.points.length} points de collecte • Trajet optimisé
            </p>
          </div>
        </div>
      )}
    </div>
  );
}