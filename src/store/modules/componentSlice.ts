import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { COMPONENT_DEFAULT_STYLES } from "../../config/componentStyle";
export type ComponentStyle = {
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
  past: ComponentsState[];    
  future: ComponentsState[];  
}

const initialState:ComponentsState = {
  components:[],
  selectedId:null,
  past:[],
  future:[],
}

const componentSlice = createSlice({
  name:'components',
  initialState,
  reducers:{
    addComponents:(state,action:PayloadAction<ComponentData>)=>{
     
      const currentStateCopy = JSON.parse(JSON.stringify(state));
      state.past.push(currentStateCopy);
      state.future = [];
      state.components.push(action.payload);
    },
    updateComponentsPosition:(state , action:PayloadAction<{id:string;x:number;y:number;content:string}>)=>{
      
      const currentStateCopy = JSON.parse(JSON.stringify(state));
    state.past.push(currentStateCopy);
    state.future = [];
      const { id, x, y } = action.payload;
      const comp = state.components.find(c => c.id === id);
      if (comp) {
        comp.position.x = x;
        comp.position.y = y;
        comp.content = action.payload.content
      }
    },
    importComponents: (state, action: PayloadAction<ComponentData[]>) => {
     
      const currentStateCopy = JSON.parse(JSON.stringify(state));
    state.past.push(currentStateCopy);
    state.future = [];
      state.components = action.payload;
      state.selectedId = null;
    },
    selectComponent: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
    deleteComponent: (state, action: PayloadAction<string>) => {
     
      const currentStateCopy = JSON.parse(JSON.stringify(state));
    state.past.push(currentStateCopy);
    state.future = [];
      state.components = state.components.filter(component => component.id !== action.payload);
    },
    deleteAllComponents:(state)=>{
     
      const currentStateCopy = JSON.parse(JSON.stringify(state));
    state.past.push(currentStateCopy);
    state.future = [];
      state.components = [];
      state.selectedId = null;
    },
    updateComponentContent:(state,action:PayloadAction<{id:string;content:string}>)=>{
      
      const currentStateCopy = JSON.parse(JSON.stringify(state));
    state.past.push(currentStateCopy);
    state.future = [];
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
    
      const currentStateCopy = JSON.parse(JSON.stringify(state));
    state.past.push(currentStateCopy);
    state.future = [];
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
    undo: (state) => {
      if (state.past.length === 0) return;
      const previousState = state.past[state.past.length - 1];
      state.future.push({ ...state }); 
      state.components = previousState.components;
      state.selectedId = previousState.selectedId;
      state.past.pop(); 
    },
    // 重做
    redo: (state) => {
      if (state.future.length === 0) return;
      const nextState = state.future[state.future.length - 1];
      state.past.push({ ...state }); 
      state.components = nextState.components;
      state.selectedId = nextState.selectedId;
      state.future.pop(); 
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
export const {addComponents,updateComponentsPosition,selectComponent,deleteComponent,updateComponentStyle,updateComponentContent,deleteAllComponents,importComponents,redo,undo} = componentSlice.actions
const componentReducer = componentSlice.reducer;
export default componentReducer;
