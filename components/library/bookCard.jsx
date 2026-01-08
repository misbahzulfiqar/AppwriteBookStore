import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateBook, deleteBook } from './bookSlice';
import { storage } from '../../appwrite/auth/Client';
import { ID } from 'appwrite';

function BookCard({ book, onCoverUpdate, isEditable = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const BUCKET_ID = '694cdba10015e74ddd56';

  // Get cover image URL
useEffect(() => {
  setImageUrl(book.coverImageUrl || null);
}, [book.coverImageUrl]);
  const progress = book.totalPages && book.pagesRead 
    ? Math.round((parseInt(book.pagesRead) / parseInt(book.totalPages)) * 100)
    : 0;

  const statusColors = {
    'want-to-read': 'bg-gray-100 text-gray-800',
    'reading': 'bg-blue-100 text-blue-800',
    'finished': 'bg-green-100 text-green-800',
  };

  const statusText = {
    'want-to-read': 'Want to Read',
    'reading': 'Reading',
    'finished': 'Finished',
  };

  const renderStars = () => {
    return [...Array(5)].map((_, i) => (
      <span 
        key={i} 
        className={`text-sm ${i < book.rating ? 'text-yellow-500' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    setUploading(true);
    
    try {
      const fileId = ID.unique();
      
      await storage.createFile(
        BUCKET_ID,
        fileId,
        file
      );
      
      await dispatch(updateBook({
        bookId: book.$id,
        updates: { coverImageId: fileId }
      })).unwrap();
      
      const newUrl = storage.getFileView(BUCKET_ID, fileId);
      setImageUrl(newUrl);
      
      if (onCoverUpdate) {
        onCoverUpdate(book.$id, fileId);
      }
      
      alert('Cover image updated');
    } catch (error) {
      alert('Failed to upload: ' + error.message);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleReadClick = () => {
    navigate(`/reader/${book.$id}`);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await dispatch(updateBook({
        bookId: book.$id,
        updates: { status: newStatus }
      })).unwrap();
    } catch (error) {
      alert('Failed to update status: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await dispatch(deleteBook(book.$id)).unwrap();
      } catch (error) {
        alert('Failed to delete book: ' + error.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div 
        className="h-48 relative cursor-pointer overflow-hidden group"
        onClick={handleReadClick}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-[#8b5a2b] to-[#a67c52] flex flex-col items-center justify-center text-white">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-center px-4">
              <div className="font-bold text-lg truncate">{book.title}</div>
              <div className="text-sm opacity-90">{book.author}</div>
              <div className="mt-2 text-xs bg-black/30 px-2 py-1 rounded">
                {isEditable ? 'Click to add cover' : 'No cover'}
              </div>
            </div>
          </div>
        )}
        
        {isEditable && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <label 
              className={`px-4 py-2 bg-white text-gray-800 rounded-lg cursor-pointer font-medium shadow-lg ${uploading ? 'opacity-50' : 'hover:bg-gray-100 hover:scale-105'}`}
              htmlFor={`cover-upload-${book.$id}`}
            >
              {uploading ? 'Uploading...' : imageUrl ? 'Change Cover' : 'Add Cover'}
            </label>
            <input
              type="file"
              id={`cover-upload-${book.$id}`}
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </div>
        )}
        
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[book.status]} backdrop-blur-sm bg-white/70 shadow-sm`}>
            {statusText[book.status]}
          </span>
        </div>

        {book.rating > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm">
            <div className="flex items-center gap-1">
              {renderStars()}
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 
          className="font-bold text-lg text-gray-800 truncate cursor-pointer hover:text-[#8b5a2b]"
          onClick={handleReadClick}
          title={book.title}
        >
          {book.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2">by {book.author}</p>

        {book.description && (
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
            {book.description}
          </p>
        )}

        {book.status === 'reading' && book.totalPages && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress: {book.pagesRead || 0}/{book.totalPages} pages</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#8b5a2b] h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {book.lastReadPage > 0 && (
          <div className="mb-3">
            <button
              onClick={handleReadClick}
              className="w-full px-3 py-2 bg-[#8b5a2b] hover:bg-[#a67c52] text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2"
            >
              <span>▶️</span>
              Resume from Page {book.lastReadPage}
            </button>
          </div>
        )}

        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <div>
            {book.totalPages ? `${book.totalPages} pages` : 'Unknown pages'}
          </div>
          {book.rating > 0 && (
            <div>
              {book.rating}/5 ★
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleReadClick}
            className="flex-1 min-w-[120px] px-3 py-2 bg-[#8b5a2b] hover:bg-[#a67c52] text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2"
          >
            <span>📖</span>
            {book.lastReadPage > 0 ? 'Continue Reading' : 'Read Now'}
          </button>
          
          <div className="flex gap-2">
            {book.status !== 'reading' && (
              <button
                onClick={() => handleStatusChange('reading')}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg"
              >
                Start
              </button>
            )}
            
            {book.status !== 'finished' && (
              <button
                onClick={() => handleStatusChange('finished')}
                className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg"
              >
                Done
              </button>
            )}

            <button
              onClick={handleDelete}
              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg"
              title="Delete Book"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookCard;