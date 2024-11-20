import { Redis } from '@upstash/redis'

// Create a dummy Redis client if environment variables are missing
const createRedisClient = () => {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('Redis environment variables missing, using dummy cache');
    return {
      get: async () => null,
      set: async () => null,
      del: async () => null,
    };
  }

  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
};

export const redis = createRedisClient();

const cacheKey = (userId: string, key: string) => `user:${userId}:${key}`;

export async function getCachedDocument(userId: string, documentId: string) {
  try {
    const key = cacheKey(userId, `doc:${documentId}`);
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached as string) : null;
  } catch (error) {
    console.warn('Redis cache error:', error);
    return null;
  }
}

export async function invalidateCache(userId: string, documentId: string) {
  try {
    const key = cacheKey(userId, `doc:${documentId}`);
    await redis.del(key);
  } catch (error) {
    console.warn('Redis cache error:', error);
  }
} 