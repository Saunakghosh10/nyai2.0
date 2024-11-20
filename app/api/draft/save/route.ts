import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { templateId, formData, content, status = 'draft' } = await req.json();

    if (!templateId || !formData) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // First, find the latest version number for this draft
    const existingDraft = await prisma.savedDraft.findUnique({
      where: {
        userId_templateId: {
          userId,
          templateId,
        },
      },
      include: {
        versions: {
          orderBy: {
            version: 'desc',
          },
          take: 1,
        },
      },
    });

    const nextVersion = existingDraft?.versions[0]?.version 
      ? existingDraft.versions[0].version + 1 
      : 1;

    // Now create or update the draft with the correct version number
    const draft = await prisma.savedDraft.upsert({
      where: {
        userId_templateId: {
          userId,
          templateId,
        },
      },
      update: {
        lastSaved: new Date(),
        versions: {
          create: {
            content,
            formData,
            status,
            version: nextVersion,
          },
        },
      },
      create: {
        userId,
        templateId,
        formData,
        lastSaved: new Date(),
        versions: {
          create: {
            content,
            formData,
            status,
            version: 1,
          },
        },
      },
      include: {
        versions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    return NextResponse.json({
      status: 'success',
      draft,
    });

  } catch (error) {
    console.error('Save draft error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to save draft',
    }, { status: 500 });
  }
} 