import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlices';
import bookReducer from '../components/library/bookSlice'; // <-- import bookSlice

const store = configureStore({
  reducer: {
    auth: authSlice,
    books: bookReducer, // <-- add this line
  },
});

export { store };
