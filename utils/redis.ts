import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Missing Redis environment variables')
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export const cacheKey = (userId: string, type: string) => `${userId}:${type}`

export async function cacheDocument(userId: string, documentId: string, content: any) {
  const key = cacheKey(userId, `doc:${documentId}`)
  await redis.set(key, JSON.stringify(content), { ex: 60 * 60 * 24 }) // 24 hours
}

export async function getCachedDocument(userId: string, documentId: string) {
  const key = cacheKey(userId, `doc:${documentId}`)
  const cached = await redis.get(key)
  return cached ? JSON.parse(cached as string) : null
}

export async function invalidateCache(userId: string, documentId: string) {
  const key = cacheKey(userId, `doc:${documentId}`)
  await redis.del(key)
} 