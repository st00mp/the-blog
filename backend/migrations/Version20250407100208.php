<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250407100208 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article ADD category VARCHAR(100) NOT NULL, ADD meta_title VARCHAR(255) DEFAULT NULL, ADD meta_description LONGTEXT DEFAULT NULL, ADD intro LONGTEXT DEFAULT NULL, ADD steps JSON NOT NULL, ADD quote LONGTEXT DEFAULT NULL, ADD conclusion LONGTEXT DEFAULT NULL, ADD cta LONGTEXT DEFAULT NULL, DROP excerpt, DROP content');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article ADD excerpt LONGTEXT NOT NULL, ADD content LONGTEXT NOT NULL, DROP category, DROP meta_title, DROP meta_description, DROP intro, DROP steps, DROP quote, DROP conclusion, DROP cta');
    }
}
