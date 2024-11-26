import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;

if (redisUrl && redisToken) {
  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });
}

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 50; // requests per minute

export async function rateLimiter(req: NextRequest) {
  // If Redis is not configured, skip rate limiting
  if (!redis) {
    return null;
  }

  const ip = req.ip || 'anonymous';
  const key = `rate-limit:${ip}`;

  try {
    const requests = await redis.get<number[]>(key) || [];
    const now = Date.now();
    const windowStart = now - WINDOW_SIZE;

    // Filter out old requests
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);

    if (recentRequests.length >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Add current request
    recentRequests.push(now);
    await redis.set(key, recentRequests, { ex: 60 });

    return null;
  } catch (error) {
    console.error('Rate limiting error:', error);
    // On error, allow the request to proceed
    return null;
  }
}