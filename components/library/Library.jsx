import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BookList from './bookList';
import BookUploadForm from './BookUploadForm';
import ReadingStats from './ReadingStats';
import { getUserBooks } from './bookSlice';

function Library() {
  const dispatch = useDispatch();
  
  const { books = [], isLoading = false } = useSelector((state) => state.books || {});

  // Load books on component mount
  useEffect(() => {
    dispatch(getUserBooks());
  }, [dispatch]);

  // Loading state for books
  if (isLoading && books.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8f4f0] to-white py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b5a2b] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your library...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="inner-div space">
        
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2 margin">📚 My Personal Library</h1>
            <p className="text-gray-600 text-2xl margin">
              Manage your book collection, track reading progress, and discover new favorites.
            </p>
          </div>
          
          {/* Add Book Button */}
          <div>
            <BookUploadForm />
          </div>
        </div>

        {/* Statistics */}
        {books.length > 0 && (
          <div className="mb-8">
            <ReadingStats books={books} />
          </div>
        )}

        {/* Book List Grid */}
        <div className="mb-8">
          {books.length > 0 ? (
            <BookList books={books} />
          ) : (
            // Empty State
            <div className="text-center py-12 bg-white rounded-2xl">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Ready to start your reading journey?</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your personal library is waiting! Upload PDF books, track your reading progress, 
                and pick up right where you left off.
              </p>
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-4">
                  Click "Add New Book" above to upload your first PDF!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Bar - Only show if there are books */}
        {books.length > 0 && (
          <div className="bg-white rounded-xl p-6 lib-summary">
            <h3 className="text-3xl font-semibold text-gray-800 mb-4 margin">Library Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 margin">
              <div className="text-center p-4 bg-blue-100 rounded-lg h-40">
                <div className="text-5xl font-bold text-blue-700 margin-sp">{books.length}</div>
                <div className="text-xl text-blue-600">Total Books</div>
              </div>
              <div className="text-center p-4 bg-green-100 rounded-lg">
                <div className="text-5xl font-bold text-green-700 margin-sp">
                  {books.filter(b => b.status === 'reading').length}
                </div>
                <div className="text-xl text-green-600">Currently Reading</div>
              </div>
              <div className="text-center p-4 bg-purple-100 rounded-lg">
                <div className="text-5xl font-bold text-purple-700 margin-sp">
                  {books.filter(b => b.status === 'finished').length}
                </div>
                <div className="text-xl text-purple-600">Finished</div>
              </div>
              <div className="text-center p-4 bg-yellow-100 rounded-lg">
                <div className="text-5xl font-bold text-yellow-700 margin-sp">
                  {books.filter(b => b.lastReadPage > 0).length}
                </div>
                <div className="text-xl text-yellow-600">Have Reading Progress</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Library;