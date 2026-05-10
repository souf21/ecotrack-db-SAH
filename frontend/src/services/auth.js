import { supabase } from './supabase';

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw new Error(`Auth échouée: ${error.message}`);

  // Récupérer le rôle
  const { data: roleData, error: roleError } = await supabase
    .from('user_role')
    .select('role(nom)')
    .eq('id_user', data.user.id)
    .single();

  if (roleError) throw new Error(`Rôle introuvable (${roleError.code}: ${roleError.message})`);
  if (!roleData?.role?.nom) throw new Error(`Rôle non assigné — vérifiez la table user_role pour l'utilisateur ${data.user.id}`);

  // Récupérer le profil
  const { data: profile, error: profileError } = await supabase
    .from('user')
    .select('nom, prenom, point_total')
    .eq('id_user', data.user.id)
    .single();

  if (profileError) throw new Error(`Profil introuvable (${profileError.code}: ${profileError.message})`);

  const roleName = roleData.role.nom;
  if (!['gestionnaire', 'agent', 'citoyen'].includes(roleName)) {
    throw new Error(`Rôle inconnu: "${roleName}" — doit être gestionnaire, agent ou citoyen`);
  }

  const user = {
    id:        data.user.id,
    email:     data.user.email,
    role:      roleName,
    nom:       profile ? `${profile.prenom || ''} ${profile.nom || ''}`.trim() || email : email,
    initiales: ((profile?.prenom?.[0] || '') + (profile?.nom?.[0] || '')).toUpperCase() || '??',
    points:    profile?.point_total || 0,
    token:     data.session.access_token
  };

  localStorage.setItem('user',  JSON.stringify(user));
  localStorage.setItem('token', user.token);
  return user;
}

export async function logout() {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error('[logout] supabase signOut failed:', err.message);
  }
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  window.location.href = '/';
}

export function getUser() {
  return JSON.parse(localStorage.getItem('user'));
}

export function isLoggedIn() {
  return !!localStorage.getItem('user');
}