// src/config/swagger.js
// Configuration Swagger — documentation auto-générée de l'API

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EcoTrack API',
      version: '1.0.0',
      description: 'API de gestion des conteneurs de déchets connectés',
      contact: {
        name: 'Hamza — Ali — Soufiane — Fatima Zahra',
        email: 'ecotrack@ingetis.fr'
      }
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Serveur développement' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  // Cherche les commentaires JSDoc dans ces fichiers
  apis: ['./src/modules/**/*.routes.js']
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;