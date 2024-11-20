import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { generateResponse } from '@/utils/replicate';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { sessionId, message, context } = await req.json();

    if (!sessionId || !message) {
      return NextResponse.json({
        content: "Missing required fields",
        status: 'error'
      }, { status: 400 });
    }

    // Save user message
    await prisma.consultMessage.create({
      data: {
        sessionId,
        content: message,
        role: 'user',
        timestamp: new Date(),
      },
    });

    // Generate AI response
    const response = await generateResponse(message, context);

    // Save AI response
    await prisma.consultMessage.create({
      data: {
        sessionId,
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      },
    });

    return NextResponse.json({
      content: response,
      status: 'success'
    });

  } catch (error) {
    console.error('Consultation chat error:', error);
    return NextResponse.json({
      content: "Something went wrong. Please try again later.",
      status: 'error'
    }, { status: 500 });
  }
} 