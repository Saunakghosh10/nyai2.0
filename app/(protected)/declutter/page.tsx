"use client";

import { motion } from "framer-motion";
import { useState, useCallback, useRef, useEffect } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import ChatInterface from "@/components/declutter/ChatInterface";
import SimplePDFViewer from "@/components/declutter/SimplePDFViewer";
import { validateFile } from '@/utils/fileProcessing';
import { toast } from 'react-hot-toast';
import { pdfjs } from 'react-pdf';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function DeclutterPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [documentContent, setDocumentContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // Add useEffect to fetch existing document
  useEffect(() => {
    const fetchExistingDocument = async () => {
      try {
        const response = await fetch('/api/declutter/document');
        const data = await response.json();
        
        if (data.document) {
          setDocumentContent(data.document.content || '');
          setDocumentId(data.document.id);
          setFileUrl(data.document.fileUrl);
          
          if (data.document.fileUrl) {
            const response = await fetch(data.document.fileUrl);
            const blob = await response.blob();
            const file = new File([blob], data.document.name, { 
              type: data.document.fileType 
            });
            setFile(file);
          }
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        toast.error('Failed to load document');
      }
    };

    fetchExistingDocument();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFileType(droppedFile)) {
      await processFile(droppedFile);
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFileType(selectedFile)) {
      await processFile(selectedFile);
    }
  }, []);

  const isValidFileType = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    return validTypes.includes(file.type);
  };

  const processFile = async (file: File) => {
    try {
      setIsLoading(true);
      setUploadProgress(0);
      
      if (!file || !validateFile(file)) {
        toast.error('Invalid file type');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/declutter/document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();

      setFile(file);
      setDocumentContent(data.content || '');
      setDocumentId(data.documentId);
      setFileUrl(data.fileUrl);
      toast.success('File processed successfully!');

    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to process file');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const resetFile = async () => {
    try {
      if (documentId) {
        await fetch(`/api/declutter/document/${documentId}`, {
          method: 'DELETE',
        });
      }
      setFile(null);
      setDocumentContent("");
      setDocumentId(null);
    } catch (error) {
      console.error('Error resetting file:', error);
      toast.error('Failed to reset file');
    }
  };

  // Create a reference for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add this function to handle div click
  const handleDivClick = () => {
    fileInputRef.current?.click();
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
            Document Declutter
          </motion.h1>
          <motion.p
            className="text-text-purple text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Upload your document and let AI simplify it for you
          </motion.p>
        </div>

        {!file ? (
          <motion.div
            className={`max-w-3xl mx-auto p-12 rounded-lg border-2 border-dashed ${
              isDragging ? "border-primary-violet" : "border-accent-violet/30"
            } bg-accent-midnight/50 backdrop-blur-sm transition-colors relative cursor-pointer`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={handleDivClick}
          >
            {isLoading && (
              <div className="absolute inset-0 bg-accent-midnight/80 flex flex-col items-center justify-center">
                <div className="w-full max-w-xs bg-accent-violet/20 rounded-full h-4 mb-4">
                  <div 
                    className="bg-primary-violet h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-text-light">Processing file... {uploadProgress}%</p>
              </div>
            )}
            <div className="text-center">
              <FiUpload className="mx-auto h-12 w-12 text-text-purple" />
              <p className="mt-4 text-text-light">
                Drag and drop your document here, or{" "}
                <span className="text-primary-violet hover:text-accent-violet transition-colors cursor-pointer">
                  browse
                </span>
              </p>
              <p className="mt-2 text-sm text-text-purple">
                Supports PDF, DOCX, and TXT files up to 10MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
              />
            </div>
          </motion.div>
        ) : (
          <div className="max-w-full mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-text-light">{file.name}</span>
                {isLoading && (
                  <div className="animate-spin h-5 w-5 border-2 border-primary-violet border-t-transparent rounded-full" />
                )}
              </div>
              <button
                onClick={resetFile}
                className="text-text-purple hover:text-text-light transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="order-2 lg:order-1">
                <SimplePDFViewer file={file} />
              </div>
              <div className="order-1 lg:order-2">
                <ChatInterface documentContent={documentContent} />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
} 