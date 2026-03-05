// Point d'entrée de l'application
// Ce fichier charge les variables d'environnement et démarre le serveur

require('dotenv').config(); // DOIT être en premier pour charger le .env
const app = require('./app'); // On importe l'app Express configurée

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 EcoTrack API démarrée sur le port ${PORT}`);
  console.log(`🌍 Environnement : ${process.env.NODE_ENV}`);
});