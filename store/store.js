import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlices'; // <-- import your slice


const store = configureStore({
    reducer: {
        auth : authSlice,
        //TODO: add more slices here for posts
    }
});


export {store};