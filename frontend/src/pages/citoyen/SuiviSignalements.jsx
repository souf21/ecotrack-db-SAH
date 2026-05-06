import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { supabase } from '../../services/supabase';

export default function SuiviSignalements({ user }) {
  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filtre, setFiltre]             = useState('');

  useEffect(() => {
    fetchSignalements();
  }, []);

  async function fetchSignalements() {
    setLoading(true);
    const { data, error } = await supabase
      .from('signalement')
      .select(`
        id_signalement,
        type,
        description,
        statut,
        photo_url,
        date_signalement,
        conteneur(reference, adresse)
      `)
      .eq('id_user', user.id)
      .order('date_signalement', { ascending: false });

    if (error) console.error(error);
    else setSignalements(data || []);
    setLoading(false);
  }

  function statutConfig(statut) {
    switch (statut) {
      case 'resolu':
        return { label: 'Resolu',      color: 'bg-green-100 text-green-700',  icon: <CheckCircle className="h-4 w-4" /> };
      case 'en_cours':
        return { label: 'En cours',    color: 'bg-blue-100 text-blue-700',    icon: <Clock className="h-4 w-4" /> };
      case 'nouveau':
        return { label: 'En attente',  color: 'bg-orange-100 text-orange-700', icon: <AlertCircle className="h-4 w-4" /> };
      default:
        return { label: statut,        color: 'bg-gray-100 text-gray-600',    icon: <XCircle className="h-4 w-4" /> };
    }
  }

  function typeLabel(type) {
    const labels = {
      plein:           'Conteneur plein / debordant',
      degrade:         'Conteneur degrade / casse',
      renverse:        'Conteneur renverse',
      odeur:           'Mauvaise odeur',
      depots_sauvages: 'Depots sauvages',
      autre:           'Autre',
    };
    return labels[type] || type;
  }

  const filtered = filtre
    ? signalements.filter(s => s.statut === filtre)
    : signalements;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-400">Chargement...</div>
    </div>
  );

  return (
    <div className="space-y-5 max-w-2xl mx-auto">

      {/* Filtres statut */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: '',         label: 'Tous' },
          { value: 'nouveau',  label: 'En attente' },
          { value: 'en_cours', label: 'En cours' },
          { value: 'resolu',   label: 'Resolus' },
        ].map(f => (
          <button key={f.value} onClick={() => setFiltre(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filtre === f.value
                ? 'bg-[#00C896] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-400 self-center">
          {filtered.length} signalement(s)
        </span>
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-400 text-sm">Aucun signalement trouvé</p>
          <p className="text-gray-300 text-xs mt-1">
            Vos signalements apparaitront ici
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => {
            const config = statutConfig(s.statut);
            return (
              <div key={s.id_signalement}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#00C896]/30 transition-all">

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-sm">
                      {typeLabel(s.type)}
                    </div>
                    {s.conteneur && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        📍 {s.conteneur.reference} — {s.conteneur.adresse || ''}
                      </div>
                    )}
                  </div>
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shrink-0 ${config.color}`}>
                    {config.icon}
                    {config.label}
                  </span>
                </div>

                {s.description && (
                  <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                    {s.description}
                  </p>
                )}

                {s.photo_url && (
                  <div className="mt-3">
                    <img src={s.photo_url} alt="photo signalement"
                      className="w-full h-32 object-cover rounded-xl border border-gray-100" />
                  </div>
                )}

                <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(s.date_signalement).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}