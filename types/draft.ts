export interface DocumentTemplate {
  id: string;
  name: string;
  category: 'legal' | 'real-estate' | 'healthcare' | 'financial' | 'education' | 'ip' | 'business';
  fields: FormField[];
  description: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'select' | 'textarea' | 'number';
  required: boolean;
  options?: string[]; // For select fields
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface DraftRequest {
  templateId: string;
  formData: Record<string, any>;
  language?: string;
  simplifyLanguage: boolean;
}

export interface DraftResponse {
  content: string;
  status: 'success' | 'error';
  message?: string;
}

export interface DraftVersion {
  id: string;
  templateId: string;
  formData: Record<string, any>;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'final';
  version: number;
}

export interface SavedDraft {
  id: string;
  userId: string;
  templateId: string;
  formData: Record<string, any>;
  lastSaved: Date;
  versions: DraftVersion[];
} 