import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const BADGES = [
  {
    id: 'premier_pas',
    nom: 'Premier Pas',
    description: 'Envoyer votre premier signalement',
    icon: '🌱',
    condition: (stats) => stats.totalSignalements >= 1,
  },
  {
    id: 'vigilant',
    nom: 'Vigilant',
    description: 'Envoyer 3 signalements',
    icon: '👁',
    condition: (stats) => stats.totalSignalements >= 3,
  },
  {
    id: 'sentinelle',
    nom: 'Sentinelle',
    description: 'Envoyer 5 signalements',
    icon: '🛡️',
    condition: (stats) => stats.totalSignalements >= 5,
  },
  {
    id: 'gardien',
    nom: 'Gardien du Quartier',
    description: 'Envoyer 10 signalements',
    icon: '🏘️',
    condition: (stats) => stats.totalSignalements >= 10,
  },
  {
    id: 'eco_heros',
    nom: 'Eco-Heros',
    description: 'Atteindre 500 points',
    icon: '⚡',
    condition: (stats) => stats.points >= 500,
  },
  {
    id: 'champion',
    nom: 'Champion Vert',
    description: 'Atteindre 1000 points',
    icon: '🏆',
    condition: (stats) => stats.points >= 1000,
  },
];

const NIVEAUX = [
  { niveau: 1, nom: 'Debutant',    min: 0,   max: 100  },
  { niveau: 2, nom: 'Actif',       min: 100, max: 250  },
  { niveau: 3, nom: 'Engage',      min: 250, max: 500  },
  { niveau: 4, nom: 'Expert',      min: 500, max: 1000 },
  { niveau: 5, nom: 'Champion',    min: 1000, max: 9999 },
];

function getNiveau(points) {
  return NIVEAUX.find(n => points >= n.min && points < n.max) || NIVEAUX[0];
}

export default function MesRecompenses({ user }) {
  const [stats, setStats]             = useState({ points: 0, totalSignalements: 0 });
  const [historique, setHistorique]   = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);

    // Récupérer points depuis table user
    const { data: profile } = await supabase
      .from('user')
      .select('point_total')
      .eq('id_user', user.id)
      .single();

    // Récupérer signalements du citoyen
    const { data: signalements } = await supabase
      .from('signalement')
      .select('id_signalement, type, description, date_signalement')
      .eq('id_user', user.id)
      .order('date_signalement', { ascending: false });

    const points = profile?.point_total || 0;
    const total  = signalements?.length || 0;

    setStats({ points, totalSignalements: total });

    // Historique des points — chaque signalement = +10 pts
    setHistorique((signalements || []).map(s => ({
      id:          s.id_signalement,
      description: s.description || s.type,
      date:        s.date_signalement,
      points:      10,
    })));

    setLoading(false);
  }

  const niveau      = getNiveau(stats.points);
  const niveauSuiv  = NIVEAUX.find(n => n.niveau === niveau.niveau + 1);
  const progression = niveauSuiv
    ? Math.round(((stats.points - niveau.min) / (niveauSuiv.min - niveau.min)) * 100)
    : 100;

  const badgesObtenu = BADGES.filter(b => b.condition(stats));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-400">Chargement...</div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* Niveau + Points */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#00C896]/10 rounded-xl flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <div className="text-xs text-gray-400">Niveau {niveau.niveau}</div>
              <div className="text-xl font-bold text-gray-800">{niveau.nom}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#00C896]">{stats.points}</div>
            <div className="text-xs text-gray-400">points</div>
          </div>
        </div>

        {/* Barre de progression */}
        {niveauSuiv && (
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Progression vers Niv. {niveauSuiv.niveau}</span>
              <span>{stats.points} / {niveauSuiv.min}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className="bg-[#00C896] h-3 rounded-full transition-all duration-500"
                style={{ width: `${progression}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.totalSignalements}</div>
          <div className="text-xs text-gray-400 mt-1">Signalements</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{badgesObtenu.length}</div>
          <div className="text-xs text-gray-400 mt-1">Badges obtenus</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-[#00C896]">
            +{historique.length > 0 ? historique[0].points : 0}
          </div>
          <div className="text-xs text-gray-400 mt-1">Derniers pts</div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">🏆 Badges</h2>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map(badge => {
            const obtenu = badge.condition(stats);
            return (
              <div key={badge.id}
                className={`rounded-xl p-4 text-center border transition-all ${
                  obtenu
                    ? 'border-[#00C896]/30 bg-[#00C896]/5'
                    : 'border-gray-100 bg-gray-50 opacity-50'
                }`}>
                <div className="text-3xl mb-2">{obtenu ? badge.icon : '🔒'}</div>
                <div className={`text-xs font-semibold mb-1 ${obtenu ? 'text-gray-800' : 'text-gray-400'}`}>
                  {badge.nom}
                </div>
                <div className="text-xs text-gray-400">{badge.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historique des points */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">📋 Historique des points</h2>
        {historique.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            Aucun point gagné pour l'instant — faites votre premier signalement !
          </p>
        ) : (
          <div className="space-y-3">
            {historique.map(h => (
              <div key={h.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <div className="text-sm font-medium text-gray-700 line-clamp-1">
                    {h.description}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(h.date).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </div>
                </div>
                <div className="text-[#00C896] font-bold text-sm shrink-0 ml-3">
                  +{h.points} pts
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}