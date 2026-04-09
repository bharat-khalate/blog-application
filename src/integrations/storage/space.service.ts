import { PutObjectCommand } from "@aws-sdk/client-s3";
import { spaceClient } from "./space.client";
import { env } from "@/configs";
import { v4 as uuidV4 } from "uuid";
import { logger } from "@/lib";

/**
 * Uploads a file to DigitalOcean Spaces (S3-compatible object storage).
 *
 * This function:
 * 1. Converts the incoming File object into a buffer.
 * 2. Generates a unique file name to prevent collisions.
 * 3. Uploads the file to the configured DigitalOcean Space.
 *
 * @param file - File object received from form-data request
 * @param dirName - Target directory inside the bucket (default: env.UPLOAD_DIR)
 *
 * @returns The generated object key used to access the file in the bucket
 *
 * @throws Error if file is not provided or upload fails
 */
export async function uploadFile(file: File | null, dirName: string = env.UPLOAD_DIR) {
    try {
        if (!file) throw new Error("Please select a file");

        // Convert the File object to a Node.js buffer for upload
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate a unique file name using UUID to avoid name collisions
        const extension = file.name.split(".").pop() || "bin";
        const uniqueName = `${uuidV4()}.${extension}`;

        // Construct the storage key (directory + file name)
        const key = `${dirName}${uniqueName}`;

        logger.info("Preparing file upload command for object storage");

        // Create S3-compatible upload command
        const command = new PutObjectCommand({
            Bucket: env.DO_SPACES_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
            ACL: "public-read"
        });

        logger.info("Uploading file to DigitalOcean Spaces");

        // Execute upload
        await spaceClient.send(command);

        logger.info("File successfully uploaded");

        return `${env.DO_PROTOCOL}://${env.DO_SPACES_NAME}.${env.DO_REGION}.digitaloceanspaces.com/${key}`;

    } catch (error: any) {
        logger.error("Failed to save file", error);
        throw error;
    }
}