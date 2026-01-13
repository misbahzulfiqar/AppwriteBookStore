import React, { useEffect, useState } from 'react';
import BookList from './bookList';
import bookService from './bookService';

const PublicBookListWrapper = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicBooks = async () => {
      try {
        // Use bookService which adds URLs to books
        const response = await bookService.getPublicBooks();
        
        console.log("PUBLIC BOOKS WITH URLS:", response);
        console.log("DOCUMENTS COUNT:", response.documents?.length || 0);
        
        // Check if books have coverImageUrl
        if (response.documents && response.documents.length > 0) {
          const firstBook = response.documents[0];
          console.log("FIRST BOOK DATA:", {
            id: firstBook.$id,
            title: firstBook.title,
            coverImageId: firstBook.coverImageId,
            coverImageUrl: firstBook.coverImageUrl, // This should exist
            pdfFileId: firstBook.pdfFileId,
            pdfUrl: firstBook.pdfUrl // This should exist
          });
        }
        
        // Pass the documents array (with URLs) to BookList
        setBooks(response.documents || []);
      } catch (error) {
        console.error('Failed to fetch public books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicBooks();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading books...</div>;
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">No public books available</h2>
        <p className="text-gray-600">Check if books have "isPublic: true" in database</p>
      </div>
    );
  }

  return <BookList books={books} />;
};

export default PublicBookListWrapper;