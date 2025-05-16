#!/bin/bash

# Arrêter le script en cas d'erreur
set -e

echo "🔍 Vérification des fichiers à nettoyer..."

# Déplacer les fichiers d'articles de admin vers editor
if [ -d "frontend/src/app/admin/articles" ]; then
  echo "🚚 Déplacement des fichiers d'articles..."
  mkdir -p frontend/src/app/editor/articles/edit
  
  # Copier les fichiers un par un
  if [ -f "frontend/src/app/admin/articles/page.tsx" ]; then
    mv frontend/src/app/admin/articles/page.tsx frontend/src/app/editor/articles/
  fi
  
  if [ -d "frontend/src/app/admin/articles/edit" ]; then
    mv frontend/src/app/admin/articles/edit/* frontend/src/app/editor/articles/edit/
    rmdir frontend/src/app/admin/articles/edit
  fi
  
  if [ -d "frontend/src/app/admin/articles/new" ]; then
    mv frontend/src/app/admin/articles/new frontend/src/app/editor/articles/
  fi
  
  # Supprimer le dossier articles vide
  rmdir frontend/src/app/admin/articles
  echo "✅ Fichiers d'articles déplacés avec succès"
fi

# Supprimer le dossier dashboard de admin s'il existe
if [ -d "frontend/src/app/admin/dashboard" ]; then
  echo "🗑️ Suppression de l'ancien dossier dashboard..."
  rm -rf frontend/src/app/admin/dashboard
  echo "✅ Ancien dossier dashboard supprimé"
fi

# Supprimer le dossier settings de admin s'il existe
if [ -d "frontend/src/app/admin/settings" ]; then
  echo "🗑️ Suppression de l'ancien dossier settings..."
  rm -rf frontend/src/app/admin/settings
  echo "✅ Ancien dossier settings supprimé"
fi

echo "✨ Nettoyage terminé avec succès !"
