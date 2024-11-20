import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const sessions = await prisma.consultSession.findMany({
      where: {
        userId,
      },
      include: {
        videoSession: true,
        expertise: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return NextResponse.json({
      status: 'success',
      sessions: sessions.map(session => ({
        ...session,
        recording: session.videoSession?.recording,
      })),
    });

  } catch (error) {
    console.error('Fetch sessions error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch sessions',
    }, { status: 500 });
  }
} 