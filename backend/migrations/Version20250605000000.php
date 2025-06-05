<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250605000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Make media.article_id nullable';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE media CHANGE article_id article_id INT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE media CHANGE article_id article_id INT NOT NULL');
    }
}
