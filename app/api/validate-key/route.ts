import { NextResponse } from 'next/server';
import { ApiKeyValidator } from '@/utils/apiKeyValidation';
import { rateLimiter } from '@/middleware/rateLimiter';
import { encryptApiKey } from '@/utils/encryption';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

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

    // Validate the API key
    const isValid = await ApiKeyValidator.validate(provider, token);
    if (!isValid) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    // Encrypt the API key before storing
    const { encryptedData, iv, tag } = encryptApiKey(token);

    // Store or update the encrypted API key
    await prisma.apiKey.upsert({
      where: {
        userId_provider: {
          userId,
          provider,
        },
      },
      update: {
        encryptedKey: encryptedData,
        iv,
        tag,
        lastValidated: new Date(),
      },
      create: {
        userId,
        provider,
        encryptedKey: encryptedData,
        iv,
        tag,
        lastValidated: new Date(),
      },
    });

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('API key validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate API key' },
      { status: 500 }
    );
  }
} 