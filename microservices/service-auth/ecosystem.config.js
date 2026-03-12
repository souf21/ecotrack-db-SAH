// backend/ecosystem.config.js
// Configuration PM2 — gestionnaire de processus Node.js
// Lance plusieurs instances de l'app pour utiliser tous les cœurs CPU

module.exports = {
  apps: [
    {
      name: 'ecotrack-api',        // nom de l'app dans PM2
      script: 'src/server.js',     // fichier de démarrage
      instances: 'max',            // autant d'instances que de cœurs CPU
      exec_mode: 'cluster',        // mode cluster = partage du port entre instances
      watch: false,                // pas de watch en production
      max_memory_restart: '500M',  // redémarre si l'app dépasse 500MB RAM

      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },

      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};