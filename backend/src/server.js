// Point d'entrée principal
// Ce fichier charge les variables d'environnement et démarre le serveur

require('dotenv').config(); // DOIT être en premier !
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 EcoTrack API démarrée sur le port ${PORT}`);
  console.log(`🌍 Environnement : ${process.env.NODE_ENV || 'development'}`);
});