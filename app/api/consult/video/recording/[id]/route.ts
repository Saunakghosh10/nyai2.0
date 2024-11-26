import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import { list } from '@vercel/blob';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const session = await prisma.consultSession.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: {
        videoSession: true,
      },
    });

    if (!session?.videoSession?.recording) {
      return new NextResponse("Recording not found", { status: 404 });
    }

    const blob = await list(session.videoSession.recording);
    
    return new NextResponse(blob);

  } catch (error) {
    console.error('Get recording error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to get recording',
    }, { status: 500 });
  }
}