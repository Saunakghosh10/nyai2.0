import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File | null;
}

export default function PDFViewer({ file }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF. Please try again.');
    setIsLoading(false);
  }

  if (!file) return null;

  return (
    <div className="pdf-viewer bg-accent-midnight/50 rounded-lg p-4 h-[600px] overflow-hidden">
      <div className="controls mb-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
          disabled={currentPage <= 1 || isLoading}
          className="bg-primary-violet px-4 py-2 rounded-lg text-white disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-text-light">
          {isLoading ? 'Loading...' : `Page ${currentPage} of ${numPages}`}
        </span>
        <button
          onClick={() => setCurrentPage(page => Math.min(numPages, page + 1))}
          disabled={currentPage >= numPages || isLoading}
          className="bg-primary-violet px-4 py-2 rounded-lg text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="document-container flex justify-center overflow-auto h-[calc(100%-4rem)]">
        {error ? (
          <div className="text-red-500 text-center mt-4">{error}</div>
        ) : (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin h-8 w-8 border-4 border-primary-violet border-t-transparent rounded-full"></div>
              </div>
            }
          >
            <Page
              pageNumber={currentPage}
              className="border border-accent-violet/20 rounded-lg overflow-hidden"
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={
                <div className="animate-pulse bg-accent-violet/20 h-[800px] w-[600px] rounded-lg"></div>
              }
            />
          </Document>
        )}
      </div>
    </div>
  );
} 