import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    const replicate = new Replicate({
      auth: token,
    });

    // Try to list models to validate the token
    await replicate.models.list();

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ valid: false }, { status: 401 });
  }
} 