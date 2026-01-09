import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { updateReadingProgress } from './bookSlice';
import bookService from './bookService';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

function PDFReaderPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const book = useSelector((state) => 
    state.books.books.find(b => b.$id === bookId)
  );
  
  // Initialize plugins
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  
  useEffect(() => {
    if (book && book.pdfFileId) {
      loadPdf(book.pdfFileId);
      
      // Load last read page if exists
      if (book.lastReadPage) {
        setCurrentPage(book.lastReadPage);
      }
    } else if (!book) {
      // If book not in Redux, try to load it
      setError('Book not found in library');
      setIsLoading(false);
    } else {
      setError('This book has no PDF file');
      setIsLoading(false);
    }
  }, [book, bookId]);
  
  const loadPdf = async (fileId) => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('Loading PDF with fileId:', fileId);
      
      // 🚨 FIXED: Use getFileView() instead of getFilePreview()
      // getFileView() is for browser display, getFilePreview() is for image thumbnails
      const result = bookService.storage.getFileView(
        '694cdba10015e74ddd56', // Your PDF bucket ID
        fileId
      );
      
      console.log('PDF View URL:', result);
      
      // IMPORTANT: For @react-pdf-viewer, we need to ensure it's a string URL
      // Add CORS-friendly parameters if needed
      const finalUrl = typeof result === 'string' 
        ? result 
        : result.toString();
      
      // Test if the URL is accessible
      const testResponse = await fetch(finalUrl);
      if (!testResponse.ok) {
        throw new Error(`PDF access failed (Status: ${testResponse.status})`);
      }
      
      setPdfUrl(finalUrl);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error loading PDF:', error);
      
      // Fallback strategy: Try multiple URL methods
      try {
        console.log('Trying fallback methods...');
        
        // Try getFileDownload as fallback
        const fallbackUrl = bookService.storage.getFileDownload(
          '694cdba10015e74ddd56',
          fileId
        );
        
        console.log('Fallback download URL:', fallbackUrl);
        setPdfUrl(fallbackUrl);
        setError('Using download URL instead of view');
        
      } catch (fallbackError) {
        console.error('All URL methods failed:', fallbackError);
        setError('Failed to load PDF. Please check: 1) Bucket permissions 2) File exists 3) CORS settings');
      }
      
      setIsLoading(false);
    }
  };
  
  // Alternative: Use the bookService method if available
  const loadPdfAlternative = async (fileId) => {
    try {
      // If you've updated bookService.js with getPdfUrl() method
      if (bookService.getPdfUrl) {
        const url = bookService.getPdfUrl(fileId);
        setPdfUrl(url);
      } else {
        // Direct approach
        const url = bookService.storage.getFileView(
          '694cdba10015e74ddd56',
          fileId
        );
        setPdfUrl(url);
      }
    } catch (error) {
      console.error('Alternative load failed:', error);
    }
  };
  
  const handlePageChange = async (e) => {
    const newPage = e.currentPage;
    setCurrentPage(newPage);
    
    // Save reading progress
    if (book && newPage !== book.lastReadPage) {
      try {
        await dispatch(updateReadingProgress({
          bookId: book.$id,
          lastReadPage: newPage
        })).unwrap();
      } catch (error) {
        console.error('Error saving reading progress:', error);
      }
    }
  };
  
  // Debug: Check what's happening
  console.log('PDF Reader State:', {
    bookId,
    book: book ? 'Found' : 'Not found',
    pdfFileId: book?.pdfFileId,
    pdfUrl: pdfUrl ? 'Set' : 'Not set',
    isLoading,
    error,
    urlType: pdfUrl ? (pdfUrl.includes('preview') ? 'PREVIEW (wrong!)' : 'VIEW/DOWNLOAD (correct)') : 'none'
  });
  
  // Add a direct test button for troubleshooting
  const testDirectAccess = () => {
    if (pdfUrl) {
      console.log('Opening PDF in new tab:', pdfUrl);
      window.open(pdfUrl, '_blank');
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#8b5a2b] mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading PDF...</h3>
          <p className="text-gray-500">Preparing your reading experience</p>
          {book?.pdfFileId && (
            <p className="text-sm text-gray-400 mt-2">File ID: {book.pdfFileId}</p>
          )}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Couldn't Load PDF</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          
          {/* Debug info */}
          {book?.pdfFileId && (
            <div className="mb-4 p-3 bg-gray-100 rounded text-left">
              <p className="text-sm font-mono break-all">
                <strong>File ID:</strong> {book.pdfFileId}<br/>
                <strong>Bucket ID:</strong> 694cdba10015e74ddd56
              </p>
            </div>
          )}
          
          <div className="mt-6 space-y-3">
            <button
              onClick={() => navigate('/library')}
              className="w-full px-6 py-3 bg-[#8b5a2b] hover:bg-[#a67c52] text-white font-semibold rounded-lg transition-colors"
            >
              ← Back to Library
            </button>
            
            {book?.pdfFileId && (
              <button
                onClick={testDirectAccess}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Test Direct Access
              </button>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!pdfUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No PDF Available</h3>
          <p className="text-gray-600 mb-4">This book doesn't have a PDF file attached.</p>
          <button
            onClick={() => navigate('/library')}
            className="px-6 py-3 bg-[#8b5a2b] hover:bg-[#a67c52] text-white font-semibold rounded-lg transition-colors"
          >
            ← Back to Library
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Header */}
      <div className="bg-white shadow-lg px-6 py-4 sticky top-0 z-10 margin div-padding">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/library')}
              className="px-4 py-2 bg-[#8b5a2b] hover:bg-[#a67c52] text-white rounded-lg transition-colors flex items-center gap-2 h-15 back-btn"
            >
              <span>←</span> Back to Library
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 truncate max-w-md">{book?.title}</h1>
              <p className="text-gray-600 text-sm">by {book?.author}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-gray-700 font-medium">Page {currentPage}</div>
              {book?.lastReadPage > 0 && currentPage === book.lastReadPage && (
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <span>●</span> Resumed from here
                </div>
              )}
            </div>
            
            {/* Debug button */}
            <button
              onClick={testDirectAccess}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              title="Test PDF URL directly"
            >
              Test URL
            </button>
          </div>
        </div>
      </div>
      
      {/* PDF Viewer */}
      <div className="pdfs-div">
        <div className="border rounded-lg overflow-hidden shadow-2xl bg-white">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            <div
              style={{
                height: 'calc(100vh - 120px)',
                width: '100%',
              }}
            >
              <Viewer
                fileUrl={pdfUrl}
                plugins={[defaultLayoutPluginInstance]}
                defaultScale={1.0}
                onPageChange={handlePageChange}
                initialPage={book?.lastReadPage ? book.lastReadPage - 1 : 0}
                onDocumentLoad={(e) => {
                  console.log('PDF loaded successfully!', e);
                }}
                onDocumentLoadError={(e) => {
                  console.error('PDF failed to load in viewer:', e);
                  setError('PDF viewer cannot load this file format');
                }}
              />
            </div>
          </Worker>
        </div>
      </div>
    </div>
  );
}

export default PDFReaderPage;