<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250518230835 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // 1. Mettre à jour les valeurs de status vides ou invalides en 'published' (1)
        $this->addSql("UPDATE article SET status = 'published' WHERE status = '' OR status IS NULL");

        // 2. Changer temporairement les valeurs textuelles en valeurs numériques
        $this->addSql("UPDATE article SET status = '1' WHERE status = 'published'");
        $this->addSql("UPDATE article SET status = '0' WHERE status = 'draft'");

        // 3. Changer le type de colonne
        $this->addSql('ALTER TABLE article CHANGE status status SMALLINT NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article CHANGE status status VARCHAR(20) NOT NULL');
    }
}
