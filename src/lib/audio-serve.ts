/**
 * Shared helper for the /api/audio/* routes.
 *
 * Why this exists:
 *   The previous implementation issued a 302 redirect to `minioPublicUrl(...)`
 *   which points at `localhost:9000`. That works when the browser is on the
 *   same Mac, but breaks for any phone reaching the app via cloudflared/LAN —
 *   the phone has no route to the developer machine's MinIO. The fallback
 *   then triggered Web Speech, which on iOS Safari requires the user gesture
 *   that has already been consumed by the failed audio.play() — net result:
 *   silent button.
 *
 *   So we stream the MinIO bytes back through this Next.js route (same
 *   origin as the caller) and only redirect to `/audio/...` when serving
 *   from `public/`, which is also same origin.
 */

import { NextResponse, type NextRequest } from "next/server";
import { existsSync } from "fs";
import * as path from "path";
import { Readable } from "stream";
import { minio } from "@/lib/minio";

const PUBLIC_ROOT = path.resolve(process.cwd(), "public/audio");

export async function serveAudioObject(
  req: NextRequest,
  objectKey: string,
): Promise<Response> {
  // 1) MinIO — stream bytes through this route (NOT a cross-origin redirect).
  const bucket = process.env.MINIO_BUCKET_AUDIO;
  if (bucket && process.env.MINIO_ACCESS_KEY) {
    try {
      const stat = await minio().statObject(bucket, objectKey);
      const stream = await minio().getObject(bucket, objectKey);
      const webStream = Readable.toWeb(stream) as ReadableStream<Uint8Array>;
      return new Response(webStream, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": String(stat.size),
          "Cache-Control": "public, max-age=86400, immutable",
        },
      });
    } catch {
      /* not in MinIO — try local */
    }
  }

  // 2) Local public/ — same-origin redirect is safe.
  const localPath = path.join(PUBLIC_ROOT, objectKey);
  if (existsSync(localPath)) {
    return NextResponse.redirect(new URL(`/audio/${objectKey}`, req.url), 302);
  }

  return NextResponse.json(
    { error: "audio not found", key: objectKey },
    { status: 404 },
  );
}
