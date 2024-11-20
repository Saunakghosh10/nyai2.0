import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import { uploadToBlob } from '@/utils/blob';
import { rateLimiter } from '@/middleware/rateLimiter';

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const document = await prisma.document.findFirst({
      where: {
        userId,
        status: 'active',
      },
      orderBy: {
        lastAccessed: 'desc',
      },
    });

    return NextResponse.json({ document });

  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Check rate limit
    const rateLimitResult = await rateLimiter(req as any);
    if (rateLimitResult) return rateLimitResult;

    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload to blob storage
    const blob = await uploadToBlob(file);

    // Save document metadata to database
    const document = await prisma.document.create({
      data: {
        userId,
        name: file.name,
        fileType: file.type,
        fileUrl: blob.url,
        size: file.size,
      },
    });

    return NextResponse.json({ document });
  } catch (error) {
    console.error('Save document error:', error);
    return NextResponse.json(
      { error: 'Failed to save document' },
      { status: 500 }
    );
  }
} 