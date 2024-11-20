import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const recording = formData.get('recording') as File;
    const sessionId = formData.get('sessionId') as string;

    if (!recording || !sessionId) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing required fields',
      }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(`recordings/${sessionId}/${Date.now()}.webm`, recording, {
      access: 'private',
    });

    // Update session with recording URL
    await prisma.videoSession.update({
      where: { id: sessionId },
      data: {
        recording: blob.url,
      },
    });

    return NextResponse.json({
      status: 'success',
      url: blob.url,
    });

  } catch (error) {
    console.error('Recording upload error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to upload recording',
    }, { status: 500 });
  }
} 