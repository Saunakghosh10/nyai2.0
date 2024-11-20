import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { generateResponse } from '@/utils/replicate';
import { preprocessDocument, extractRelevantContext } from '@/utils/documentPreprocessor';
import { formatError } from '@/utils/helpers';

export const runtime = 'edge';
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { message, documentContext } = await req.json();

    if (!message || !documentContext) {
      return NextResponse.json({
        content: "Missing required fields",
        status: 'error'
      }, { status: 400 });
    }

    try {
      const processedDoc = preprocessDocument(documentContext);
      const relevantContext = extractRelevantContext(processedDoc, message);
      
      const response = await generateResponse(message, relevantContext);
      
      return NextResponse.json({ 
        content: response,
        status: 'success'
      });

    } catch (error: any) {
      console.error('AI Service Error:', error);
      
      return NextResponse.json({
        content: formatError(error),
        status: 'error'
      }, { status: error.status || 500 });
    }

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({
      content: "Something went wrong. Please try again later.",
      status: 'error'
    }, { status: 500 });
  }
} 