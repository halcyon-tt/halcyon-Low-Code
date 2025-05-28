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
const MAX_HISTORY = 10;
const componentSlice = createSlice({
  name:'components',
  initialState,
  reducers:{
    recordHistory: (state) => {
      if (state.past.length >= MAX_HISTORY) {
        state.past.shift();
      }
      state.past.push({
        components: state.components.map(c => ({
          ...c,
          position: {...c.position},
          style: {...c.style}
        })),
        selectedId: state.selectedId,
        past: [],
        future: []
      });
      state.future = [];
    },
    addComponents: {
      reducer(state, action: PayloadAction<ComponentData>) {
        state.components.push(action.payload);
        componentSlice.caseReducers.recordHistory(state);
      },
      prepare(component: ComponentData) {
        return { payload: component };
      }
    },

    updateComponentsPosition: {
      reducer(state, action: PayloadAction<{id: string; x: number; y: number; content: string}>) {
        const { id, x, y } = action.payload;
        const comp = state.components.find(c => c.id === id);
        if (comp) {
          comp.position.x = x;
          comp.position.y = y;
          comp.content = action.payload.content;
        }
        componentSlice.caseReducers.recordHistory(state);
      },
      prepare(payload: {id: string; x: number; y: number; content: string}) {
        return { payload };
      }
    },
    importComponents: {
      reducer(state, action: PayloadAction<ComponentData[]>) {
        state.components = action.payload;
        state.selectedId = null;
        componentSlice.caseReducers.recordHistory(state);
      },
      prepare(payload: ComponentData[]) {
        return { payload };
      }
    },

    selectComponent: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
    deleteComponent: {
      reducer(state, action: PayloadAction<string>) {
        state.components = state.components.filter(component => component.id !== action.payload);
        componentSlice.caseReducers.recordHistory(state); 
      },
      prepare(payload: string) {
        return { payload };
      }
    },
    deleteAllComponents: {
      reducer(state) {
        state.components = [];
        state.selectedId = null;
        componentSlice.caseReducers.recordHistory(state);
      },
      prepare() {
        return { payload: null };
      }
    },
    updateComponentContent: {
      reducer(state, action: PayloadAction<{id: string; content: string}>) {
        const component = state.components.find(c => c.id === action.payload.id);
        if (component) {
          component.content = action.payload.content;
        }
        componentSlice.caseReducers.recordHistory(state); 
      },
      prepare(payload: {id: string; content: string}) {
        return { payload };
      }
    },
    updateComponentStyle: {
      reducer(
        state,
        action: PayloadAction<{
          id: string;
          style: Partial<ComponentStyle>;
        }>
      ) {
        const component = state.components.find(c => c.id === action.payload.id);
        if (component) {
          component.style = {
            ...component.style,
            ...action.payload.style,
          };
        }
        componentSlice.caseReducers.recordHistory(state); 
      },
      prepare(payload: { id: string; style: Partial<ComponentStyle> }) {
        return { payload };
      }
    },
    undo: (state) => {
      if (state.past.length === 0) return;

      // 深拷贝当前状态存入future
      const currentState = {
        components: state.components.map(c => ({...c})),
        selectedId: state.selectedId,
        past:[],
        future:[],
      };

      // 获取历史状态
      const previousState = state.past[state.past.length - 1];

      return { 
        components: previousState.components.map(c => ({...c})),
        selectedId: previousState.selectedId,
        past: state.past.slice(0, -1),
        future: [currentState, ...state.future]
      };
    },
    redo: (state) => {
      if (state.future.length === 0) return;

      // 深拷贝当前状态存入past
      const currentState = {
        components: state.components.map(c => ({...c})),
        selectedId: state.selectedId,
        past:[],
        future:[],
      };

      const [nextState, ...remainingFuture] = state.future;

      return {
        components: nextState.components.map(c => ({...c})),
        selectedId: nextState.selectedId,
        past: [...state.past, currentState],
        future: remainingFuture
      };
    }
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
