<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250605195342 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE media DROP filename, DROP mime_type, DROP thumbnails, DROP alt_text, DROP title');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE media ADD filename VARCHAR(255) DEFAULT NULL, ADD mime_type VARCHAR(100) DEFAULT NULL, ADD thumbnails JSON DEFAULT NULL, ADD alt_text VARCHAR(255) DEFAULT NULL, ADD title VARCHAR(255) DEFAULT NULL');
    }
}
