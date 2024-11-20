import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';
import { extractTextFromPDF } from '@/utils/pdfUtils';

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const document = await prisma.document.findFirst({
      where: {
        userId,
        status: 'active',
      },
      orderBy: {
        lastAccessed: 'desc',
      },
    });

    return NextResponse.json({ document });

  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Add token to blob upload
    const blob = await put(`documents/${userId}/${Date.now()}-${file.name}`, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    let content = '';
    if (file.type === 'application/pdf') {
      content = await extractTextFromPDF(file);
    } else {
      content = await file.text();
    }

    // Create new document
    const document = await prisma.document.create({
      data: {
        userId,
        name: file.name,
        content,
        fileUrl: blob.url,
        fileType: file.type,
      },
    });

    return NextResponse.json({
      status: 'success',
      documentId: document.id,
      fileUrl: blob.url,
      content,
    });

  } catch (error) {
    console.error('Save document error:', error);
    return NextResponse.json({ error: 'Failed to save document' }, { status: 500 });
  }
} 