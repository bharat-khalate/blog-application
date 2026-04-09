import { Sidebar } from "@/components/layout/Sidebar";
import { env } from "@/configs/env";
import { logger } from "@/lib/logger";
import { writeFile, mkdir } from "fs/promises";
import path, { dirname } from "path";
import { v4 as uuidV4 } from "uuid";

const saveFile = async (file: File | null, dirName: string = env.UPLOAD_DIR): Promise<string> => {
    try {
        if (!file) throw new Error("Please select a file");

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const extension = file.name.split(".").pop();
        const uniqueName = `${uuidV4()}.${extension}`;

        const uploadDir = path.join(process.cwd(), dirName);

        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, uniqueName);

        await writeFile(filePath, buffer);

        // remove "public" from URL if present
        const publicPath = dirName.replaceAll("public/", "");

        return `${env.APP_URL}/${publicPath}/${uniqueName}`;

    } catch (error: any) {
        logger.error("Failed to save file", error);
        throw error;
    }
};

export default saveFile;