import { env } from "@/configs";
import { S3Client } from "@aws-sdk/client-s3";


export const spaceClient = new S3Client({
    region: env.DO_REGION,
    endpoint: env.DO_ENDPOINT,
    credentials: {
        accessKeyId: env.DO_ACCESS_KEY!,
        secretAccessKey: env.DO_SECRET_KEY!,
    },
});
