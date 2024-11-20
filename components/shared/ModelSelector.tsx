"use client";

import { useState } from 'react';
import { modelConfigs, ModelProvider } from '@/utils/modelConfig';
import { motion } from 'framer-motion';

interface ModelSelectorProps {
  onModelSelect: (provider: ModelProvider, model: string) => void;
  selectedProvider?: ModelProvider;
  selectedModel?: string;
}

export default function ModelSelector({ 
  onModelSelect, 
  selectedProvider = 'openai',
  selectedModel = 'gpt-4'
}: ModelSelectorProps) {
  const [provider, setProvider] = useState<ModelProvider>(selectedProvider);
  const [model, setModel] = useState(selectedModel);

  const handleProviderChange = (newProvider: ModelProvider) => {
    setProvider(newProvider);
    setModel(modelConfigs[newProvider].models[0]);
    onModelSelect(newProvider, modelConfigs[newProvider].models[0]);
  };

  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    onModelSelect(provider, newModel);
  };

  return (
    <div className="space-y-4 p-4 bg-accent-midnight rounded-lg">
      <div>
        <label className="block text-sm font-medium text-text-purple mb-2">
          Select AI Provider
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(modelConfigs).map(([key, config]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleProviderChange(key as ModelProvider)}
              className={`p-2 rounded-lg text-sm ${
                provider === key 
                  ? 'bg-primary-violet text-white' 
                  : 'bg-accent-violet/20 text-text-purple'
              }`}
            >
              {config.name}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-purple mb-2">
          Select Model
        </label>
        <select
          value={model}
          onChange={(e) => handleModelChange(e.target.value)}
          className="w-full bg-accent-midnight border border-accent-violet/20 rounded-lg px-4 py-2 text-text-light"
        >
          {modelConfigs[provider].models.map((modelName) => (
            <option key={modelName} value={modelName}>
              {modelName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 