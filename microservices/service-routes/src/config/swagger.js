const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EcoTrack — service-routes API',
      version: '1.0.0',
      description: 'Gestion des tournées de collecte'
    },
    servers: [
      { url: 'http://localhost:5003', description: 'service-routes dev' },
      { url: 'http://localhost:80',   description: 'Via API Gateway' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    }
  },
  apis: ['./src/modules/**/*.routes.js']
};

module.exports = swaggerJsdoc(options);
