import React, { useState } from 'react';
import BookCard from './bookCard';

function BookList({ books = [] }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter books based on selected filter and search term
  const filteredBooks = books.filter(book => {
    // Apply status filter
    const statusMatch = filter === 'all' || book.status === filter;
    
    // Apply search filter (title or author)
    const searchMatch = !searchTerm || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // Empty state message
  if (books.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow">
        <div className="text-5xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Your library is empty</h3>
        <p className="text-gray-500">Add your first book to start building your collection!</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 margin">My Book Library</h1>
      
      {/* Grid container with 3 cards per line and generous spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 margin">
        {books.map((book) => (
          <BookCard 
            key={book.$id}
            book={book} 
            isEditable={true} 
          />
        ))}
      </div>
      
      {/* If no books */}
      {books.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No books yet</h3>
          <p className="text-gray-600">Add your first book to get started!</p>
        </div>
      )}
    </div>
  );
}

export default BookList;

