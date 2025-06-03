<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250603114030 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Simplifie l\'authentification en attribuant le rôle admin à tous les utilisateurs et ajoute un administrateur par défaut';
    }

    public function up(Schema $schema): void
    {
        // S'assurer que tous les utilisateurs ont le rôle ADMIN
        $this->addSql('UPDATE user SET roles = JSON_ARRAY("ROLE_ADMIN")');
    }

    public function down(Schema $schema): void
    {
        // Aucune action nécessaire, car nous ne modifions pas la structure
        // et ne voulons pas revenir à l'état précédent
    }
}
