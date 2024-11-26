import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export const runtime = 'edge';
export const maxDuration = 60;

async function generateDOCX(content: string): Promise<Uint8Array> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: content,
                size: 24,
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content, format } = await req.json();

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    if (format !== 'docx') {
      return new NextResponse("Only DOCX format is supported", { status: 400 });
    }

    const buffer = await generateDOCX(content);
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename=draft.docx',
      },
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to generate document',
    }, { status: 500 });
  }
}