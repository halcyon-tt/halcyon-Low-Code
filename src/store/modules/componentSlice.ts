import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { COMPONENT_DEFAULT_STYLES } from "../../config/componentStyle";
type ComponentStyle = {
  width?: string;
  height?: string;
  fontSize?: string;
  backgroundColor?: string;
  color?: string;
  borderRadius?: string;
  border?: string;
  lineHeight?:number;
  minHeight?:string
}
export interface Component{
  id:string;
  type:string;
  // props:Record<string ,unknown>;
  position:{x:number; y:number};
  content:string;
}
interface ComponentsState{
  components:ComponentData[];
  selectedId:string | null;
}

const initialState:ComponentsState = {
  components:[],
  selectedId:null
}

const componentSlice = createSlice({
  name:'components',
  initialState,
  reducers:{
    addComponents:(state,action:PayloadAction<ComponentData>)=>{
      state.components.push(action.payload);
    },
    updateComponentsPosition:(state , action:PayloadAction<{id:string;x:number;y:number;content:string}>)=>{
      const { id, x, y } = action.payload;
      const comp = state.components.find(c => c.id === id);
      // if(comp){
      //   comp.position = {x:action.payload.x,y:action.payload.y};
      //   comp.content = action.payload.content
      // }
      if (comp) {
        comp.position.x = x;
        comp.position.y = y;
        comp.content = action.payload.content
      }
    },
    selectComponent: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
    deleteComponent: (state, action: PayloadAction<string>) => {
      state.components = state.components.filter(component => component.id !== action.payload);
    },
  }
})
export interface ComponentData {
  id: string;
  type: keyof typeof COMPONENT_DEFAULT_STYLES;
  content: string; 
  position: { x: number; y: number };
  style: ComponentStyle
}
export const {addComponents,updateComponentsPosition,selectComponent,deleteComponent} = componentSlice.actions
const componentReducer = componentSlice.reducer;
export default componentReducer;
