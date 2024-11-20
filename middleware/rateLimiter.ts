import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 50; // requests per minute

export async function rateLimiter(req: NextRequest) {
  const ip = req.ip || 'anonymous';
  const key = `rate-limit:${ip}`;

  try {
    const requests = await redis.get<number[]>(key) || [];
    const now = Date.now();
    const windowStart = now - WINDOW_SIZE;

    // Filter out old requests
    const recentRequests = requests.filter(time => time > windowStart);

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
    console.error('Rate limiter error:', error);
    return null; // Allow request on error
  }
} 