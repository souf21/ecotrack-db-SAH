const swaggerJsdoc = require('swagger-jsdoc');

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EcoTrack — service-iot API',
      version: '1.0.0',
      description: 'Ingestion et consultation des données capteurs IoT'
    },
    servers: [
      { url: 'http://localhost:5004', description: 'service-iot dev' },
      { url: 'http://localhost:80',   description: 'Via API Gateway' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        apiKeyAuth:  { type: 'apiKey', in: 'header', name: 'X-Api-Key' }
      }
    }
  },
  apis: ['./src/modules/**/*.routes.js']
});
