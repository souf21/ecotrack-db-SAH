import { useState, useEffect } from 'react';
import { getUser } from '../../services/auth';

const API = '/api/gamification/signalements';

const STATUS_LABELS = {
  nouveau:  { label: 'Nouveau',  cls: 'bg-orange-100 text-orange-700' },
  en_cours: { label: 'En cours', cls: 'bg-blue-100 text-blue-700' },
  traité:   { label: 'Traité',   cls: 'bg-green-100 text-green-700' },
  rejeté:   { label: 'Rejeté',   cls: 'bg-gray-100 text-gray-500' },
};

export default function AgentSignalements({ user }) {
  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(null);

  const token = user?.token || getUser()?.token;

  const fetchSignalements = async () => {
    setLoading(true);
    try {
      const res = await fetch(API, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setSignalements(Array.isArray(json) ? json : (json.data || []));
    } catch (err) {
      console.error('[AgentSignalements] fetch:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSignalements(); }, []);

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
      if (selected?.id_signalement === id) setSelected(s => s ? { ...s, statut } : null);
    } catch (err) {
      console.error('[AgentSignalements] update:', err.message);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Signalements</h1>
        <p className="text-gray-500 text-sm">{signalements.length} signalement(s) à traiter</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : signalements.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Aucun signalement pour le moment.</div>
      ) : (
        <div className="space-y-3">
          {signalements.map(s => {
            const st = STATUS_LABELS[s.statut] || { label: s.statut, cls: 'bg-gray-100 text-gray-500' };
            const userName = s.user
              ? `${s.user.prenom || ''} ${s.user.nom || ''}`.trim() || s.user.email
              : '—';
            return (
              <div key={s.id_signalement} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
                {s.photo_url && (
                  <img src={s.photo_url} alt="photo" className="w-20 h-20 object-cover rounded-xl shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-800">{s.conteneur?.reference || '—'}</div>
                      {s.conteneur?.adresse && <div className="text-xs text-gray-400">{s.conteneur.adresse}</div>}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ml-2 ${st.cls}`}>{st.label}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{s.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400">
                      {userName} • {s.date_signalement ? new Date(s.date_signalement).toLocaleDateString('fr-FR') : '—'}
                    </span>
                    <button onClick={() => setSelected(s)} className="text-[#00C896] hover:underline text-xs font-medium">
                      Détails →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
              </div>
              <p className="text-sm bg-gray-50 rounded-xl p-3 text-gray-700">{selected.description}</p>
              {selected.statut !== 'traité' && selected.statut !== 'rejeté' && (
                <div className="flex gap-3">
                  {selected.statut === 'nouveau' && (
                    <button
                      onClick={() => updateStatus(selected.id_signalement, 'en_cours')}
                      disabled={updating === selected.id_signalement}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 text-sm font-medium disabled:opacity-60"
                    >
                      Prendre en charge
                    </button>
                  )}
                  <button
                    onClick={() => updateStatus(selected.id_signalement, 'traité')}
                    disabled={updating === selected.id_signalement}
                    className="flex-1 bg-[#00C896] hover:bg-[#00b085] text-white rounded-xl py-2.5 text-sm font-medium disabled:opacity-60"
                  >
                    Marquer traité
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
