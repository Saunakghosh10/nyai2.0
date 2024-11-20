import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { generateResponse } from '@/utils/replicate';

export const runtime = 'edge';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { templateId, formData, simplifyLanguage } = await req.json();

    if (!templateId || !formData) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    try {
      // Create a structured prompt for the document
      const prompt = `Generate a ${templateId} document with the following details:
${Object.entries(formData)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}

Please create a legally sound document that is ${simplifyLanguage ? 'written in simple, understandable language' : 'professionally formatted'}.
Include all necessary legal clauses and ensure the document is properly structured.`;

      // Generate the document using Replicate
      const response = await generateResponse(prompt, '');

      return NextResponse.json({
        content: response,
        status: 'success'
      });
    } catch (error: any) {
      console.error('Document generation error:', error);
      return NextResponse.json({
        content: "Failed to generate document. Please try again.",
        status: 'error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      content: "Something went wrong. Please try again later.",
      status: 'error'
    }, { status: 500 });
  }
} 