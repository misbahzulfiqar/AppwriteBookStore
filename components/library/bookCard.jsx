import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteBook, updateBook } from './bookSlice';

function BookCard({ book }) {
  const dispatch = useDispatch();

  const progress =
    book.totalPages && book.pagesRead
      ? Math.round((book.pagesRead / book.totalPages) * 100)
      : 0;

  const statusColors = {
    'want-to-read': 'bg-gray-100 text-gray-800',
    reading: 'bg-blue-100 text-blue-800',
    finished: 'bg-green-100 text-green-800',
  };

  const statusText = {
    'want-to-read': 'Want to Read',
    reading: 'Reading',
    finished: 'Finished',
  };

  const renderStars = () =>
    [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={i < book.rating ? 'text-yellow-500' : 'text-gray-300'}
      >
        ★
      </span>
    ));

  const handleStatusChange = async (status) => {
    try {
      await dispatch(
        updateBook({
          bookId: book.$id,
          bookData: { status },
        })
      ).unwrap();
    } catch (error) {
      alert('Failed to update book status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await dispatch(deleteBook(book.$id)).unwrap();
    } catch (error) {
      alert('Failed to delete book');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition">
      <div className="h-48 bg-gradient-to-br from-[#8b5a2b] to-[#a67c52] relative flex items-center justify-center text-white">
        <div className="text-center px-4">
          <div className="text-4xl mb-2">📚</div>
          <div className="font-bold text-lg truncate">{book.title}</div>
          <div className="text-sm">{book.author}</div>
        </div>

        <span
          className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ${statusColors[book.status]}`}
        >
          {statusText[book.status]}
        </span>

        {book.rating > 0 && (
          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded">
            {renderStars()}
          </div>
        )}
      </div>

      <div className="p-4">
        {book.description && (
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
            {book.description}
          </p>
        )}

        {book.status === 'reading' && book.totalPages && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1 text-gray-600">
              <span>
                {book.pagesRead || 0}/{book.totalPages}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded">
              <div
                className="bg-[#8b5a2b] h-2 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {book.status !== 'reading' && (
            <button
              onClick={() => handleStatusChange('reading')}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
            >
              Start Reading
            </button>
          )}

          {book.status !== 'finished' && (
            <button
              onClick={() => handleStatusChange('finished')}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
            >
              Mark as Read
            </button>
          )}

          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
