import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBook } from './bookSlice';

function BookUploadForm() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.books);
  const user = useSelector((state) => state.auth.userData);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    status: 'want-to-read',
    pagesRead: '',
    totalPages: '',
    rating: 0,
  });

  const [coverImage, setCoverImage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare book data with user ID (if available)
      const bookData = {
        ...formData,
        userId: user?.$id || null,
        pagesRead: formData.pagesRead ? parseInt(formData.pagesRead) : 0,
        totalPages: formData.totalPages ? parseInt(formData.totalPages) : 0,
        rating: parseInt(formData.rating),
      };

      await dispatch(createBook(bookData)).unwrap();

      // Reset form
      setFormData({
        title: '',
        author: '',
        description: '',
        status: 'want-to-read',
        pagesRead: '',
        totalPages: '',
        rating: 0,
      });
      setCoverImage(null);
      setShowForm(false);

      alert('Book added successfully!');
    } catch (error) {
      alert('Failed to add book: ' + error.message);
    }
  };

  return (
    <div className="mb-8">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full md:w-auto bg-[#8b5a2b] hover:bg-[#a67c52] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <span>+</span>
          Add New Book
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📖 Add New Book</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5a2b] focus:border-transparent"
                  placeholder="Enter book title"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5a2b] focus:border-transparent"
                  placeholder="Enter author name"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5a2b] focus:border-transparent"
                placeholder="Brief description about the book"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reading Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5a2b] focus:border-transparent"
                >
                  <option value="want-to-read">Want to Read</option>
                  <option value="reading">Currently Reading</option>
                  <option value="finished">Finished Reading</option>
                </select>
              </div>

              {/* Pages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pages Read
                </label>
                <input
                  type="number"
                  name="pagesRead"
                  value={formData.pagesRead}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5a2b] focus:border-transparent"
                  placeholder="e.g., 120"
                />
              </div>

              {/* Total Pages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Pages
                </label>
                <input
                  type="number"
                  name="totalPages"
                  value={formData.totalPages}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5a2b] focus:border-transparent"
                  placeholder="e.g., 300"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (1-5)
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleChange({ target: { name: 'rating', value: star } })}
                    className={`text-2xl ${star <= formData.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#8b5a2b] file:text-white hover:file:bg-[#a67c52]"
              />
              {coverImage && (
                <p className="mt-2 text-sm text-gray-600">Selected: {coverImage.name}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#8b5a2b] hover:bg-[#a67c52] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Adding...' : 'Add to Library'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default BookUploadForm;
