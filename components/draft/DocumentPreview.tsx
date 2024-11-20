"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, DocumentArrowDownIcon, PencilIcon } from '@heroicons/react/24/outline';

interface DocumentPreviewProps {
  content: string;
  onEdit: () => void;
  onBack: () => void;
}

export default function DocumentPreview({ content, onEdit, onBack }: DocumentPreviewProps) {
  const [format, setFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch('/api/draft/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          format,
        }),
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center text-text-purple hover:text-text-light transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Templates
        </motion.button>

        <div className="flex items-center space-x-4">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'pdf' | 'docx' | 'txt')}
            className="bg-accent-violet/20 rounded-lg px-3 py-2 text-text-light"
          >
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="txt">TXT</option>
          </select>

          <motion.button
            onClick={handleDownload}
            disabled={isDownloading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center px-4 py-2 rounded-lg ${
              isDownloading 
                ? 'bg-accent-violet/50 cursor-not-allowed' 
                : 'bg-primary-violet hover:bg-accent-violet'
            } text-white transition-colors`}
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            {isDownloading ? 'Downloading...' : 'Download'}
          </motion.button>

          <motion.button
            onClick={onEdit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 rounded-lg border border-primary-violet text-primary-violet hover:bg-primary-violet/10 transition-colors"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit
          </motion.button>
        </div>
      </div>

      <div className="bg-accent-violet/10 rounded-lg p-6">
        <div className="prose prose-invert max-w-none">
          {content.split('\n').map((paragraph, index) => (
            <p key={index} className="text-text-light">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 