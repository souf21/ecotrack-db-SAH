class AppError extends Error {
  constructor(message, status) { super(message); this.status = status; this.name = this.constructor.name; }
}
class NotFoundError   extends AppError { constructor(m = 'Ressource introuvable') { super(m, 404); } }
class ValidationError extends AppError { constructor(m = 'Données invalides')     { super(m, 400); } }
class ForbiddenError  extends AppError { constructor(m = 'Accès refusé')          { super(m, 403); } }

module.exports = { AppError, NotFoundError, ValidationError, ForbiddenError };
