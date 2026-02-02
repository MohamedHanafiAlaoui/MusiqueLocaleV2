# Étape 1: Build avec Node.js
FROM node:18-alpine AS build

WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Builder l'application Angular pour la production
RUN npm run build

# Étape 2: Runtime avec Nginx
FROM nginx:alpine

# Copier le fichier de configuration Nginx personnalisé
COPY nginx.conf /etc/nginx/nginx.conf

# Copier le build de l'application depuis l'étape de build
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Créer le répertoire pour les logs
RUN mkdir -p /var/log/nginx

# Permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/log/nginx

# Exposer le port
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
