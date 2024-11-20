import { put } from '@vercel/blob';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);

export async function uploadToBlob(file: File) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('Missing BLOB_READ_WRITE_TOKEN');
    }

    const filename = `${nanoid()}-${file.name}`;
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return blob;
  } catch (error) {
    console.error('Blob upload error:', error);
    throw new Error('Failed to upload file to blob storage');
  }
} 