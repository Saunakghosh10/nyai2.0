"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import DraftForm from "@/components/draft/DraftForm";
import DocumentPreview from "@/components/draft/DocumentPreview";
import { documentTypes } from "@/config/documentTypes";
import { documentTemplates } from "@/config/documentTemplates";

export default function DraftPage() {
  const [selectedType, setSelectedType] = useState('');
  const [step, setStep] = useState<'select' | 'form' | 'preview'>('select');
  const [generatedDocument, setGeneratedDocument] = useState<string>('');

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setStep('form');
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      const response = await fetch('/api/draft/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedType,
          formData,
          simplifyLanguage: true,
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setGeneratedDocument(data.content);
        setStep('preview');
      }
    } catch (error) {
      console.error('Error generating document:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-black to-accent-midnight py-12">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl font-bold text-text-light mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            AI Document Drafting
          </motion.h1>
          <motion.p
            className="text-text-purple text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Create legally sound documents in simple language
          </motion.p>
        </div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-accent-midnight/50 backdrop-blur-sm rounded-lg border border-accent-violet/20 p-8">
            {step === 'select' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {documentTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className="p-6 text-left bg-accent-violet/10 rounded-lg hover:bg-accent-violet/20 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h3 className="text-lg font-medium text-text-light">{type.name}</h3>
                    <p className="mt-2 text-sm text-text-purple">{type.description}</p>
                  </motion.button>
                ))}
              </div>
            )}

            {step === 'form' && (
              <DraftForm 
                templateId={selectedType}
                onSubmit={handleFormSubmit}
                onBack={() => setStep('select')}
              />
            )}

            {step === 'preview' && (
              <DocumentPreview
                content={generatedDocument}
                onEdit={() => setStep('form')}
                onBack={() => setStep('select')}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 