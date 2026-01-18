// backend/src/modules/users/auth.controller.js
const supabase = require('../../config/supabase');

// -------------------------
// -------------------------
// REGISTER - Inscription complète + rôle citizen par défaut
// -------------------------
exports.register = async (req, res) => {
  const { email, password, nom, prenom } = req.body;

  console.log(`[REGISTER] Tentative pour ${email}`);

  try {
    // 1. Création compte Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nom: nom || '',
          prenom: prenom || ''
        }
      }
    });

    if (authError) {
      console.error('[REGISTER] Erreur Auth:', authError.message);
      throw authError;
    }

    if (!authData?.user) throw new Error('Utilisateur non créé');

    console.log(`[REGISTER] Auth OK → ID: ${authData.user.id}`);

    // 2. Insertion dans public.user
    const { error: insertUserError } = await supabase
      .from('user')
      .insert({
        id_user: authData.user.id,
        email,
        nom: nom || null,
        prenom: prenom || null,
        point_total: 0,
        date_inscription: new Date().toISOString().split('T')[0]
      });

    if (insertUserError) {
      console.error('[REGISTER] Erreur public.user:', insertUserError.message);
      throw insertUserError;
    }

    console.log(`[REGISTER] Insertion public.user OK`);

    // 3. Assignation rôle 'citizen' par défaut
    const { data: citizenRole, error: roleError } = await supabase
      .from('role')
      .select('id_role')
      .eq('nom', 'citizen')
      .single();

    if (roleError || !citizenRole) {
      console.warn('[REGISTER] Rôle "citizen" introuvable ! Créez-le dans table role.');
    } else {
      const { error: userRoleError } = await supabase
        .from('user_role')
        .insert({
          id_user: authData.user.id,
          id_role: citizenRole.id_role
        });

      if (userRoleError) {
        console.error('[REGISTER] Erreur assignation citizen:', userRoleError.message);
      } else {
        console.log(`[REGISTER] Rôle 'citizen' assigné avec succès`);
      }
    }

    res.status(201).json({
      message: 'Inscription réussie',
      userId: authData.user.id,
      email: authData.user.email
    });
  } catch (err) {
    console.error('[REGISTER] Erreur globale:', err.message);
    res.status(400).json({ error: err.message });
  }
};

// -------------------------
// LOGIN
// -------------------------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log(`[LOGIN] Tentative pour ${email}`);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('[LOGIN] Erreur:', error.message);
      throw error;
    }

    console.log(`[LOGIN] Succès pour ${email} - User ID: ${data.user.id}`);

    res.json({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email
      }
    });
  } catch (err) {
    res.status(401).json({ error: 'Identifiants incorrects' });
  }
};

// -------------------------
// REFRESH TOKEN
// -------------------------
exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error) throw error;

    res.json({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token
    });
  } catch (err) {
    res.status(401).json({ error: 'Refresh échoué' });
  }
};