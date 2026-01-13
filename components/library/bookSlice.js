import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookService from './bookService';

/* =======================
   Async Thunks
======================= */

export const getUserBooks = createAsyncThunk(
  'books/getUserBooks',
  async (_, thunkAPI) => {
    try {
      return await bookService.getUserBooks();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createBook = createAsyncThunk(
  'books/createBook',
  async ({ bookData, pdfFile, coverFile }, thunkAPI) => {
    try {
      return await bookService.createBook(bookData, pdfFile, coverFile);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ⚠️ FIXED: Remove coverFile parameter
export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ bookId, updates }, thunkAPI) => { // Only 2 parameters
    try {
      return await bookService.updateBook(bookId, updates);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ⚠️ FIXED: Use correct service method
export const uploadCoverImage = createAsyncThunk(
  'books/uploadCoverImage',
  async ({ bookId, coverFile }, thunkAPI) => {
    try {
      return await bookService.updateCoverImage(bookId, coverFile);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateReadingProgress = createAsyncThunk(
  'books/updateReadingProgress',
  async ({ bookId, lastReadPage }, thunkAPI) => {
    try {
      return await bookService.updateReadingProgress(bookId, lastReadPage);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (bookId, thunkAPI) => {
    try {
      await bookService.deleteBook(bookId);
      return bookId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateBookCover = createAsyncThunk(
  'books/updateBookCover',
  async ({ bookId, coverImageId }, thunkAPI) => {
    try {
      return await bookService.updateBook(bookId, {
        coverImageId
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchPublicBooks = createAsyncThunk(
  'books/fetchPublicBooks',
  async (_, thunkAPI) => {
    try {
      return await bookService.getPublicBooks();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* =======================
   Slice
======================= */

const initialState = {
  books: [],
  publicBooks: [], // Added for public books
  isLoading: false,
  isUploadingCover: false,
  error: null,
  currentReadingBook: null,
  coverUploadProgress: 0,
  operationStatus: {
    create: null,
    update: null,
    delete: null,
    uploadCover: null,
  }
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearBooks: (state) => {
      state.books = [];
      state.error = null;
      state.operationStatus = {
        create: null,
        update: null,
        delete: null,
        uploadCover: null,
      };
    },
    setCurrentReadingBook: (state, action) => {
      state.currentReadingBook = action.payload;
    },
    clearCurrentReadingBook: (state) => {
      state.currentReadingBook = null;
    },
    clearOperationStatus: (state, action) => {
      const operation = action.payload;
      if (operation) {
        state.operationStatus[operation] = null;
      } else {
        state.operationStatus = {
          create: null,
          update: null,
          delete: null,
          uploadCover: null,
        };
      }
    },
    setCoverUploadProgress: (state, action) => {
      state.coverUploadProgress = action.payload;
    },
    manualUpdateBook: (state, action) => {
      const { bookId, updates } = action.payload;
      const index = state.books.findIndex(book => book.$id === bookId);
      if (index !== -1) {
        state.books[index] = { ...state.books[index], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload.documents || action.payload;
        state.operationStatus.create = 'success';
      })
      .addCase(getUserBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.operationStatus.create = 'error';
      })

      .addCase(createBook.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.operationStatus.create = 'pending';
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books.push(action.payload);
        state.operationStatus.create = 'success';
      })
      .addCase(createBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.operationStatus.create = 'error';
      })

      .addCase(updateBook.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.operationStatus.update = 'pending';
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = state.books.map((book) =>
          book.$id === action.payload.$id ? action.payload : book
        );
        state.operationStatus.update = 'success';
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.operationStatus.update = 'error';
      })

      .addCase(uploadCoverImage.pending, (state) => {
        state.isUploadingCover = true;
        state.coverUploadProgress = 0;
        state.operationStatus.uploadCover = 'pending';
      })
      .addCase(uploadCoverImage.fulfilled, (state, action) => {
        state.isUploadingCover = false;
        state.coverUploadProgress = 100;
        const updatedBook = action.payload;
        state.books = state.books.map((book) =>
          book.$id === updatedBook.$id ? updatedBook : book
        );
        state.operationStatus.uploadCover = 'success';
      })
      .addCase(uploadCoverImage.rejected, (state, action) => {
        state.isUploadingCover = false;
        state.coverUploadProgress = 0;
        state.error = action.payload;
        state.operationStatus.uploadCover = 'error';
      })

      .addCase(updateBookCover.pending, (state) => {
        state.isLoading = true;
        state.operationStatus.uploadCover = 'pending';
      })
      .addCase(updateBookCover.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = state.books.map((book) =>
          book.$id === action.payload.$id ? action.payload : book
        );
        state.operationStatus.uploadCover = 'success';
      })
      .addCase(updateBookCover.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.operationStatus.uploadCover = 'error';
      })

      .addCase(updateReadingProgress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateReadingProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = state.books.map((book) =>
          book.$id === action.payload.$id ? action.payload : book
        );
      })
      .addCase(updateReadingProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteBook.pending, (state) => {
        state.isLoading = true;
        state.operationStatus.delete = 'pending';
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = state.books.filter(
          (book) => book.$id !== action.payload
        );
        state.operationStatus.delete = 'success';
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.operationStatus.delete = 'error';
      })

      .addCase(fetchPublicBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPublicBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publicBooks = action.payload.documents || action.payload;
      })
      .addCase(fetchPublicBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

/* =======================
   Exports
======================= */

export const { 
  clearBooks, 
  setCurrentReadingBook, 
  clearCurrentReadingBook,
  clearOperationStatus,
  setCoverUploadProgress,
  manualUpdateBook 
} = bookSlice.actions;

export const selectAllBooks = (state) => state.books.books;
export const selectPublicBooks = (state) => state.books.publicBooks;
export const selectBookById = (id) => (state) => 
  state.books.books.find(book => book.$id === id);
export const selectBooksByStatus = (status) => (state) => 
  state.books.books.filter(book => book.status === status);
export const selectCoverUploadProgress = (state) => state.books.coverUploadProgress;
export const selectOperationStatus = (operation) => (state) => 
  state.books.operationStatus[operation];

export default bookSlice.reducer;