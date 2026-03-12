// src/middlewares/validate.middleware.js
// Middleware de validation générique
// Utilisation : router.post('/', validate(schema), controller.create)

const validate = (schema) => {
  return (req, res, next) => {
    // Valide req.body avec le schéma Joi fourni
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // retourne TOUTES les erreurs, pas juste la première
      stripUnknown: true // supprime les champs non définis dans le schéma
    });

    if (error) {
      // Formate les erreurs en tableau lisible
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        error: 'Données invalides',
        details: errors
      });
    }

    // Remplace req.body par les données validées et nettoyées
    req.body = value;
    next();
  };
};

module.exports = validate;