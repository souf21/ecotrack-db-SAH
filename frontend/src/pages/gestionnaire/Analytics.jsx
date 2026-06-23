import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { getUser } from '../../services/auth';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const token = getUser()?.token;
      const authHeader = { Authorization: `Bearer ${token}` };

      try {
        // Use JWT-authenticated API for RLS-protected tables
        const [binsRes, routesRes, { data: signalements }, { data: mesures }] = await Promise.all([
          fetch('/api/bins', { headers: authHeader }).then(r => r.json()),
          fetch('/api/routes', { headers: authHeader }).then(r => r.json()),
          supabase.from('signalement').select('statut, date_signalement'),
          supabase.from('mesure').select('valeur, unite, datetime').eq('unite', '%').order('datetime', { ascending: false }).limit(200),
        ]);

        const conteneurs = Array.isArray(binsRes) ? binsRes : (binsRes.data || []);
        const tournees   = Array.isArray(routesRes) ? routesRes : (routesRes.data || []);

        const binsByEtat = groupBy(conteneurs || [], 'etat');
        const tourneesParStatut = groupBy(tournees || [], 'statut');

        const avgFill = mesures?.length
          ? Math.round(mesures.reduce((s, m) => s + Number(m.valeur), 0) / mesures.length)
          : null;

        const alertCount = (conteneurs || []).filter(c => c.etat === 'alerte').length;

        const sigParStatut = groupBy(signalements || [], 'statut');
        const sigThisMonth = (signalements || []).filter(s => {
          const d = new Date(s.date_signalement);
          const now = new Date();
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;

        setData({ binsByEtat, tourneesParStatut, avgFill, alertCount, sigParStatut, sigThisMonth, totalBins: conteneurs?.length || 0, totalTournees: tournees?.length || 0, totalSignalements: signalements?.length || 0 });
      } catch (err) {
        console.error('[Analytics] fetch:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-400">Chargement...</div>;
  if (!data) return <div className="text-center py-12 text-red-400">Erreur de chargement des données.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Statistiques opérationnelles</p>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon="🗑️" value={data.totalBins} label="Conteneurs" sub={`${data.alertCount} en alerte`} subColor="text-red-500" />
        <KPICard icon="🚨" value={data.alertCount} label="Alertes" sub={`${data.totalBins ? Math.round(data.alertCount / data.totalBins * 100) : 0}% du parc`} subColor="text-orange-500" />
        <KPICard icon="🚛" value={data.totalTournees} label="Tournées" sub={`${data.tourneesParStatut['en_cours'] || 0} en cours`} subColor="text-green-600" />
        <KPICard icon="⚠️" value={data.totalSignalements} label="Signalements" sub={`${data.sigThisMonth} ce mois`} subColor="text-blue-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Conteneurs par état */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Conteneurs par état</h2>
          <StatBar items={[
            { label: 'Normal', value: data.binsByEtat['normal'] || 0, color: 'bg-green-500', total: data.totalBins },
            { label: 'Alerte', value: data.binsByEtat['alerte'] || 0, color: 'bg-red-500', total: data.totalBins },
            { label: 'Maintenance', value: data.binsByEtat['maintenance'] || 0, color: 'bg-orange-400', total: data.totalBins },
            { label: 'Inactif', value: data.binsByEtat['inactif'] || 0, color: 'bg-gray-300', total: data.totalBins },
          ]} />
        </div>

        {/* Tournées par statut */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Tournées par statut</h2>
          <StatBar items={[
            { label: 'Planifiée', value: data.tourneesParStatut['planifiée'] || 0, color: 'bg-blue-400', total: data.totalTournees },
            { label: 'En cours', value: data.tourneesParStatut['en_cours'] || 0, color: 'bg-green-500', total: data.totalTournees },
            { label: 'Terminée', value: data.tourneesParStatut['terminée'] || 0, color: 'bg-gray-300', total: data.totalTournees },
          ]} />
        </div>

        {/* Signalements par statut */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Signalements par statut</h2>
          <StatBar items={[
            { label: 'Nouveau', value: data.sigParStatut['nouveau'] || 0, color: 'bg-orange-400', total: data.totalSignalements },
            { label: 'En cours', value: data.sigParStatut['en_cours'] || 0, color: 'bg-blue-400', total: data.totalSignalements },
            { label: 'Traité', value: data.sigParStatut['traité'] || 0, color: 'bg-green-500', total: data.totalSignalements },
            { label: 'Rejeté', value: data.sigParStatut['rejeté'] || 0, color: 'bg-gray-300', total: data.totalSignalements },
          ]} />
        </div>

        {/* Taux de remplissage moyen */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Taux de remplissage moyen</h2>
          {data.avgFill !== null ? (
            <div>
              <div className="text-5xl font-bold text-center mt-4 mb-2"
                style={{ color: data.avgFill > 75 ? '#ef4444' : data.avgFill > 50 ? '#f97316' : '#00C896' }}>
                {data.avgFill}%
              </div>
              <p className="text-center text-sm text-gray-500">Basé sur les 200 dernières mesures IoT</p>
              <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${data.avgFill}%`,
                    background: data.avgFill > 75 ? '#ef4444' : data.avgFill > 50 ? '#f97316' : '#00C896'
                  }}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">Pas de données IoT disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon, value, label, sub, subColor }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500 mt-0.5">{label}</div>
      {sub && <div className={`text-xs mt-1 font-medium ${subColor}`}>{sub}</div>}
    </div>
  );
}

function StatBar({ items }) {
  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-semibold text-gray-800">{item.value}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${item.color}`}
              style={{ width: item.total ? `${Math.round(item.value / item.total * 100)}%` : '0%' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const val = item[key] ?? 'unknown';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}
