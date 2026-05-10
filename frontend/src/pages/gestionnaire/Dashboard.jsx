import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: totalBins },
          { count: alertBins },
          { data: tournees },
          { count: signalements },
        ] = await Promise.all([
          supabase.from('conteneur').select('*', { count: 'exact', head: true }),
          supabase.from('conteneur').select('*', { count: 'exact', head: true }).eq('etat', 'alerte'),
          supabase.from('tournee').select('statut'),
          supabase.from('signalement').select('*', { count: 'exact', head: true }).eq('statut', 'nouveau'),
        ]);

        const enCours = (tournees || []).filter(t => t.statut === 'en_cours').length;
        const planifiees = (tournees || []).filter(t => t.statut === 'planifiée').length;
        const terminees = (tournees || []).filter(t => t.statut === 'terminée').length;

        setStats({
          totalBins: totalBins || 0,
          alertBins: alertBins || 0,
          signalements: signalements || 0,
          tourneesEnCours: enCours,
          tourneesPlanifiees: planifiees,
          tourneesTerminees: terminees,
        });
      } catch (err) {
        console.error('[Dashboard] fetch error:', err);
        setStats({ totalBins: 0, alertBins: 0, signalements: 0, tourneesEnCours: 0, tourneesPlanifiees: 0, tourneesTerminees: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">Chargement...</div>
  );

  const cards = [
    { label: 'Conteneurs total', value: stats.totalBins, icon: '🗑️', bg: 'bg-blue-50', text: 'text-blue-700' },
    { label: 'Alertes actives', value: stats.alertBins, icon: '🚨', bg: 'bg-red-50', text: 'text-red-700' },
    { label: 'Signalements en attente', value: stats.signalements, icon: '⚠️', bg: 'bg-orange-50', text: 'text-orange-700' },
    { label: 'Tournées en cours', value: stats.tourneesEnCours, icon: '🚛', bg: 'bg-green-50', text: 'text-green-700' },
    { label: 'Tournées planifiées', value: stats.tourneesPlanifiees, icon: '📅', bg: 'bg-teal-50', text: 'text-teal-700' },
    { label: 'Tournées terminées', value: stats.tourneesTerminees, icon: '✅', bg: 'bg-gray-50', text: 'text-gray-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de la gestion des déchets</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`${c.bg} border border-gray-100 rounded-2xl p-5`}>
            <div className="text-3xl mb-2">{c.icon}</div>
            <div className={`text-3xl font-bold ${c.text}`}>{c.value}</div>
            <div className="text-sm text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h2 className="font-semibold text-gray-700 mb-4">État des tournées</h2>
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.tourneesEnCours}</div>
            <div className="text-xs text-gray-500 mt-1">En cours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{stats.tourneesPlanifiees}</div>
            <div className="text-xs text-gray-500 mt-1">Planifiées</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">{stats.tourneesTerminees}</div>
            <div className="text-xs text-gray-500 mt-1">Terminées</div>
          </div>
        </div>
      </div>
    </div>
  );
}
