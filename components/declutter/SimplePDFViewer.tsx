"use client";

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from 'react-hot-toast';

interface SimplePDFViewerProps {
  file: File | null;
}

export default function SimplePDFViewer({ file }: SimplePDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    toast.error('Failed to load PDF. Please try again.');
  };

  if (!file) return null;

  return (
    <div className="pdf-viewer">
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin h-8 w-8 border-2 border-primary-violet border-t-transparent rounded-full" />
          </div>
        }
      >
        <Page pageNumber={pageNumber} />
      </Document>
      {numPages && (
        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-primary-violet text-white rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="py-2">
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
            disabled={pageNumber >= numPages}
            className="px-4 py-2 bg-primary-violet text-white rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 