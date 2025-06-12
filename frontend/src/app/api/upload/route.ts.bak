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

        // Créer le répertoire s'il n'existe pas
        const uploadDir = path.join(process.cwd(), "public/uploads", mediaType);
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