# Utiliser une image Node.js optimisée
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json avant d'installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Créer la structure des dossiers uploads pour les médias
RUN mkdir -p /app/public/uploads/images \
    && mkdir -p /app/public/uploads/videos \
    && mkdir -p /app/public/uploads/documents \
    && chmod -R 755 /app/public/uploads

# Copier le reste des fichiers (sans écraser node_modules)
COPY . .

# Exposer le port utilisé par Next.js
EXPOSE 3000

# Démarrer l’application Next.js
CMD ["npm", "run", "dev"]
