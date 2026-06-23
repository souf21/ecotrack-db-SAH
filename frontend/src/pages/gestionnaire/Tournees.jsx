import { useState, useEffect } from 'react';
import { getUser } from '../../services/auth';
import { supabase } from '../../services/supabase';

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
  annulée:   { label: 'Annulée',   cls: 'bg-red-100 text-red-500' },
};

const STATUS_NEXT = { planifiée: 'en_cours', en_cours: 'terminée' };

export default function Tournees() {
  const [tournees, setTournees]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filterStatus, setFilterStatus]   = useState('');
  const [showCreate, setShowCreate]       = useState(false);
  const [selected, setSelected]           = useState(null);
  const [updating, setUpdating]           = useState(null);
  const [vehicleHistory, setVehicleHistory] = useState([]);

  const token   = getUser()?.token;
  const headers = { Authorization: `Bearer ${token}` };

  const fetchTournees = async () => {
    setLoading(true);
    try {
      const url = filterStatus ? `${API}?statut=${filterStatus}` : API;
      const res  = await fetch(url, { headers });
      const data = await res.json();
      setTournees(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error('[Tournees] fetch:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleHistory = async () => {
    try {
      const [vehiclesRes, allTourneesRes] = await Promise.all([
        fetch(`${API}/vehicles`, { headers }).then(r => r.json()),
        fetch(API, { headers }).then(r => r.json()),
      ]);

      const vehiclesList  = Array.isArray(vehiclesRes)    ? vehiclesRes    : (vehiclesRes.data    || []);
      const allTournees   = Array.isArray(allTourneesRes) ? allTourneesRes : (allTourneesRes.data || []);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const countByMatricule = {};
      allTournees
        .filter(t => t.date && new Date(t.date) >= sevenDaysAgo)
        .forEach(t => {
          if (t.vehicule?.matricule) {
            countByMatricule[t.vehicule.matricule] = (countByMatricule[t.vehicule.matricule] || 0) + 1;
          }
        });

      setVehicleHistory(vehiclesList.map(v => ({
        ...v,
        recentCount: countByMatricule[v.matricule] || 0,
      })));
    } catch (err) {
      console.error('[Tournees] vehicleHistory:', err.message);
    }
  };

  useEffect(() => { fetchTournees(); }, [filterStatus]);
  useEffect(() => { fetchVehicleHistory(); }, []);

  const handleStatusUpdate = async (tournee, next) => {
    setUpdating(tournee.id_tournee);
    try {
      const res = await fetch(`${API}/${tournee.id_tournee}/status`, {
        method:  'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ statut: next }),
      });
      if (!res.ok) throw new Error(await res.text());
      if (next === 'terminée') await resetBinFill(tournee);
      await fetchTournees();
      await fetchVehicleHistory();
    } catch (err) {
      console.error('[Tournees] status update:', err.message);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tournées</h1>
          <p className="text-gray-500 text-sm">{tournees.length} tournée(s)</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-[#00C896] hover:bg-[#00b085] text-white px-5 py-2.5 rounded-xl font-medium text-sm"
        >
          + Nouvelle tournée
        </button>
      </div>

      <div className="flex gap-3">
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#00C896]"
        >
          <option value="">Tous les statuts</option>
          <option value="planifiée">Planifiée</option>
          <option value="en_cours">En cours</option>
          <option value="terminée">Terminée</option>
          <option value="annulée">Annulée</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : tournees.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Aucune tournée.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tournees.map(t => {
            const s      = STATUS_LABELS[t.statut] || { label: t.statut, cls: 'bg-gray-100 text-gray-500' };
            const stops  = t.etape_tournee || [];
            const agents = t.realise || [];
            const next   = STATUS_NEXT[t.statut];
            return (
              <div key={t.id_tournee} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-mono text-xs text-gray-400 mb-1">{t.id_tournee?.slice(0, 8)}...</div>
                    <div className="font-semibold text-gray-800">{t.type_tournee?.libelle || 'N/A'}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.cls}`}>{s.label}</span>
                </div>
                <div className="text-sm text-gray-500 space-y-1 mb-4">
                  <div>📅 {t.date ? new Date(t.date).toLocaleDateString('fr-FR') : 'N/A'}</div>
                  {t.vehicule?.matricule && <div>🚛 {t.vehicule.matricule}</div>}
                  <div>🗑️ {stops.length} arrêt(s)</div>
                  {agents.length > 0 && (
                    <div>👷 {agents.map(r => `${r.user?.prenom || ''} ${r.user?.nom || ''}`.trim()).join(', ')}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelected(t)}
                    className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Détails
                  </button>
                  {next && (
                    <button
                      onClick={() => handleStatusUpdate(t, next)}
                      disabled={updating === t.id_tournee}
                      className="flex-1 bg-[#00C896] hover:bg-[#00b085] text-white py-2 rounded-lg text-sm disabled:opacity-60"
                    >
                      {updating === t.id_tournee ? '...' : next === 'en_cours' ? '▶ Démarrer' : '✓ Terminer'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vehicle historique section */}
      {vehicleHistory.length > 0 && (
        <div className="space-y-3 pt-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Historique des véhicules</h2>
            <p className="text-sm text-gray-400">Tournées effectuées par véhicule — 7 derniers jours</p>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Matricule</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Modèle</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Agent assigné</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Tournées (7j)</th>
                </tr>
              </thead>
              <tbody>
                {vehicleHistory.map(v => {
                  const agentName = v.agent
                    ? `${v.agent.prenom || ''} ${v.agent.nom || ''}`.trim() || null
                    : null;
                  return (
                    <tr key={v.matricule} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-800">{v.matricule}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{[v.marque, v.modele].filter(Boolean).join(' ') || '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {agentName || <span className="text-gray-300">Non assigné</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${v.recentCount > 0 ? 'text-[#00C896]' : 'text-gray-300'}`}>
                            {v.recentCount}
                          </span>
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#00C896] rounded-full"
                              style={{ width: `${Math.min(v.recentCount * 20, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal détail */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="font-bold text-lg">Détail tournée</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Type:</span> <span className="font-medium">{selected.type_tournee?.libelle || 'N/A'}</span></div>
                <div>
                  <span className="text-gray-500">Statut:</span>{' '}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_LABELS[selected.statut]?.cls}`}>
                    {STATUS_LABELS[selected.statut]?.label}
                  </span>
                </div>
                <div><span className="text-gray-500">Date:</span> <span className="font-medium">{selected.date ? new Date(selected.date).toLocaleDateString('fr-FR') : 'N/A'}</span></div>
                {selected.vehicule?.matricule && <div><span className="text-gray-500">Véhicule:</span> <span className="font-medium">{selected.vehicule.matricule}</span></div>}
              </div>

              {selected.realise?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Agents assignés:</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.realise.map((r, i) => (
                      <span key={i} className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-medium">
                        {`${r.user?.prenom || ''} ${r.user?.nom || ''}`.trim() || r.id_user}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Arrêts ({(selected.etape_tournee || []).length}):</p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {(selected.etape_tournee || []).sort((a, b) => a.ordre - b.ordre).map((e, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg px-3 py-2">
                      <span className="w-5 h-5 bg-[#00C896] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">{e.ordre}</span>
                      <span className="text-gray-600">{e.conteneur?.reference || e.conteneur?.id_conteneur}</span>
                      {e.conteneur?.adresse && <span className="text-gray-400 text-xs">— {e.conteneur.adresse}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <CreateTourneeModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { fetchTournees(); fetchVehicleHistory(); }}
          token={token}
        />
      )}
    </div>
  );
}

function CreateTourneeModal({ onClose, onCreated, token }) {
  const [types,    setTypes]    = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bins,     setBins]     = useState([]);
  const [form,     setForm]     = useState({ date: '', id_type_tournee: '', matricule: '' });
  const [agentId,  setAgentId]  = useState(null);
  const [selectedBins, setSelectedBins] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    Promise.all([
      fetch(`${API}/types`,    { headers }).then(r => r.json()),
      fetch(`${API}/vehicles`, { headers }).then(r => r.json()),
      fetch('/api/bins', { headers }).then(r => r.json()),
    ]).then(([typesData, vehiclesData, binsData]) => {
      setTypes(Array.isArray(typesData)    ? typesData    : (typesData.data    || []));
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : (vehiclesData.data || []));
      setBins(Array.isArray(binsData)      ? binsData     : (binsData.data     || []));
    }).catch(err => console.error('[CreateTournee] load:', err.message));
  }, []);

  useEffect(() => {
    if (types.length > 0 && !form.id_type_tournee) {
      setForm(f => ({ ...f, id_type_tournee: types[0].id_type_tournee }));
    }
  }, [types]);

  const handleVehicleChange = (matricule) => {
    setForm(f => ({ ...f, matricule }));
    const vehicle = vehicles.find(v => v.matricule === matricule);
    setAgentId(vehicle?.id_agent || null);
  };

  const toggleBin = (id) =>
    setSelectedBins(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date)           { setError('La date est obligatoire.'); return; }
    if (!form.id_type_tournee) { setError('Le type de tournée est obligatoire.'); return; }
    setSaving(true);
    setError('');
    try {
      const stops  = selectedBins.map((id, i) => ({ id_conteneur: id, ordre: i + 1 }));
      const agents = agentId ? [agentId] : [];
      const res = await fetch(API, {
        method:  'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          date:            form.date,
          id_type_tournee: form.id_type_tournee,
          matricule:       form.matricule || undefined,
          stops,
          agents,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur création');
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const selectedVehicle = vehicles.find(v => v.matricule === form.matricule);
  const selectedAgentName = selectedVehicle?.agent
    ? `${selectedVehicle.agent.prenom || ''} ${selectedVehicle.agent.nom || ''}`.trim() || null
    : null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="font-bold text-lg">Nouvelle tournée</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#00C896]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de tournée *</label>
              <select
                value={form.id_type_tournee}
                onChange={e => setForm(f => ({ ...f, id_type_tournee: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#00C896]"
              >
                {types.length === 0 && <option value="">Chargement...</option>}
                {types.map(t => <option key={t.id_type_tournee} value={t.id_type_tournee}>{t.libelle}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Véhicule</label>
            <select
              value={form.matricule}
              onChange={e => handleVehicleChange(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#00C896]"
            >
              <option value="">Aucun véhicule</option>
              {vehicles.map(v => {
                const name = v.agent
                  ? `${v.agent.prenom || ''} ${v.agent.nom || ''}`.trim()
                  : null;
                return (
                  <option key={v.matricule} value={v.matricule}>
                    {v.matricule}{name ? ` — ${name}` : ''}
                  </option>
                );
              })}
            </select>
            {selectedAgentName && (
              <p className="text-xs text-[#00C896] mt-1">Agent assigné automatiquement : {selectedAgentName}</p>
            )}
            {form.matricule && !selectedAgentName && (
              <p className="text-xs text-gray-400 mt-1">Aucun agent assigné à ce véhicule</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteneurs ({selectedBins.length} sélectionné(s))
            </label>
            <div className="border border-gray-200 rounded-xl max-h-40 overflow-y-auto divide-y divide-gray-50">
              {bins.map(b => (
                <label key={b.id_conteneur} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBins.includes(b.id_conteneur)}
                    onChange={() => toggleBin(b.id_conteneur)}
                    className="accent-[#00C896]"
                  />
                  <span className="text-sm font-medium">{b.reference}</span>
                  {b.adresse && <span className="text-xs text-gray-400 truncate">{b.adresse}</span>}
                </label>
              ))}
              {bins.length === 0 && (
                <div className="px-3 py-4 text-center text-sm text-gray-400">Chargement des conteneurs...</div>
              )}
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-[#00C896] hover:bg-[#00b085] text-white rounded-xl py-2.5 text-sm font-medium disabled:opacity-60">
              {saving ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
