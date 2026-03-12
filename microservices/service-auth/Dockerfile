# Dockerfile
# Image de base Node.js légère
FROM node:18-alpine

# Dossier de travail dans le container
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install --production

# Copie tout le code source
COPY src/ ./src/
COPY ecosystem.config.js .

# Expose le port
EXPOSE 5000

# Démarre l'application
CMD ["node", "src/server.js"]