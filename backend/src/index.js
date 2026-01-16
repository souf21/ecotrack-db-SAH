// Importer express
const express = require('express');

// Créer l'application
const app = express();

// Pour pouvoir lire le JSON dans les requêtes
app.use(express.json());

// Exemple de route test
app.get('/', (req, res) => {
  res.send('🚀 Backend EcoTrack fonctionne !');
});

// Définir le port
const PORT = process.env.PORT || 5000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Backend EcoTrack démarré sur le port ${PORT}`);
});
