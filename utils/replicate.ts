import Replicate from 'replicate';
import { sleep } from './helpers';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

class ReplicateService {
  private replicate: Replicate;
  private rateLimitDelay: number = 0;

  constructor() {
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN || '',
    });
  }

  async generateResponse(message: string, context: string, retryCount = 0): Promise<string> {
    try {
      // Add delay if we're being rate limited
      if (this.rateLimitDelay > 0) {
        await sleep(this.rateLimitDelay);
      }

      const output = await this.replicate.run(
        "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
        {
          input: {
            prompt: `${context}\n\nQuestion: ${message}\n\nProvide a complete response that ends naturally with a period or appropriate punctuation mark. Do not cut off mid-sentence.\n\nAnswer:`,
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1.1,
            system_prompt: "You are a helpful AI assistant. Always provide complete responses that end naturally."
          }
        }
      );

      if (!output) {
        throw new Error('Empty response from model');
      }

      let response = Array.isArray(output) ? output.join('') : String(output);
      return this.cleanResponse(response);

    } catch (error: any) {
      console.error('Replicate API Error:', error);

      // Handle rate limiting
      if (error.status === 429 && retryCount < MAX_RETRIES) {
        this.rateLimitDelay = (retryCount + 1) * RETRY_DELAY;
        await sleep(this.rateLimitDelay);
        return this.generateResponse(message, context, retryCount + 1);
      }

      // Handle other errors
      if (retryCount < MAX_RETRIES) {
        await sleep(RETRY_DELAY);
        return this.generateResponse(message, context, retryCount + 1);
      }

      return "I apologize, but I'm having trouble processing your request. Please try again in a moment.";
    }
  }

  private cleanResponse(response: string): string {
    let cleaned = response
      .replace(/^(Assistant:|AI:|Response:|Answer:)/i, '')
      .replace(/^[\s\n]+/, '')
      .replace(/I apologize|As an AI|I'm an AI|I cannot|I don't have|Please note/gi, '')
      .trim();

    if (!cleaned.match(/[.!?]$/)) {
      cleaned += '.';
    }

    return cleaned;
  }
}

const replicateService = new ReplicateService();
export const generateResponse = (message: string, context: string) => 
  replicateService.generateResponse(message, context); 