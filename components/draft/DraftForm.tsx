"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { documentTemplates } from '@/config/documentTemplates';
import type { FormField } from '@/types/draft';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'react-hot-toast';

interface DraftFormProps {
  templateId: string;
  onSubmit: (formData: Record<string, any>) => Promise<void>;
  onBack: () => void;
  initialData?: Record<string, any>;
}

export default function DraftForm({ templateId, onSubmit, onBack, initialData }: DraftFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData || {});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const debouncedFormData = useDebounce(formData, 1000);

  const template = documentTemplates.find(t => t.id === templateId);
  if (!template) return null;

  // Auto-save effect
  useEffect(() => {
    const saveFormData = async () => {
      if (Object.keys(debouncedFormData).length === 0) return;
      
      setIsSaving(true);
      try {
        const response = await fetch('/api/draft/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            templateId,
            formData: debouncedFormData,
            status: 'draft',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save draft');
        }

        setLastSaved(new Date());
        toast.success('Draft saved');
      } catch (error) {
        console.error('Auto-save error:', error);
        toast.error('Failed to save draft');
      } finally {
        setIsSaving(false);
      }
    };

    saveFormData();
  }, [debouncedFormData, templateId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full bg-accent-violet/20 rounded-lg px-4 py-2 text-text-light"
            rows={4}
          />
        );
      case 'select':
        return (
          <select
            id={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            required={field.required}
            className="w-full bg-accent-violet/20 rounded-lg px-4 py-2 text-text-light"
          >
            <option value="">Select...</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type={field.type}
            id={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full bg-accent-violet/20 rounded-lg px-4 py-2 text-text-light"
          />
        );
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button
        type="button"
        onClick={onBack}
        className="flex items-center text-text-light mb-4"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back
      </button>

      <h2 className="text-2xl font-bold text-text-light mb-6">{template.name}</h2>

      {template.fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <label htmlFor={field.id} className="block text-sm font-medium text-text-light">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          {renderField(field)}
        </div>
      ))}

      <div className="flex items-center justify-between text-sm text-text-purple">
        {isSaving ? (
          <span className="flex items-center">
            <CloudArrowUpIcon className="h-4 w-4 mr-1 animate-bounce" />
            Saving...
          </span>
        ) : lastSaved ? (
          <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
        ) : null}
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 px-4 rounded-lg bg-primary-violet text-white hover:bg-accent-violet transition-colors"
      >
        Generate Document
      </motion.button>
    </motion.form>
  );
} 