export interface ConsultSession {
  id: string;
  userId: string;
  topic: string;
  status: 'active' | 'completed' | 'scheduled';
  startTime?: Date;
  endTime?: Date;
  summary?: string;
  messages: ConsultMessage[];
  expertise: ExpertiseArea[];
  documents?: string[];
}

export interface ConsultMessage {
  id: string;
  sessionId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  attachments?: string[];
}

export interface ExpertiseArea {
  id: string;
  name: string;
  description: string;
  topics: string[];
}

export interface ConsultRequest {
  topic: string;
  context?: string;
  documents?: string[];
  expertise: string[];
} 