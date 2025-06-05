#!/bin/sh
# Script d'initialisation des dossiers d'upload
# Sera exécuté au démarrage du conteneur

# Créer la structure de dossiers nécessaire
mkdir -p /app/public/uploads/images
mkdir -p /app/public/uploads/videos
mkdir -p /app/public/uploads/documents

# S'assurer que les permissions sont correctes
chmod -R 755 /app/public/uploads

echo "✅ Structure des dossiers d'upload initialisée"
