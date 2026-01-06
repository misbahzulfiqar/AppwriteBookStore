import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BookList from './bookList';
import BookUploadForm from './BookUploadForm';
import ReadingStats from './readingStatus';
import { getUserBooks } from './bookSlice';

function Library() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { books = [], isLoading = false } = useSelector((state) => state.books || {});
  const authStatus = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.userData);

  // Redirect if not logged in
  useEffect(() => {
    if (!authStatus) {
      navigate('/login');
    }
  }, [authStatus, navigate]);

  // Load books when user is available
  useEffect(() => {
    if (user) {
      dispatch(getUserBooks(user.$id));
    }
  }, [dispatch, user]);

  if (!authStatus) return null; // Will redirect

  // Loading state
  if (isLoading && books.length === 0) {
    return (
      <div className="library-page">
        <div className="library-container">
          <div className="loading-wrapper">
            <div className="spinner"></div>
            <p className="loading-text">Loading your library...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="library-page">
      <div className="library-container">
        {/* Page Header */}
        <div className="library-header">
          <h1 className="library-title">📚 My Personal Library</h1>
          <p className="library-subtitle text-3xl">
            Manage your book collection, track reading progress, and discover new favorites.
          </p>
        </div>

        {/* Statistics */}
        {books.length > 0 && <ReadingStats books={books} />}

        {/* Add Book Form */}
        <BookUploadForm />

        {/* Book List */}
        {books.length > 0 ? (
          <BookList books={books} />
        ) : (
          // Empty State
          <div className="empty-state-wrapper">
            <div className="empty-state-box">
              <div className="empty-icon">📖</div>
              <h3 className="empty-title">Ready to start your reading journey?</h3>
              <p className="empty-text">
                Your personal library is waiting! Add books you want to read, track your progress, and celebrate your reading achievements.
              </p>
              <button
                onClick={() => document.querySelector('button')?.click()}
                className="empty-button"
              >
                Add Your First Book
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Library;
