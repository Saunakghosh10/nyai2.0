"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiSave } from 'react-icons/fi';
import { modelConfigs, ModelProvider } from '@/utils/modelConfig';
import toast from 'react-hot-toast';

interface ApiKeyManagerProps {
  onKeySave: (provider: ModelProvider, key: string) => void;
  selectedProvider?: ModelProvider;
}

export default function ApiKeyManager({ onKeySave, selectedProvider }: ApiKeyManagerProps) {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState<Record<string, boolean>>({});
  const [lastValidated, setLastValidated] = useState<Record<string, Date>>({});

  useEffect(() => {
    // Check key validation status periodically
    const interval = setInterval(async () => {
      const providers = selectedProvider ? [selectedProvider] : Object.keys(modelConfigs);
      for (const provider of providers) {
        const lastCheck = lastValidated[provider];
        if (lastCheck && Date.now() - lastCheck.getTime() > 24 * 60 * 60 * 1000) {
          // Revalidate keys older than 24 hours
          handleSaveKey(provider as ModelProvider);
        }
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, [lastValidated, selectedProvider]);

  const handleSaveKey = async (provider: ModelProvider) => {
    const key = keys[provider];
    if (!key) {
      toast.error('Please enter an API key');
      return;
    }

    setIsValidating({ ...isValidating, [provider]: true });

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, token: key }),
      });

      const data = await response.json();
      
      if (data.valid) {
        onKeySave(provider, key);
        setLastValidated({ ...lastValidated, [provider]: new Date() });
        toast.success(`${modelConfigs[provider].name} API key saved successfully`);
      } else {
        toast.error(`Invalid ${modelConfigs[provider].name} API key`);
      }
    } catch (error) {
      console.error('API key validation error:', error);
      toast.error('Failed to validate API key');
    } finally {
      setIsValidating({ ...isValidating, [provider]: false });
    }
  };

  return (
    <div className="space-y-4 p-4 bg-accent-midnight rounded-lg">
      {(selectedProvider ? [selectedProvider] : Object.keys(modelConfigs)).map((provider) => (
        <div key={provider} className="space-y-2">
          <label className="block text-sm font-medium text-text-purple">
            {modelConfigs[provider as ModelProvider].name} API Key
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <input
                type={showKeys[provider] ? 'text' : 'password'}
                value={keys[provider] || ''}
                onChange={(e) => setKeys({ ...keys, [provider]: e.target.value })}
                className="w-full bg-accent-midnight border border-accent-violet/20 rounded-lg px-4 py-2 text-text-light"
                placeholder={`Enter your ${modelConfigs[provider as ModelProvider].name} API key`}
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
              className="px-4 py-2 bg-primary-violet text-white rounded-lg hover:bg-accent-violet"
            >
              <FiSave className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      ))}
    </div>
  );
} 