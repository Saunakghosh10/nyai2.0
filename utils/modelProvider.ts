import Replicate from 'replicate';

export class ModelService {
  private replicate: Replicate;

  constructor() {
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }

  async generateResponse(message: string, context: string): Promise<string> {
    try {
      const output = await this.replicate.run(
        "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
        {
          input: {
            prompt: `Context: ${context}\n\nQuestion: ${message}\n\nAnswer:`,
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1,
          }
        }
      );

      return Array.isArray(output) ? output.join('') : String(output);
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response');
    }
  }
} 