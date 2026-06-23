import { useState, useEffect } from 'react';
import { getUser } from '../../services/auth';

const API = '/api/gamification/signalements';

const STATUS_LABELS = {
  nouveau:    { label: 'Nouveau',    cls: 'bg-orange-100 text-orange-700' },
  en_cours:   { label: 'En cours',   cls: 'bg-blue-100 text-blue-700' },
  traité:     { label: 'Traité',     cls: 'bg-green-100 text-green-700' },
  rejeté:     { label: 'Rejeté',     cls: 'bg-gray-100 text-gray-500' },
};

export default function Signalements() {
  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(null);

  const token = getUser()?.token;

  const fetchSignalements = async () => {
    setLoading(true);
    try {
      const url = filterStatus ? `${API}?statut=${filterStatus}` : API;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setSignalements(Array.isArray(json) ? json : (json.data || []));
    } catch (err) {
      console.error('[Signalements] fetch:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSignalements(); }, [filterStatus]);

  const updateStatus = async (id, statut) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/gamification/signalements/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ statut }),
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchSignalements();
      if (selected?.id_signalement === id) {
        setSelected(s => s ? { ...s, statut } : null);
      }
    } catch (err) {
      console.error('[Signalements] update:', err.message);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Signalements</h1>
          <p className="text-gray-500 text-sm">{signalements.length} signalement(s)</p>
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#00C896]"
        >
          <option value="">Tous les statuts</option>
          <option value="nouveau">Nouveau</option>
          <option value="en_cours">En cours</option>
          <option value="traité">Traité</option>
          <option value="rejeté">Rejeté</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : signalements.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Aucun signalement.</div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="text-left px-5 py-3">Citoyen</th>
                <th className="text-left px-5 py-3">Conteneur</th>
                <th className="text-left px-5 py-3">Description</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Statut</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {signalements.map(s => {
                const st = STATUS_LABELS[s.statut] || { label: s.statut, cls: 'bg-gray-100 text-gray-500' };
                const userName = s.user
                  ? `${s.user.prenom || ''} ${s.user.nom || ''}`.trim() || s.user.email
                  : '—';
                return (
                  <tr key={s.id_signalement} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-700">{userName}</td>
                    <td className="px-5 py-3 font-medium">{s.conteneur?.reference || '—'}</td>
                    <td className="px-5 py-3 text-gray-500 max-w-xs truncate">{s.description}</td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                      {s.date_signalement ? new Date(s.date_signalement).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setSelected(s)}
                        className="text-[#00C896] hover:underline text-xs font-medium"
                      >
                        Voir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal détail */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="font-bold text-lg">Signalement</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-5 space-y-4">
              {selected.photo_url && (
                <img src={selected.photo_url} alt="signalement" className="w-full h-48 object-cover rounded-xl" />
              )}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 block">Citoyen</span>
                  <span className="font-medium">
                    {selected.user ? `${selected.user.prenom || ''} ${selected.user.nom || ''}`.trim() || selected.user.email : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Conteneur</span>
                  <span className="font-medium">{selected.conteneur?.reference || '—'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Date</span>
                  <span className="font-medium">
                    {selected.date_signalement ? new Date(selected.date_signalement).toLocaleDateString('fr-FR') : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Statut actuel</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[selected.statut]?.cls}`}>
                    {STATUS_LABELS[selected.statut]?.label || selected.statut}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-gray-500 text-sm block mb-1">Description</span>
                <p className="text-gray-700 text-sm bg-gray-50 rounded-xl p-3">{selected.description}</p>
              </div>
              {selected.statut !== 'traité' && selected.statut !== 'rejeté' && (
                <div className="flex gap-3 pt-2">
                  {selected.statut === 'nouveau' && (
                    <button
                      onClick={() => updateStatus(selected.id_signalement, 'en_cours')}
                      disabled={updating === selected.id_signalement}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 text-sm font-medium disabled:opacity-60"
                    >
                      Prise en charge
                    </button>
                  )}
                  <button
                    onClick={() => updateStatus(selected.id_signalement, 'traité')}
                    disabled={updating === selected.id_signalement}
                    className="flex-1 bg-[#00C896] hover:bg-[#00b085] text-white rounded-xl py-2.5 text-sm font-medium disabled:opacity-60"
                  >
                    Marquer traité
                  </button>
                  <button
                    onClick={() => updateStatus(selected.id_signalement, 'rejeté')}
                    disabled={updating === selected.id_signalement}
                    className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50 disabled:opacity-60"
                  >
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
