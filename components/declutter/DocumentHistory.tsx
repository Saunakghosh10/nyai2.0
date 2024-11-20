"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DocumentHistory } from "@/utils/db/documentHistory";
import { FiClock, FiFile, FiDownload } from "react-icons/fi";
import { exportToPDF, exportToTXT } from "@/utils/exportUtils";
import { trackEvent } from "@/utils/analytics";

export default function DocumentHistory() {
  const [history, setHistory] = useState<DocumentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history');
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (doc: DocumentHistory, format: 'pdf' | 'txt') => {
    try {
      if (format === 'pdf') {
        await exportToPDF(doc.processedContent, `${doc.fileName}-${format}`);
      } else {
        await exportToTXT(doc.processedContent, `${doc.fileName}-${format}`);
      }
      trackEvent('document_exported', { format, documentId: doc._id });
    } catch (error) {
      console.error('Error exporting document:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-accent-midnight/50 backdrop-blur-sm rounded-lg border border-accent-violet/20 p-6"
    >
      <h2 className="text-xl font-semibold text-text-light mb-4">Recent Documents</h2>
      
      {isLoading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin h-8 w-8 border-2 border-primary-violet border-t-transparent rounded-full" />
        </div>
      ) : history.length === 0 ? (
        <p className="text-text-purple text-center py-4">No documents processed yet</p>
      ) : (
        <div className="space-y-4">
          {history.map((doc) => (
            <motion.div
              key={doc._id?.toString()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-accent-midnight rounded-lg p-4 border border-accent-violet/10"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-text-light font-medium">{doc.fileName}</h3>
                  <div className="flex items-center text-sm text-text-purple mt-1">
                    <FiClock className="mr-1" />
                    {format(new Date(doc.timestamp), 'PPp')}
                  </div>
                  <div className="flex items-center text-sm text-text-purple mt-1">
                    <FiFile className="mr-1" />
                    {doc.fileType} - {doc.wordCount} words
                  </div>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleExport(doc, 'pdf')}
                    className="p-2 rounded-lg bg-primary-violet/10 text-primary-violet hover:bg-primary-violet/20"
                  >
                    <FiDownload className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
} 