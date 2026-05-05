import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Plus, Eye, Pencil, Trash2, X } from 'lucide-react';
import { supabase } from '../../services/supabase';

export default function Conteneurs() {
  const [conteneurs, setConteneurs]   = useState([]);
  const [zones, setZones]             = useState([]);
  const [types, setTypes]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [filterZone, setFilterZone]   = useState('');
  const [filterType, setFilterType]   = useState('');
  const [filterEtat, setFilterEtat]   = useState('');
  const [page, setPage]               = useState(1);
  const [modal, setModal]             = useState(null); // 'create' | 'edit' | 'view'
  const [selected, setSelected]       = useState(null);
  const [form, setForm]               = useState({});
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState('');
  const perPage = 15;

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    const [c, z, t] = await Promise.all([
      supabase.from('conteneur').select('*, zone(nom_zone), type_dechets(libelle)'),
      supabase.from('zone').select('id_zone, nom_zone'),
      supabase.from('type_dechets').select('id_type_dechets, libelle'),
    ]);
    setConteneurs(c.data || []);
    setZones(z.data || []);
    setTypes(t.data || []);
    setLoading(false);
  }

  const filtered = useMemo(() => {
    return conteneurs.filter(c => {
      if (search && !c.reference?.toLowerCase().includes(search.toLowerCase())
        && !c.adresse?.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterZone && c.id_zone !== filterZone) return false;
      if (filterType && c.id_type_dechets !== filterType) return false;
      if (filterEtat && c.etat !== filterEtat) return false;
      return true;
    });
  }, [conteneurs, search, filterZone, filterType, filterEtat]);

  const paginated   = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages  = Math.ceil(filtered.length / perPage);

  function etatColor(etat) {
    if (etat === 'actif')       return 'bg-green-100 text-green-700';
    if (etat === 'maintenance') return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  }

  function openCreate() {
    setForm({ etat: 'actif' });
    setError('');
    setModal('create');
  }

  function openEdit(c) {
    setSelected(c);
    setForm({
      reference:       c.reference,
      adresse:         c.adresse,
      etat:            c.etat,
      latitude:        c.latitude,
      longitude:       c.longitude,
      capacite_totale: c.capacite_totale,
      id_zone:         c.id_zone,
      id_type_dechets: c.id_type_dechets,
    });
    setError('');
    setModal('edit');
  }

  function openView(c) {
    setSelected(c);
    setModal('view');
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      if (modal === 'create') {
        const { error } = await supabase.from('conteneur').insert(form);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('conteneur')
          .update(form)
          .eq('id_conteneur', selected.id_conteneur);
        if (error) throw error;
      }
      await fetchAll();
      setModal(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce conteneur ?')) return;
    await supabase.from('conteneur').delete().eq('id_conteneur', id);
    await fetchAll();
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-400">Chargement...</div>
    </div>
  );

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">

          {/* Recherche */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              placeholder="Rechercher un conteneur..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-48 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Filtres */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select value={filterZone} onChange={e => { setFilterZone(e.target.value); setPage(1); }}
              className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs outline-none">
              <option value="">Toutes les zones</option>
              {zones.map(z => <option key={z.id_zone} value={z.id_zone}>{z.nom_zone}</option>)}
            </select>
            <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}
              className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs outline-none">
              <option value="">Tous les types</option>
              {types.map(t => <option key={t.id_type_dechets} value={t.id_type_dechets}>{t.libelle}</option>)}
            </select>
            <select value={filterEtat} onChange={e => { setFilterEtat(e.target.value); setPage(1); }}
              className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs outline-none">
              <option value="">Tous les états</option>
              <option value="actif">Actif</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
        </div>

        <button onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-[#00C896] px-4 py-2 text-sm font-medium text-white hover:bg-[#00a87e]">
          <Plus className="h-4 w-4" /> Nouveau conteneur
        </button>
      </div>

      <p className="text-sm text-gray-400">{filtered.length} conteneurs trouvés</p>

      {/* Tableau */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Reference</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Zone</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Capacite</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Etat</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(c => (
              <tr key={c.id_conteneur} className="border-b border-gray-50 hover:bg-gray-50 last:border-0">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-800">{c.reference}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{c.type_dechets?.libelle || '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{c.zone?.nom_zone || '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-700">{c.capacite_totale}L</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${etatColor(c.etat)}`}>
                    {c.etat || '—'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openView(c)}
                      className="rounded p-1.5 hover:bg-gray-100">
                      <Eye className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                    <button onClick={() => openEdit(c)}
                      className="rounded p-1.5 hover:bg-gray-100">
                      <Pencil className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                    <button onClick={() => handleDelete(c.id_conteneur)}
                      className="rounded p-1.5 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`h-8 w-8 rounded-md text-xs font-medium transition-colors ${
                page === i + 1
                  ? 'bg-[#00C896] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal Voir */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Détail conteneur</h2>
              <button onClick={() => setModal(null)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ['Reference',  selected.reference],
                ['Adresse',    selected.adresse],
                ['Etat',       selected.etat],
                ['Capacite',   selected.capacite_totale + 'L'],
                ['Latitude',   selected.latitude],
                ['Longitude',  selected.longitude],
                ['Zone',       selected.zone?.nom_zone],
                ['Type',       selected.type_dechets?.libelle],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-medium text-gray-700">{val || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Créer / Modifier */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">
                {modal === 'create' ? 'Nouveau conteneur' : 'Modifier conteneur'}
              </h2>
              <button onClick={() => setModal(null)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Reference',  key: 'reference',       type: 'text' },
                { label: 'Adresse',    key: 'adresse',         type: 'text' },
                { label: 'Latitude',   key: 'latitude',        type: 'number' },
                { label: 'Longitude',  key: 'longitude',       type: 'number' },
                { label: 'Capacite (L)', key: 'capacite_totale', type: 'number' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
                  <input type={type} value={form[key] || ''}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#00C896]"
                  />
                </div>
              ))}

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Etat</label>
                <select value={form.etat || ''} onChange={e => setForm(f => ({ ...f, etat: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#00C896]">
                  <option value="actif">Actif</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Zone</label>
                <select value={form.id_zone || ''} onChange={e => setForm(f => ({ ...f, id_zone: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#00C896]">
                  <option value="">Choisir une zone</option>
                  {zones.map(z => <option key={z.id_zone} value={z.id_zone}>{z.nom_zone}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Type de dechets</label>
                <select value={form.id_type_dechets || ''} onChange={e => setForm(f => ({ ...f, id_type_dechets: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#00C896]">
                  <option value="">Choisir un type</option>
                  {types.map(t => <option key={t.id_type_dechets} value={t.id_type_dechets}>{t.libelle}</option>)}
                </select>
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)}
                className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 rounded-lg bg-[#00C896] py-2.5 text-sm font-semibold text-white hover:bg-[#00a87e] disabled:opacity-50">
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
} 
