import { ModelProvider } from './modelConfig';
import OpenAI from 'openai';
import { HfInference } from '@huggingface/inference';

export class ApiKeyValidator {
  static async validateOpenAI(apiKey: string): Promise<boolean> {
    const openai = new OpenAI({ apiKey });
    try {
      await openai.models.list();
      return true;
    } catch (error: any) {
      if (error.status === 401) return false;
      throw error;
    }
  }

  static async validateReplicate(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.replicate.com/v1/models', {
        headers: {
          'Authorization': `Token ${apiKey}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Replicate validation error:', error);
      return false;
    }
  }

  static async validateHuggingFace(apiKey: string): Promise<boolean> {
    const hf = new HfInference(apiKey);
    try {
      await hf.textGeneration({
        model: 'gpt2',
        inputs: 'test',
        parameters: {
          max_new_tokens: 1,
        },
      });
      return true;
    } catch (error: any) {
      if (error.status === 401) return false;
      throw error;
    }
  }

  async validateKey(provider: string, key: string): Promise<boolean> {
    switch (provider.toLowerCase()) {
      case 'openai':
        return ApiKeyValidator.validateOpenAI(key);
      case 'replicate':
        return ApiKeyValidator.validateReplicate(key);
      case 'huggingface':
        return ApiKeyValidator.validateHuggingFace(key);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}