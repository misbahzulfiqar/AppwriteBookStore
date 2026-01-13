import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBook } from './bookSlice';
import { storage } from '../../appwrite/auth/Client';
import { ID } from 'appwrite';

function BookUploadForm() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.books);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    status: 'want-to-read',
    pagesRead: '',
    totalPages: '',
    rating: '0',
    coverImageId: '',
    isPublic: true,
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);

  const BUCKET_ID = '694cdba10015e74ddd56';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSubmitError('');
  };

const handleCoverUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file (JPG, PNG, GIF, WebP)');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('Image size should be less than 5MB');
    return;
  }

  // Show preview in the browser
  const previewUrl = URL.createObjectURL(file);
  setCoverPreview(previewUrl);

  // Store the file in state, but DO NOT upload yet
  setCoverImageFile(file);

  // Clear previous coverImageId in formData
  setFormData(prev => ({ ...prev, coverImageId: '' }));
};


  const handlePdfChange = (e) => {
    if (e.target.files[0]?.type === 'application/pdf') {
      setPdfFile(e.target.files[0]);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleRating = (star) => {
    setFormData((prev) => ({ ...prev, rating: star.toString() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!pdfFile) {
      setSubmitError('Please select a PDF file');
      return;
    }

    let coverImageId = null;

      if (coverImageFile) {
        const fileId = ID.unique();
        const uploadedCover = await storage.createFile(BUCKET_ID, fileId, coverImageFile);
        coverImageId = uploadedCover.$id;
      }


          try {
    const bookData = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      description: formData.description ? formData.description.trim() : '',
      status: formData.status,
      pagesRead: formData.pagesRead ? parseInt(formData.pagesRead) : 0,
      totalPages: formData.totalPages ? parseInt(formData.totalPages) : 0,
      rating: formData.rating ? parseInt(formData.rating) : 0,
      coverImageId: coverImageId, // <- uploaded on submit
      isPublic: formData.isPublic || false,
    };


      console.log("Sending to Appwrite:", bookData);


      console.log('Submitting book:', { 
        bookData, 
        pdfFile,
        hasCover: !!formData.coverImageId,
        coverImageId: formData.coverImageId,
        isPublic: true,
      });

      await dispatch(createBook({ 
        bookData, 
        pdfFile,
        coverImageFile
      })).unwrap();

      setFormData({
        title: '',
        author: '',
        description: '',
        status: 'want-to-read',
        pagesRead: '',
        totalPages: '',
        rating: '0',
        coverImageId: '',
      });
      setPdfFile(null);
      setCoverImageFile(null);
      setCoverPreview(null);
      setShowForm(false);
      setSubmitError('');

      alert('Book added successfully with cover image!');
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError('Error: ' + (error.message || 'Something went wrong'));
    }
  };

  const removeCoverImage = () => {
    setCoverPreview(null);
    setCoverImageFile(null);
    setFormData(prev => ({ ...prev, coverImageId: '' }));
  };

  return (
    <div className="">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-40 h-15 bg-[#8b5a2b] hover:bg-[#a67c52] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <span>+</span>
          Add New Book
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-lg form-container p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Book</h2>
            <button
              onClick={() => {
                setShowForm(false);
                setSubmitError('');
              }}
              className="text-gray-500 hover:text-gray-700 text-3xl"
            >
              &times;
            </button>
          </div>

          {submitError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SINGLE UPLOAD AREA */}
            <div className="mb-8">
              <label className="block text-xl font-medium text-gray-700 mb-4">
                Book Cover Image
              </label>
              
              {coverPreview ? (
                <div className="relative bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-700">Cover Preview</h3>
                    <button
                      type="button"
                      onClick={removeCoverImage}
                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center justify-center">
                    <img 
                      src={coverPreview} 
                      alt="Book cover preview" 
                      className="max-h-48 object-contain rounded-lg shadow-md"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-gray-200 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#8b5a2b] transition-colors div-padding margin h-60 text-centerr">
                  <input
                    type="file"
                    id="cover-upload"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={uploadingCover}
                    className="hidden"
                  />
                  <label
                    htmlFor="cover-upload"
                    className={`flex flex-col items-center justify-center cursor-pointer ${uploadingCover ? 'opacity-50' : ''}`}
                  >
                    {uploadingCover ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b5a2b] mb-4"></div>
                        <p className="text-gray-600">Uploading cover..</p>
                      </div>
                    ) : (
                      <>
                        <div className="text-4xl text-[#1b1209] mb-4">⬆</div>
                        <p className="text-xl font-medium text-gray-800 mb-2">
                          Upload Cover Image
                        </p>
                        <p className="text-gray-600 mb-3 text-center">
                          Click to upload JPG, PNG, GIF or WebP
                        </p>
                        <p className="text-sm text-gray-500">
                          Recommended: 300×450px • Max 5MB
                        </p>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* Book Details Section */}
            <div className="space-y-6 margin">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className='margin'>
                  <label className="block text-xl font-medium text-gray-700 mb-2">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-1 focus:ring-[#a4a4a3] focus:border-transparent margin"
                    placeholder="Enter book title"
                  />
                </div>

                <div className='margin'>
                  <label className="block text-xl font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#a4a4a3] focus:border-transparent margin"
                    placeholder="Enter author name"
                  />
                </div>
              </div>

              <div className='margin'>
                <label className="block text-xl font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#a4a4a3] focus:border-transparent bg-gray-50 margin"
                  placeholder="Brief description about the book"
                />
              </div>

              <div className='margin'>
                <label className="block text-xl font-medium text-gray-700 mb-2">
                  PDF File *
                </label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#8b5a2b] file:text-white hover:file:bg-[#a67c52] margin"
                />
                {pdfFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    ✅ Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 margin">
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-2">
                    Reading Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#a4a4a3] focus:border-transparent margin"
                  >
                    <option value="want-to-read">Want to Read</option>
                    <option value="reading">Currently Reading</option>
                    <option value="finished">Finished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-2">
                    Total Pages
                  </label>
                  <input
                    type="number"
                    name="totalPages"
                    value={formData.totalPages}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#a4a4a3] focus:border-transparent margin"
                    placeholder="e.g., 320"
                  />
                </div>

                {formData.status === 'reading' && (
                  <div className='margin'>
                    <label className="block text-xl font-medium text-gray-700 mb-2">
                      Pages Read
                    </label>
                    <input
                      type="number"
                      name="pagesRead"
                      value={formData.pagesRead}
                      onChange={handleChange}
                      min="0"
                      max={formData.totalPages || undefined}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#a4a4a3] focus:border-transparent"
                      placeholder="e.g., 150"
                    />
                  </div>
                )}
              </div>

              <div className='margin'>
                <label className="block text-xl font-medium text-gray-700 mb-2">
                  Rating (1-5)
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRating(star)}
                      className={`text-3xl transition-transform hover:scale-110 ${
                        star <= parseInt(formData.rating) ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-3 text-gray-600">
                    {formData.rating} star{formData.rating !== '1' ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="bg-[#f5e8f4] p-4 rounded-lg div-padding margin">
                <h3 className="font-medium text-2xl mb-2"> Book Summary</h3>
                <ul className="text-md text-gray-600 space-y-1 margin">
                  <li>• Title: {formData.title || 'Not set'}</li>
                  <li>• Author: {formData.author || 'Not set'}</li>
                  <li>• Status: {formData.status === 'want-to-read' ? 'Want to Read' : 
                                formData.status === 'reading' ? 'Reading' : 'Finished'}</li>
                  <li>• Cover: {coverPreview ? '✅ Uploaded' : '❌ Not uploaded'}</li>
                  <li>• PDF: {pdfFile ? `✅ ${pdfFile.name}` : '❌ Not selected'}</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 margin">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSubmitError('');
                }}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 rounded-lg transition-colors h-10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || uploadingCover}
                className="flex-1 px-8 py-3 bg-[#8b5a2b] hover:bg-[#a67c52] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding Book...
                  </>
                ) : (
                  'Add to Library'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default BookUploadForm;