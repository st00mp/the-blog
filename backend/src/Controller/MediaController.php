<?php

namespace App\Controller;

use App\Entity\Media;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Uid\Uuid;

class MediaController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/upload', name: 'app_upload', methods: ['POST'])]
    public function upload(Request $request, SluggerInterface $slugger): Response
    {
        $file = $request->files->get('file');

        if (!$file) {
            return $this->json(['error' => 'No file provided'], 400);
        }

        // Validation du type de fichier
        $allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4',
            'video/webm',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        // Récupérer toutes les métadonnées d'abord pour éviter toute erreur
        $mimeType = $file->getMimeType();
        $fileSize = $file->getSize();
        $clientOriginalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension() ?: $file->guessExtension();

        if (!in_array($mimeType, $allowedMimeTypes)) {
            return $this->json(['error' => 'File type not allowed'], 400);
        }

        // Obtenir le chemin source du fichier uploadé
        $sourcePath = $file->getPathname();

        // Génération d'un nom de fichier unique
        $originalFilename = pathinfo($clientOriginalName, PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $extension;

        try {
            // Déterminer le type de média
            $mediaType = explode('/', $mimeType)[0]; // 'image', 'video' ou 'application'

            // Créer le répertoire cible si nécessaire
            $targetDirectory = $this->getParameter('kernel.project_dir') . '/public/uploads/' . $mediaType;
            if (!is_dir($targetDirectory)) {
                mkdir($targetDirectory, 0755, true);
            }

            // Chemin complet du fichier de destination
            $targetPath = $targetDirectory . '/' . $newFilename;

            // Vérifier si le fichier source existe
            if (!file_exists($sourcePath)) {
                return $this->json([
                    'error' => 'Source file does not exist: ' . $sourcePath,
                    'debug' => [
                        'sourcePath' => $sourcePath,
                        'targetPath' => $targetPath,
                        'fileExists' => file_exists($sourcePath),
                        'fileInfo' => $file->getPathInfo(),
                        'fileError' => $file->getError(),
                    ]
                ], 500);
            }

            // Copier manuellement le fichier
            if (!copy($sourcePath, $targetPath)) {
                // Si la copie échoue, essayer avec file_put_contents
                $content = file_get_contents($sourcePath);
                if ($content === false) {
                    return $this->json(['error' => 'Could not read source file'], 500);
                }

                if (file_put_contents($targetPath, $content) === false) {
                    return $this->json(['error' => 'Could not write to target file'], 500);
                }
            }

            // URL publique du fichier
            $publicUrl = '/uploads/' . $mediaType . '/' . $newFilename;

            // Création de l'entité Media
            $media = new Media();
            $media->setPath($publicUrl);
            $media->setOriginalFilename($clientOriginalName);
            $media->setMimeType($mimeType);
            $media->setFileSize($fileSize);

            // Gestion des dimensions pour les images
            if ($mediaType === 'image') {
                try {
                    $dimensions = getimagesize($targetPath);
                    if ($dimensions) {
                        $media->setDimensions([
                            'width' => $dimensions[0],
                            'height' => $dimensions[1]
                        ]);
                    }
                } catch (\Exception $e) {
                    // Ignorer les erreurs de dimensions
                }
            }

            // Persister l'entité
            $this->entityManager->persist($media);
            $this->entityManager->flush();

            // Retourner les informations du média
            return $this->json([
                'success' => true,
                'id' => $media->getId()->jsonSerialize(),
                'url' => $publicUrl,
                'fileName' => $newFilename,
                'originalFileName' => $clientOriginalName,
                'mimeType' => $mimeType,
                'fileSize' => $fileSize,
                'mediaType' => $mediaType
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/api/upload/status', name: 'app_upload_status', methods: ['GET'])]
    public function status(Request $request): Response
    {
        // Récupérer l'id du média depuis la requête
        $mediaId = $request->query->get('id');

        if (!$mediaId) {
            return $this->json(['error' => 'No media ID provided'], 400);
        }

        try {
            // Convertir l'ID en UUID
            $uuid = Uuid::fromString($mediaId);

            // Rechercher le média dans la base de données
            $media = $this->entityManager->getRepository(Media::class)->find($uuid);

            if (!$media) {
                return $this->json(['error' => 'Media not found'], 404);
            }

            // Retourner les informations du média
            return $this->json([
                'id' => $media->getId()->jsonSerialize(),
                'url' => $media->getPath(),
                'originalFileName' => $media->getOriginalFilename(),
                'mimeType' => $media->getMimeType(),
                'fileSize' => $media->getFileSize(),
                'mediaType' => $media->getMediaType(),
                'dimensions' => $media->getDimensions(),
                'thumbnailPath' => $media->getThumbnailPath(),
                'createdAt' => $media->getCreatedAt()->format('c')
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Invalid media ID format'], 400);
        }
    }

    #[Route('/api/media/{id}', name: 'app_media_delete', methods: ['DELETE'])]
    public function delete(string $id): Response
    {
        try {
            // Convertir l'ID en UUID
            $uuid = Uuid::fromString($id);

            // Rechercher le média dans la base de données
            $media = $this->entityManager->getRepository(Media::class)->find($uuid);

            if (!$media) {
                return $this->json(['error' => 'Media not found'], 404);
            }

            // Soft delete - mettre à jour le champ deletedAt
            $media->setDeletedAt(new \DateTimeImmutable());
            $this->entityManager->flush();

            return $this->json([
                'success' => true,
                'message' => 'Media marked as deleted',
                'id' => $media->getId()->jsonSerialize()
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }
}
