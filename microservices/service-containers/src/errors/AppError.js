// src/errors/AppError.js
// Classes d'erreurs personnalisées pour toute l'application
// Au lieu de throw new Error('...'), on throw new NotFoundError('...')
// Ça permet au middleware global de savoir quel code HTTP retourner

class AppError extends Error {
  constructor(message, status) {
    super(message);        // appelle le constructeur de Error
    this.status = status;  // code HTTP : 400, 401, 403, 404, 500...
    this.name = this.constructor.name; // nom de la classe ex: 'NotFoundError'
  }
}

// 404 - Ressource introuvable
class NotFoundError extends AppError {
  constructor(message = 'Ressource introuvable') {
    super(message, 404);
  }
}

// 400 - Données invalides
class ValidationError extends AppError {
  constructor(message = 'Données invalides') {
    super(message, 400);
  }
}

// 401 - Non authentifié
class UnauthorizedError extends AppError {
  constructor(message = 'Non authentifié') {
    super(message, 401);
  }
}

// 403 - Authentifié mais pas le droit
class ForbiddenError extends AppError {
  constructor(message = 'Accès refusé') {
    super(message, 403);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError
};