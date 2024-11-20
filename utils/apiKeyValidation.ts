import { ModelProvider } from './modelConfig';
import OpenAI from 'openai';
import Replicate from 'replicate';
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
    const replicate = new Replicate({ auth: apiKey });
    try {
      await replicate.models.list();
      return true;
    } catch (error: any) {
      if (error.message.includes('unauthorized')) return false;
      throw error;
    }
  }

  static async validateHuggingFace(apiKey: string): Promise<boolean> {
    const hf = new HfInference(apiKey);
    try {
      await hf.textGeneration({
        model: 'gpt2',
        inputs: 'test',
        parameters: { max_length: 5 }
      });
      return true;
    } catch (error: any) {
      if (error.message.includes('unauthorized')) return false;
      throw error;
    }
  }

  static async validate(provider: ModelProvider, apiKey: string): Promise<boolean> {
    const validators = {
      openai: this.validateOpenAI,
      replicate: this.validateReplicate,
      huggingface: this.validateHuggingFace
    };

    return await validators[provider](apiKey);
  }
} 