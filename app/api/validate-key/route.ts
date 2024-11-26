import { NextResponse } from 'next/server';
import { ApiKeyValidator } from '@/utils/apiKeyValidation';
import { rateLimiter } from '@/middleware/rateLimiter';
import { encryptApiKey } from '@/utils/encryption';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Check rate limit
    const rateLimitResult = await rateLimiter(req as any);
    if (rateLimitResult) return rateLimitResult;

    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { provider, token } = await req.json();

    if (!provider || !token) {
      return NextResponse.json({ error: 'Missing provider or token' }, { status: 400 });
    }

    // Validate the API key
    const validator = new ApiKeyValidator();
    const isValid = await validator.validateKey(provider, token);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 400 });
    }

    // Encrypt the API key
    const encryptedKey = await encryptApiKey(token);

    // Store or update the API key
    const apiKey = await prisma.apiKey.upsert({
      where: {
        userId_provider: {
          userId,
          provider,
        },
      },
      update: {
        key: encryptedKey,
      },
      create: {
        userId,
        provider,
        key: encryptedKey,
      },
    });

    return NextResponse.json({ 
      message: 'API key validated and stored successfully',
      provider: apiKey.provider 
    });

  } catch (error) {
    console.error('Validate key error:', error);
    return NextResponse.json({ 
      error: 'Failed to validate API key' 
    }, { status: 500 });
  }
}