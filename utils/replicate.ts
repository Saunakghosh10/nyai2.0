import { sleep } from './helpers';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

class ReplicateService {
  private apiToken: string;
  private rateLimitDelay: number = 0;
  private modelVersion = "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3";

  constructor() {
    this.apiToken = process.env.REPLICATE_API_TOKEN || '';
  }

  async generateResponse(message: string, context: string, retryCount = 0): Promise<string> {
    try {
      // Add delay if we're being rate limited
      if (this.rateLimitDelay > 0) {
        await sleep(this.rateLimitDelay);
      }

      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: this.modelVersion,
          input: {
            prompt: `${context}\n\nQuestion: ${message}\n\nProvide a complete response that ends naturally with a period or appropriate punctuation mark. Do not cut off mid-sentence.\n\nAnswer:`,
            max_length: 500,
            temperature: 0.75,
            top_p: 0.9,
            system_prompt: "You are a helpful AI assistant. Always provide complete responses that end naturally."
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 429 && retryCount < MAX_RETRIES) {
          this.rateLimitDelay += RETRY_DELAY;
          await sleep(RETRY_DELAY);
          return this.generateResponse(message, context, retryCount + 1);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const prediction = await response.json();
      
      // Poll for completion
      const result = await this.pollForCompletion(prediction.id);
      let cleaned = result.output
        .replace(/^(Assistant:|AI:|Response:|Answer:)/i, '')
        .replace(/^[\s\n]+/, '')
        .replace(/I apologize|As an AI|I'm an AI|I cannot|I don't have|Please note/gi, '')
        .trim();

      if (!cleaned.match(/[.!?]$/)) {
        cleaned += '.';
      }

      return cleaned || 'Sorry, I could not generate a response.';

    } catch (error) {
      console.error('Error generating response:', error);
      if (retryCount < MAX_RETRIES) {
        await sleep(RETRY_DELAY);
        return this.generateResponse(message, context, retryCount + 1);
      }
      throw error;
    }
  }

  private async pollForCompletion(predictionId: string): Promise<any> {
    const maxAttempts = 30;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          'Authorization': `Token ${this.apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const prediction = await response.json();

      if (prediction.status === 'succeeded') {
        return prediction;
      }

      if (prediction.status === 'failed') {
        throw new Error('Prediction failed');
      }

      await sleep(1000);
      attempts++;
    }

    throw new Error('Prediction timed out');
  }
}

const replicateService = new ReplicateService();

export const generateResponse = (message: string, context: string) => 
  replicateService.generateResponse(message, context);