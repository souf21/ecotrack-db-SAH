// src/config/logger.js
// Configuration Winston — logger professionnel
const winston = require('winston');

const logger = winston.createLogger({
  // Niveau selon l'environnement : debug en dev, info en prod
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

  format: winston.format.combine(
    winston.format.timestamp(),         // ajoute la date/heure
    winston.format.errors({ stack: true }), // affiche la stack trace
    winston.format.json()               // format JSON structuré
  ),

  transports: [
    // Affiche dans la console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),      // couleurs en dev
        winston.format.simple()
      )
    }),
    // Sauvegarde les erreurs dans un fichier
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    // Sauvegarde tous les logs dans un fichier
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

module.exports = logger;