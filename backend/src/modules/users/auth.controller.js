// backend/src/modules/users/auth.controller.js

const supabase = require('../../config/supabase');

exports.register = async (req, res) => {
  const { email, password, nom, prenom } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // Optionnel : insère dans table user
    await supabase.from('user').insert({
      id_user: data.user.id,
      email,
      nom,
      prenom
    });

    res.status(201).json({ message: 'Inscription réussie', user: data.user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    res.json({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: data.user
    });
  } catch (err) {
    res.status(401).json({ error: 'Connexion échouée' });
  }
};

exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error) throw error;

    res.json({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token
    });
  } catch (err) {
    res.status(401).json({ error: 'Refresh échoué' });
  }
};