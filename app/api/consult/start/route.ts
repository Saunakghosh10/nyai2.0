import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { topic, expertise, documents } = await req.json();

    const session = await prisma.consultSession.create({
      data: {
        userId,
        topic,
        status: 'active',
        startTime: new Date(),
        expertise: {
          connect: expertise.map((id: string) => ({ id }))
        },
        documents: documents || [],
      },
      include: {
        expertise: true,
      },
    });

    return NextResponse.json({
      status: 'success',
      session,
    });

  } catch (error) {
    console.error('Start consultation error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to start consultation',
    }, { status: 500 });
  }
} 