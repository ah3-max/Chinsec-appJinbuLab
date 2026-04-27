import { Client } from "minio";

let cached: Client | null = null;

export function minio(): Client {
  if (cached) return cached;
  const endPoint = process.env.MINIO_ENDPOINT;
  const accessKey = process.env.MINIO_ACCESS_KEY;
  const secretKey = process.env.MINIO_SECRET_KEY;
  if (!endPoint || !accessKey || !secretKey) {
    throw new Error("MinIO env vars missing");
  }
  cached = new Client({
    endPoint,
    port: parseInt(process.env.MINIO_PORT ?? "9000", 10),
    useSSL: (process.env.MINIO_USE_SSL ?? "false") === "true",
    accessKey,
    secretKey,
  });
  return cached;
}

export function minioPublicUrl(bucket: string, key: string): string {
  const useSSL = (process.env.MINIO_USE_SSL ?? "false") === "true";
  // Use the externally-reachable host. In dev MinIO is on localhost:9000.
  const host = process.env.MINIO_PUBLIC_HOST ?? process.env.MINIO_ENDPOINT ?? "localhost";
  const port = process.env.MINIO_PUBLIC_PORT ?? process.env.MINIO_PORT ?? "9000";
  return `${useSSL ? "https" : "http"}://${host}:${port}/${bucket}/${encodeURI(
    key,
  )}`;
}
