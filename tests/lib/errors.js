// tests/lib/errors.js
// Classes d'erreurs HTTP pour le domaine conteneur

class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Ressource introuvable') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Données invalides') {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Non authentifié') {
    super(message, 401);
  }
}

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
