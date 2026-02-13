import Redis from "ioredis";

const getRedisUrl = () => {
  return process.env.REDIS_URL || "redis://localhost:6379";
};

// Singleton Redis client
let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(getRedisUrl(), {
      maxRetriesPerRequest: 1,
      connectTimeout: 1000,
      commandTimeout: 1000,
      retryStrategy(times) {
        if (times > 2) return null; // Stop retrying after 2 attempts
        return Math.min(times * 50, 500);
      },
      lazyConnect: true,
    });

    redis.on("error", (err) => {
      console.error("Redis connection error:", err.message);
    });
  }
  return redis;
}

export default getRedis;
