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
  minHeight?:string;
  minWidth?:string;
  content?:string;
  fontWeight?: "normal" | "bold" | "lighter"|number;
  fontFamily?: string;
  textIndent?: string;
  transition?:string;
  textDecoration?: string;
  letterSpacing?: string;
  lineSpacing?: string;
  justifyContent?: "flex-start" | "center" | "flex-end";
  alignItems?: "flex-start" | "center" | "flex-end";
  imgWidth?: string;
  imgHeight?: string;
  zIndex?:number;
  backgroundImage?: string;
  backgroundSize?: string;  
  backgroundPosition?: string;
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
      if (comp) {
        comp.position.x = x;
        comp.position.y = y;
        comp.content = action.payload.content
      }
    },
    importComponents: (state, action: PayloadAction<ComponentData[]>) => {
      state.components = action.payload;
      state.selectedId = null;
    },
    selectComponent: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
    deleteComponent: (state, action: PayloadAction<string>) => {
      state.components = state.components.filter(component => component.id !== action.payload);
    },
    deleteAllComponents:(state)=>{
      state.components = [];
      state.selectedId = null;
    },
    updateComponentContent:(state,action:PayloadAction<{id:string;content:string}>)=>{
        const component = state.components.find(c=>c.id === action.payload.id);
        if(component){
          component.content = action.payload.content;
        }
    },
    updateComponentStyle: (
      state,
      action: PayloadAction<{
        id: string;
        style: Partial<ComponentStyle>;
      }>
    ) => {
      const component = state.components.find(
        (c) => c.id === action.payload.id
      );
      if (component) {
        component.style = {
          ...component.style,
          ...action.payload.style,
        };
      }
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
export const {addComponents,updateComponentsPosition,selectComponent,deleteComponent,updateComponentStyle,updateComponentContent,deleteAllComponents,importComponents} = componentSlice.actions
const componentReducer = componentSlice.reducer;
export default componentReducer;
