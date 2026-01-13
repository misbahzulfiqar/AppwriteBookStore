
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import bookService from './bookService';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

function PDFReaderPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  
  useEffect(() => {
    const fetchBookAndPDF = async () => {
      console.log('🚀 START: Fetching book and PDF for ID:', bookId);
      
      try {
        setIsLoading(true);
        setError('');
        
        // 1. FETCH BOOK DATA
        console.log('📖 Step 1: Fetching book data...');
        const bookData = await bookService.getBookById(bookId);
        
        if (!bookData) {
          throw new Error('Book not found');
        }
        
        console.log('✅ Book data loaded:', {
          title: bookData.title,
          pdfFileId: bookData.pdfFileId,
          hasPdfFileId: !!bookData.pdfFileId
        });
        
        if (!bookData.pdfFileId) {
          throw new Error('This book has no PDF file');
        }
        
        setBook(bookData);
        
        // 2. GENERATE PDF URL
        console.log('📄 Step 2: Generating PDF URL...');
        const pdfUrlResult = bookService.getPdfUrl(bookData.pdfFileId);
        console.log('🔗 Generated PDF URL:', pdfUrlResult);
        
        if (!pdfUrlResult) {
          throw new Error('Failed to generate PDF URL');
        }
        
        // 3. TEST PDF URL
        console.log('🧪 Step 3: Testing PDF URL accessibility...');
        try {
          const testResponse = await fetch(pdfUrlResult);
          console.log('✅ PDF URL test result:', {
            ok: testResponse.ok,
            status: testResponse.status,
            statusText: testResponse.statusText
          });
          
          if (!testResponse.ok) {
            console.log('⚠️ PDF URL failed, trying alternative...');
            
            // Try alternative URL
            const alternativeUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/694cdba10015e74ddd56/files/${bookData.pdfFileId}/view?project=694bc436001e80f4822d&timestamp=${Date.now()}`;
            console.log('🔄 Alternative URL:', alternativeUrl);
            
            const altTest = await fetch(alternativeUrl);
            if (altTest.ok) {
              console.log('✅ Alternative URL works!');
              setPdfUrl(alternativeUrl);
              setIsLoading(false);
              return;
            }
            
            throw new Error(`PDF not accessible (Status: ${testResponse.status})`);
          }
          
          // 4. SET PDF URL
          console.log('🎯 Step 4: Setting PDF URL for viewer...');
          setPdfUrl(pdfUrlResult);
          setIsLoading(false);
          
        } catch (urlError) {
          console.error('❌ PDF URL test failed:', urlError);
          
          // Try one more time with different method
          try {
            const directUrl = bookService.storage.getFileDownload(
              '694cdba10015e74ddd56',
              bookData.pdfFileId
            );
            console.log('🔄 Trying download URL:', directUrl);
            
            const downloadTest = await fetch(directUrl);
            if (downloadTest.ok) {
              setPdfUrl(directUrl);
              setError('Using download URL (view URL failed)');
            } else {
              throw new Error('All URL methods failed');
            }
          } catch (finalError) {
            throw new Error(`PDF cannot be loaded. Please check: 1) Bucket permissions 2) File exists`);
          }
          
          setIsLoading(false);
        }
        
      } catch (error) {
        console.error('❌ CRITICAL ERROR:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };
    
    if (bookId) {
      fetchBookAndPDF();
    }
  }, [bookId]);
  
  // DEBUG: Check what's happening
  console.log('📊 CURRENT STATE:', {
    bookId,
    bookTitle: book?.title,
    pdfFileId: book?.pdfFileId,
    pdfUrl: pdfUrl ? '✅ Set' : '❌ Not set',
    isLoading,
    error
  });
  
  // OPEN PDF IN NEW TAB
  const openInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading PDF...</h3>
          <p className="text-gray-500">Book: {book?.title || 'Loading...'}</p>
          <p className="text-sm text-gray-400 mt-2">Checking PDF availability...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
          <div className="text-5xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-red-700 mb-2">PDF Loading Failed</h3>
          <p className="text-red-600 mb-4">{error}</p>
          
          <div className="mb-4 p-3 bg-gray-100 rounded text-left">
            <p className="text-sm">
              <strong>Book:</strong> {book?.title || 'Unknown'}<br/>
              <strong>PDF File ID:</strong> {book?.pdfFileId || 'None'}<br/>
              <strong>Issue:</strong> PDF file permissions or missing file
            </p>
          </div>
          
          <div className="mt-6 space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
            >
              ← Go Back
            </button>
            
            {book?.pdfFileId && (
              <button
                onClick={openInNewTab}
                className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
              >
                Try Direct Access
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Header */}
      <div className="bg-white shadow-lg px-6 py-4 sticky top-0 z-10 pdfs-div">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-[#8b5a2b] hover:bg-blue-600 text-white rounded-lg h-13 w-30"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{book?.title}</h1>
              <p className="text-gray-600 text-sm">by {book?.author}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={openInNewTab}
              className="px-4 py-2 bg-[#8b5a2b] hover:bg-green-600 text-white rounded-lg h-13 w-40"
            >
              Open in New Tab
            </button>
          </div>
        </div>
      </div>
      
      {/* PDF Viewer */}
      <div className="h-screen">
        <div className="h-full">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            <div style={{ height: 'calc(100vh - 100px)' }}>
              <Viewer
                fileUrl={pdfUrl}
                plugins={[defaultLayoutPluginInstance]}
                onDocumentLoad={() => console.log('✅ PDF loaded successfully!')}
                onDocumentLoadError={(e) => {
                  console.error('❌ PDF viewer error:', e);
                  setError('PDF viewer cannot load this file. Try opening in new tab.');
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