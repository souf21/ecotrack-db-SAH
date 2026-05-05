import { supabase } from './supabase';

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw new Error('Email ou mot de passe incorrect');

  // Récupérer le rôle
  const { data: roleData, error: roleError } = await supabase
    .from('user_role')
    .select('role(nom)')
    .eq('id_user', data.user.id)
    .single();

  if (roleError) throw new Error('Impossible de recuperer le role');

  // Récupérer le profil
  const { data: profile } = await supabase
    .from('user')
    .select('nom, prenom, point_total')
    .eq('id_user', data.user.id)
    .single();

  const user = {
    id:        data.user.id,
    email:     data.user.email,
    role:      roleData.role.nom,
    nom:       profile ? `${profile.prenom} ${profile.nom}` : email,
    initiales: profile ? `${profile.prenom[0]}${profile.nom[0]}` : '??',
    points:    profile?.point_total || 0,
    token:     data.session.access_token
  };

  localStorage.setItem('user',  JSON.stringify(user));
  localStorage.setItem('token', user.token);
  return user;
}

export async function logout() {
  await supabase.auth.signOut();
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