FROM php:8.2-fpm-alpine

# Mise à jour des paquets et installation des dépendances nécessaires
RUN apk add --no-cache bash curl unzip libpng-dev libjpeg-turbo-dev libwebp-dev oniguruma-dev

# Installation des extensions PHP nécessaires
RUN docker-php-ext-install pdo pdo_mysql mbstring gd

# Installer Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash && \
    mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

# Installer Composer (gestionnaire de dépendances PHP)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Définir les variables d'environnement
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV PATH="/usr/local/bin:$PATH"

# Définir le répertoire de travail
WORKDIR /var/www/symfony

# Copier les fichiers de l'application
COPY . .

# Copier le fichier php.ini dans l'image
COPY php.ini /usr/local/etc/php/conf.d/custom.ini

# Gestion des permissions pour le serveur web
RUN chown -R www-data:www-data /var/www/symfony
RUN mkdir -p var/cache var/log && chown -R www-data:www-data var

# Installer les dépendances Symfony
RUN composer install --no-interaction --optimize-autoloader

# Exposer le port PHP-FPM
EXPOSE 9000

# Commande de démarrage
CMD ["php-fpm"]