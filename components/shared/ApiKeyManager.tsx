"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiSave } from 'react-icons/fi';
import { modelConfigs, ModelProvider } from '@/utils/modelProvider';

interface ApiKeyManagerProps {
  onKeySave: (provider: ModelProvider, key: string) => void;
}

export default function ApiKeyManager({ onKeySave }: ApiKeyManagerProps) {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load saved keys from localStorage
    const savedKeys = localStorage.getItem('api_keys');
    if (savedKeys) {
      setKeys(JSON.parse(savedKeys));
    }
  }, []);

  const handleSaveKey = (provider: ModelProvider) => {
    const key = keys[provider];
    if (key) {
      localStorage.setItem('api_keys', JSON.stringify({ ...keys, [provider]: key }));
      onKeySave(provider, key);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-text-light">API Keys</h3>
      {Object.entries(modelConfigs)
        .filter(([_, config]) => config.requiresKey)
        .map(([provider, config]) => (
          <motion.div
            key={provider}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent-midnight/50 p-4 rounded-lg border border-accent-violet/20"
          >
            <label className="block text-sm font-medium text-text-light mb-2">
              {config.name} API Key
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  type={showKeys[provider] ? 'text' : 'password'}
                  value={keys[provider] || ''}
                  onChange={(e) => setKeys({ ...keys, [provider]: e.target.value })}
                  className="w-full bg-accent-midnight border border-accent-violet/20 rounded-lg px-4 py-2 text-text-light focus:outline-none focus:border-primary-violet"
                  placeholder={`Enter your ${config.name} API key`}
                />
                <button
                  type="button"
                  onClick={() => setShowKeys({ ...showKeys, [provider]: !showKeys[provider] })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-purple hover:text-text-light"
                >
                  {showKeys[provider] ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSaveKey(provider as ModelProvider)}
                className="px-4 py-2 bg-primary-violet text-white rounded-lg hover:bg-accent-violet transition-colors"
              >
                <FiSave className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        ))}
    </div>
  );
} 