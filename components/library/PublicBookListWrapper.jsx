import React, { useEffect, useState } from 'react';
import { databases, Query } from '../../appwrite/auth/Client'; // adjust path
import BookList from './bookList';

const DATABASE_ID = '695cde3a000e703c00a8';
const COLLECTION_ID = '694cdba10015e74ddd57';

const PublicBookListWrapper = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicBooks = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [
            Query.equal('isPublic', true)
          ]
        );
        console.log("PUBLIC BOOKS RESPONSE:", response);
        console.log("DOCUMENTS:", response.documents);
        console.log("ALL BOOKS:", response.documents);

        setBooks(response.documents);
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

  return <BookList books={books} />;
};

export default PublicBookListWrapper;
