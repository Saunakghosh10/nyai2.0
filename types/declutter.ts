export interface ProcessedDocument {
  content: string;
  summary: string;
  language: string;
  wordCount: number;
  timestamp?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatResponse {
  content: string;
  context?: string;
  timestamp: string;
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
} 