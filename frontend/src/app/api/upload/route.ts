import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { mkdir } from "fs/promises";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "Aucun fichier trouvé" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Déterminer le type de média
        let mediaType = "other";
        if (file.type.startsWith("image/")) mediaType = "images";
        else if (file.type.startsWith("video/")) mediaType = "videos";
        else if (file.type.startsWith("application/")) mediaType = "documents";

        // Validation des types de fichiers
        const allowedTypes = {
            "images": ["image/jpeg", "image/png", "image/webp", "image/gif"],
            "videos": ["video/mp4", "video/webm", "video/ogg"],
            "documents": ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        };

        // Vérifier que le type est autorisé
        if (mediaType !== "other" && 
            !allowedTypes[mediaType as keyof typeof allowedTypes].includes(file.type)) {
            return NextResponse.json(
                { error: `Type de fichier non autorisé: ${file.type}` },
                { status: 400 }
            );
        }

        // Vérifier la taille du fichier (8MB max)
        const MAX_SIZE = 8 * 1024 * 1024; // 8MB
        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: "Fichier trop volumineux (maximum 8MB)" },
                { status: 400 }
            );
        }

        // Créer le répertoire s'il n'existe pas 
        // Utilisez un chemin absolu configuré pour votre environnement
        const uploadBaseDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public/uploads");
        const uploadDir = path.join(uploadBaseDir, mediaType);
        await mkdir(uploadDir, { recursive: true });

        // Générer un nom de fichier unique
        const uniqueId = uuidv4();
        const fileExtension = file.name.split(".").pop();
        const fileName = `${uniqueId}.${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);

        // Écrire le fichier
        await writeFile(filePath, buffer);

        // Retourner l'URL du fichier (relative à la racine du site)
        const fileUrl = `/uploads/${mediaType}/${fileName}`;
        
        // Enregistrer les métadonnées du fichier pour audit
        console.info(`Fichier téléversé: ${fileName}, type: ${file.type}, taille: ${file.size}`);

        return NextResponse.json({
            success: true,
            url: fileUrl,
            mimeType: file.type
        });
    } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        return NextResponse.json(
            { error: "Erreur lors de l'upload du fichier" },
            { status: 500 }
        );
    }
}