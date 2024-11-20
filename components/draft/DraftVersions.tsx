"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import type { DraftVersion } from '@/types/draft';

interface DraftVersionsProps {
  versions: DraftVersion[];
  onVersionSelect: (version: DraftVersion) => void;
  currentVersionId?: string;
}

export default function DraftVersions({ versions, onVersionSelect, currentVersionId }: DraftVersionsProps) {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="text-lg font-medium text-text-light">Document Versions</h3>
      <div className="space-y-2">
        {versions.map((version) => (
          <motion.button
            key={version.id}
            onClick={() => onVersionSelect(version)}
            className={`w-full p-4 rounded-lg flex items-center justify-between ${
              version.id === currentVersionId
                ? 'bg-primary-violet/20 border border-primary-violet'
                : 'bg-accent-violet/10 hover:bg-accent-violet/20'
            } transition-colors`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center space-x-3">
              {version.status === 'final' ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <ClockIcon className="h-5 w-5 text-text-purple" />
              )}
              <div className="text-left">
                <p className="text-text-light">Version {version.version}</p>
                <p className="text-sm text-text-purple">
                  {new Date(version.updatedAt).toLocaleDateString()} at{' '}
                  {new Date(version.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
} 