import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookService from './bookService';

/* =======================
   Async Thunks
======================= */

// Fetch books of current user
export const getUserBooks = createAsyncThunk(
  'books/getUserBooks',
  async (userId, thunkAPI) => {
    try {
      return await bookService.getUserBooks(userId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Create a new book
export const createBook = createAsyncThunk(
  'books/createBook',
  async (bookData, thunkAPI) => {
    try {
      return await bookService.createBook(bookData);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Update a book
export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ bookId, bookData }, thunkAPI) => {
    try {
      return await bookService.updateBook(bookId, bookData);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Delete a book
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

/* =======================
   Slice
======================= */

const initialState = {
  books: [],
  isLoading: false,
  error: null,
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearBooks: (state) => {
      state.books = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* Get Books */
      .addCase(getUserBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload.documents;
      })
      .addCase(getUserBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* Create Book */
      .addCase(createBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books.push(action.payload);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* Update Book */
      .addCase(updateBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = state.books.map((book) =>
          book.$id === action.payload.$id ? action.payload : book
        );
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* Delete Book */
      .addCase(deleteBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = state.books.filter(
          (book) => book.$id !== action.payload
        );
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

/* =======================
   Exports
======================= */

export const { clearBooks } = bookSlice.actions;
export default bookSlice.reducer;
