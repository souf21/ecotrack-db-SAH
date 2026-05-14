FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY src/ ./src/
EXPOSE 5006
CMD ["node", "src/index.js"]
