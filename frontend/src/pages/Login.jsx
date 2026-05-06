import { useState } from 'react';
import { Recycle, Shield, Truck, Users } from 'lucide-react';
import { login } from '../services/auth';
import { supabase } from '../services/supabase';

const ROLES = [
  {
    role: 'gestionnaire',
    label: 'Gestionnaire',
    desc: 'Dashboard, conteneurs, tournees, analytics',
    icon: Shield,
  },
  {
    role: 'agent',
    label: 'Agent de collecte',
    desc: 'Tournees assignees, validation collectes',
    icon: Truck,
  },
  {
    role: 'citoyen',
    label: 'Citoyen',
    desc: 'Signalements, points de collecte',
    icon: Users,
  },
];

export default function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [mode, setMode]                 = useState('login'); // 'login' ou 'register'
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [nom, setNom]                   = useState('');
  const [prenom, setPrenom]             = useState('');
  const [telephone, setTelephone]       = useState('');
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [loading, setLoading]           = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // 1. Créer le compte dans Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw new Error(signUpError.message);

      const userId = data.user.id;

      // 2. Insérer le profil dans la table "user"
      const { error: profileError } = await supabase
        .from('user')
        .insert({
          id_user:   userId,
          email:     email,
          nom:       nom,
          prenom:    prenom,
          telephone: telephone,
        });
      if (profileError) throw new Error(profileError.message);

      // 3. Récupérer l'id du rôle citoyen
      const { data: roleData, error: roleError } = await supabase
        .from('role')
        .select('id_role')
        .eq('nom', 'citoyen')
        .single();
      if (roleError) throw new Error('Role citoyen introuvable');

      // 4. Lier le rôle au user
      const { error: userRoleError } = await supabase
        .from('user_role')
        .insert({
          id_user:          userId,
          id_role:          roleData.id_role,
          date_attribution: new Date().toISOString().split('T')[0],
        });
      if (userRoleError) throw new Error(userRoleError.message);

      setSuccess('Compte créé ! Vous pouvez maintenant vous connecter.');
      setMode('login');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-8">

        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00C896]">
            <Recycle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">EcoTrack</h1>
          <p className="mt-1 text-sm text-gray-500">
            Plateforme IoT de gestion des dechets urbains
          </p>
        </div>

        {/* Choix du profil */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Choisissez votre profil</p>
          <div className="grid gap-3">
            {ROLES.map(({ role, label, desc, icon: Icon }) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setSelectedRole(role);
                  setMode('login');
                  setError('');
                  setSuccess('');
                  setEmail('');
                  setPassword('');
                }}
                className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                  selectedRole === role
                    ? 'border-[#00C896] bg-[#00C896]/5 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-[#00C896]/40 hover:bg-gray-50'
                }`}
              >
                <div className={`rounded-lg p-2.5 ${
                  selectedRole === role
                    ? 'bg-[#00C896]/10 text-[#00C896]'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        {selectedRole && (
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">

            {/* Onglets login / register — seulement pour citoyen */}
            {selectedRole === 'citoyen' && (
              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === 'login'
                      ? 'bg-[#00C896] text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}>
                  Se connecter
                </button>
                <button
                  onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === 'register'
                      ? 'bg-[#00C896] text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}>
                  Creer un compte
                </button>
              </div>
            )}

            {/* Message succès */}
            {success && (
              <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm mb-4">
                {success}
              </div>
            )}

            {/* FORMULAIRE LOGIN */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.fr"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896] placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Mot de passe</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896] placeholder:text-gray-400"
                  />
                </div>
                {error && (
                  <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm">{error}</div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#00C896] py-2.5 text-sm font-semibold text-white hover:bg-[#00a87e] disabled:opacity-50">
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>
            )}

            {/* FORMULAIRE INSCRIPTION — seulement citoyen */}
            {mode === 'register' && selectedRole === 'citoyen' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Prenom</label>
                    <input
                      type="text"
                      value={prenom}
                      onChange={e => setPrenom(e.target.value)}
                      placeholder="Sophie"
                      required
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896] placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Nom</label>
                    <input
                      type="text"
                      value={nom}
                      onChange={e => setNom(e.target.value)}
                      placeholder="Martin"
                      required
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896] placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.fr"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896] placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Telephone</label>
                  <input
                    type="tel"
                    value={telephone}
                    onChange={e => setTelephone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896] placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Mot de passe</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00C896] focus:ring-1 focus:ring-[#00C896] placeholder:text-gray-400"
                  />
                </div>
                {error && (
                  <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm">{error}</div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#00C896] py-2.5 text-sm font-semibold text-white hover:bg-[#00a87e] disabled:opacity-50">
                  {loading ? 'Inscription...' : 'Creer mon compte'}
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}