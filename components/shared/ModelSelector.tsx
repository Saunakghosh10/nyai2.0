"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { modelConfigs, ModelProvider } from '@/utils/modelProvider';
import ApiKeyManager from './ApiKeyManager';
import { toast } from 'react-hot-toast';

interface ModelSelectorProps {
  onModelChange: (provider: ModelProvider, model: string) => void;
  currentProvider: ModelProvider;
  currentModel: string;
}

export default function ModelSelector({
  onModelChange,
  currentProvider,
  currentModel,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);

  const handleApiKeySave = async (provider: ModelProvider, key: string) => {
    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, key }),
      });

      const data = await response.json();
      if (data.isValid) {
        toast.success(`${modelConfigs[provider].name} API key saved successfully`);
      } else {
        toast.error(`Invalid ${modelConfigs[provider].name} API key`);
      }
    } catch (error) {
      toast.error('Failed to validate API key');
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-accent-midnight border border-accent-violet/20 text-text-light"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>{modelConfigs[currentProvider].name} - {currentModel}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-10 mt-2 w-64 rounded-lg bg-accent-midnight border border-accent-violet/20 shadow-lg"
        >
          {Object.entries(modelConfigs).map(([provider, config]) => (
            <div key={provider} className="p-2">
              <div className="text-sm font-medium text-text-light px-3 py-2">
                {config.name} {config.paid && <span className="text-primary-violet">(Paid)</span>}
              </div>
              {config.models.map((model) => (
                <button
                  key={model}
                  onClick={() => {
                    onModelChange(provider as ModelProvider, model);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    currentProvider === provider && currentModel === model
                      ? 'bg-primary-violet/10 text-primary-violet'
                      : 'text-text-light hover:bg-accent-violet/10'
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          ))}
        </motion.div>
      )}

      <motion.button
        onClick={() => setShowApiKeys(!showApiKeys)}
        className="mt-4 px-4 py-2 text-sm text-text-purple hover:text-text-light"
      >
        Manage API Keys
      </motion.button>

      {showApiKeys && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-4 bg-accent-midnight rounded-lg border border-accent-violet/20"
        >
          <ApiKeyManager onKeySave={handleApiKeySave} />
        </motion.div>
      )}
    </div>
  );
} 