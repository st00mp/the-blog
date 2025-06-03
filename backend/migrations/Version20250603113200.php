<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250603113200 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Supprime la table comment et les relations associées pour simplifier le blog';
    }

    public function up(Schema $schema): void
    {
        // Suppression de la table comment
        if ($schema->hasTable('comment')) {
            $schema->dropTable('comment');
        }
        
        // Suppression des clés étrangères dans la table article si elles existent
        if ($schema->hasTable('article')) {
            $table = $schema->getTable('article');
            // Vérifier si la clé étrangère existe avant de la supprimer
            if ($table->hasForeignKey('FK_23A0E66F8697D13')) {
                $table->removeForeignKey('FK_23A0E66F8697D13');
            }
        }
    }

    public function down(Schema $schema): void
    {
        // La migration inverse nécessiterait de recréer la table comment
        // et de rétablir les relations, ce qui n'est pas nécessaire dans ce cas
        $this->addSql('CREATE TABLE comment (id INT AUTO_INCREMENT NOT NULL, author_id INT NOT NULL, article_id INT NOT NULL, parent_id INT DEFAULT NULL, content LONGTEXT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_9474526CF675F31B (author_id), INDEX IDX_9474526C7294869C (article_id), INDEX IDX_9474526C727ACA70 (parent_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CF675F31B FOREIGN KEY (author_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526C7294869C FOREIGN KEY (article_id) REFERENCES article (id)');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526C727ACA70 FOREIGN KEY (parent_id) REFERENCES comment (id)');
    }
}
