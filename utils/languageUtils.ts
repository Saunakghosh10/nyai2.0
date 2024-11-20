import { Translate } from '@google-cloud/translate/build/src/v2';

const translate = new Translate({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS || '{}'),
});

export async function detectLanguage(text: string) {
  try {
    const [detection] = await translate.detect(text);
    return {
      language: detection.language,
      confidence: detection.confidence,
    };
  } catch (error) {
    console.error('Error detecting language:', error);
    throw error;
  }
}

export async function translateText(text: string, targetLanguage: string) {
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
}

export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'gu', name: 'Gujarati' },
  // Add more languages as needed
]; 