<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250408160824 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article ADD conclusion_title VARCHAR(255) DEFAULT NULL, ADD conclusion_description JSON DEFAULT NULL, ADD cta_description LONGTEXT DEFAULT NULL, ADD cta_button VARCHAR(255) DEFAULT NULL, DROP conclusion, DROP cta');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article ADD cta LONGTEXT DEFAULT NULL, DROP conclusion_title, DROP conclusion_description, DROP cta_button, CHANGE cta_description conclusion LONGTEXT DEFAULT NULL');
    }
}
