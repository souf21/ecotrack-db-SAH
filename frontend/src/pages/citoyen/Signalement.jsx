import { useState, useEffect } from 'react';
import { Send, Camera, MapPin, X } from 'lucide-react';
import { supabase } from '../../services/supabase';

export default function Signalement({ user }) {
  const [conteneurs, setConteneurs] = useState([]);
  const [form, setForm]             = useState({
    id_conteneur: '',
    type:         '',
    description:  '',
  });
  const [photo, setPhoto]       = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    fetchConteneurs();
  }, []);

  async function fetchConteneurs() {
    const { data } = await supabase
      .from('conteneur')
      .select('id_conteneur, reference, adresse, zone(nom_zone)')
      .order('reference');
    setConteneurs(data || []);
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    setPhoto(null);
    setPhotoPreview(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let photo_url = null;

      // Upload photo si présente
      if (photo) {
        const fileName = `${user.id}_${Date.now()}_${photo.name}`;
        const { error: uploadError } = await supabase.storage
          .from('signalements')
          .upload(fileName, photo);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from('signalements')
          .getPublicUrl(fileName);
        photo_url = urlData.publicUrl;
      }

      // Insérer le signalement
      const { error: insertError } = await supabase
        .from('signalement')
        .insert({
          id_user:        user.id,
          id_conteneur:   form.id_conteneur || null,
          type:           form.type,
          description:    form.description,
          photo_url:      photo_url,
          statut:         'nouveau',
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setForm({ id_conteneur: '', type: '', description: '' });
      setPhoto(null);
      setPhotoPreview(null);

      // Reset success après 4 secondes
      setTimeout(() => setSuccess(false), 4000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Message succès */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-green-700 font-medium">Signalement envoyé avec succès !</p>
            <p className="text-green-600 text-sm">Merci pour votre contribution à la propreté de la ville.</p>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">

        {/* Type d'incident */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Type d'incident <span className="text-red-400">*</span>
          </label>
          <select
            required
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896]">
            <option value="">Choisir un type</option>
            <option value="plein">Conteneur plein / debordant</option>
            <option value="degrade">Conteneur degrade / casse</option>
            <option value="renverse">Conteneur renverse</option>
            <option value="odeur">Mauvaise odeur</option>
            <option value="depots_sauvages">Depots sauvages autour</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        {/* Conteneur concerné */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Conteneur concerné <span className="text-gray-400 text-xs">(optionnel)</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              value={form.id_conteneur}
              onChange={e => setForm(f => ({ ...f, id_conteneur: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896]">
              <option value="">Selectionner un conteneur</option>
              {conteneurs.map(c => (
                <option key={c.id_conteneur} value={c.id_conteneur}>
                  {c.reference} — {c.adresse || c.zone?.nom_zone || ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Decrivez le problème en détail..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896] resize-none"
          />
        </div>

        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Photo <span className="text-gray-400 text-xs">(optionnel)</span>
          </label>

          {photoPreview ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
              <img src={photoPreview} alt="preview"
                className="w-full h-full object-cover" />
              <button type="button" onClick={removePhoto}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50">
                <X className="h-4 w-4 text-red-400" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#00C896] hover:bg-green-50 transition-all">
              <Camera className="h-8 w-8 text-gray-300 mb-2" />
              <span className="text-sm text-gray-400">Cliquer pour ajouter une photo</span>
              <span className="text-xs text-gray-300 mt-1">JPG, PNG — max 5MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#00C896] py-3 text-sm font-semibold text-white hover:bg-[#00a87e] disabled:opacity-50 flex items-center justify-center gap-2">
          <Send className="h-4 w-4" />
          {loading ? 'Envoi en cours...' : 'Envoyer le signalement'}
        </button>

      </form>

    </div>
  );
}