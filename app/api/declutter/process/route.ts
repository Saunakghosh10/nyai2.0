import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    // Convert file to base64 for processing
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // For now, we'll just return the file content
    // The actual text extraction will happen on the client side
    return NextResponse.json({
      success: true,
      fileData: base64,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

  } catch (error: any) {
    console.error('Process error:', error);
    return new NextResponse(
      `Error processing file: ${error.message}`, 
      { status: 500 }
    );
  }
} 