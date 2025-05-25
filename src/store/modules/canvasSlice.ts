import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CanvasTabType = 'PC' | 'Phone';
export interface CanvasState{
  activeTab: CanvasTabType;
}

const initialState: CanvasState = {
  activeTab: 'PC'
}
const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers:{
    setActiveTab:(state,action:PayloadAction<CanvasTabType>) => {
      state.activeTab = action.payload
  }
}
})
export const {setActiveTab} = canvasSlice.actions
const canvasReducer = canvasSlice.reducer
export default canvasReducer