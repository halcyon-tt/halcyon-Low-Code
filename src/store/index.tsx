import { configureStore } from '@reduxjs/toolkit';
import componentReducer from './modules/componentSlice';
const store = configureStore({
  reducer: {
    components:componentReducer,
  },
});

export default store;