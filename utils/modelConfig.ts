export type ModelProvider = 'openai' | 'replicate' | 'huggingface';

export interface ModelConfig {
  name: string;
  provider: ModelProvider;
  models: string[];
  description: string;
  apiKeyRequired: boolean;
}

export const modelConfigs: Record<ModelProvider, ModelConfig> = {
  openai: {
    name: 'OpenAI',
    provider: 'openai',
    models: ['gpt-4', 'gpt-3.5-turbo'],
    description: 'Powerful models for text analysis and generation',
    apiKeyRequired: true
  },
  replicate: {
    name: 'Replicate',
    provider: 'replicate',
    models: ['llama-2-70b-chat', 'llama-2-13b-chat'],
    description: 'Open source models with flexible deployment',
    apiKeyRequired: true
  },
  huggingface: {
    name: 'Hugging Face',
    provider: 'huggingface',
    models: ['mistral-7b', 'falcon-40b'],
    description: 'Community-driven AI models',
    apiKeyRequired: true
  }
}; 