import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { Readable } from 'stream';

export const runtime = 'edge';
export const maxDuration = 60;

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

async function generatePDF(content: string): Promise<Buffer> {
  const doc = new PDFDocument({
    margin: 50,
    size: 'A4',
  });

  // Add content
  doc.font('Helvetica')
     .fontSize(12)
     .text(content, {
       align: 'left',
       lineGap: 10,
     });

  // Get buffer
  const chunks: Buffer[] = [];
  doc.on('data', chunks.push.bind(chunks));
  
  return new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    doc.end();
  });
}

async function generateDOCX(content: string): Promise<Buffer> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: content.split('\n').map(paragraph => 
        new Paragraph({
          children: [
            new TextRun({
              text: paragraph,
              size: 24, // 12pt
            }),
          ],
        })
      ),
    }],
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

    if (!content || !format) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    let buffer: Buffer;
    let contentType: string;
    let filename: string;

    switch (format) {
      case 'pdf':
        buffer = await generatePDF(content);
        contentType = 'application/pdf';
        filename = 'document.pdf';
        break;

      case 'docx':
        buffer = await generateDOCX(content);
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        filename = 'document.docx';
        break;

      case 'txt':
        buffer = Buffer.from(content, 'utf-8');
        contentType = 'text/plain';
        filename = 'document.txt';
        break;

      default:
        return new NextResponse("Invalid format", { status: 400 });
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Download error:', error);
    return new NextResponse(
      "Error generating document for download",
      { status: 500 }
    );
  }
} 