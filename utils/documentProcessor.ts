import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  switch (file.type) {
    case 'application/pdf':
      const pdfData = await pdf(buffer);
      return cleanText(pdfData.text);

    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/msword':
      const result = await mammoth.extractRawText({ buffer });
      return cleanText(result.value);

    case 'text/plain':
      return cleanText(await file.text());

    default:
      throw new Error('Unsupported file type');
  }
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
    .trim();
}

export function validateFile(file: File) {
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  const errors = [];

  if (!validTypes.includes(file.type)) {
    errors.push('Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file.');
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    errors.push('File size too large. Maximum size is 10MB.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function summarizeText(text: string): string {
  // Basic text cleanup
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 5000); // Limit context size
} 