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
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header with search and filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 margin mar-bottom">
          My Books ({books.length})
        </h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5a2b] focus:border-transparent w-full md:w-64"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all' ? 'bg-[#8b5a2b] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('want-to-read')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'want-to-read' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Want to Read
            </button>
            <button
              onClick={() => setFilter('reading')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'reading' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Reading
            </button>
            <button
              onClick={() => setFilter('finished')}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === 'finished' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Finished
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-sm text-gray-600">
        Showing {filteredBooks.length} of {books.length} books
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No books found</h3>
          <p className="text-gray-500">Try changing your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.$id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookList;