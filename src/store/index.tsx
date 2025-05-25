import { configureStore } from '@reduxjs/toolkit';
import componentReducer from './modules/componentSlice';
import canvasReducer from './modules/canvasSlice';
const store = configureStore({
  reducer: {
    components:componentReducer,
    canvas:canvasReducer,
  },
});

export default store;