import IORedis from "ioredis";

const globalForRedis = globalThis as unknown as { redis: IORedis | undefined };

export const redis =
  globalForRedis.redis ??
  new IORedis(process.env.REDIS_URL!, {
    lazyConnect: false,
    maxRetriesPerRequest: 2,
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
