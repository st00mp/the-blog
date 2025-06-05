<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\Media;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class MediaController extends AbstractController
{
    #[Route('/api/media/upload', name: 'app_media_upload', methods: ['POST'])]
    public function upload(Request $request, SluggerInterface $slugger, EntityManagerInterface $em): Response
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

        if (!in_array($file->getMimeType(), $allowedMimeTypes)) {
            return $this->json(['error' => 'File type not allowed'], 400);
        }

        // Génération d'un nom de fichier unique
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

        // Déplacement du fichier dans le répertoire public/uploads
        try {
            $mediaType = explode('/', $file->getMimeType())[0]; // 'image', 'video' ou 'application'
            $targetDirectory = $this->getParameter('kernel.project_dir') . '/public/uploads/' . $mediaType;

            if (!file_exists($targetDirectory)) {
                mkdir($targetDirectory, 0777, true);
            }

            $file->move($targetDirectory, $newFilename);

            // URL publique du fichier
            $publicUrl = '/uploads/' . $mediaType . '/' . $newFilename;

            $media = new Media();
            $media->setUrl($publicUrl)
                ->setType($mediaType)
                ->setUploadedAt(new \DateTimeImmutable());

            $articleId = $request->request->getInt('article_id');
            if ($articleId > 0) {
                $article = $em->getRepository(Article::class)->find($articleId);
                if (!$article) {
                    return $this->json(['error' => 'Invalid article_id'], 400);
                }
                $media->setArticle($article);
            }

            $em->persist($media);
            $em->flush();

            return $this->json([
                'success' => true,
                'url' => $publicUrl,
                'fileName' => $newFilename,
                'mimeType' => $file->getMimeType(),
                'id' => $media->getId(),
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }
}
