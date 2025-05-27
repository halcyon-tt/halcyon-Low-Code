// debounceDispatch.ts 需要修改为：
import type { Dispatch } from "redux";
import { debounce } from "lodash";
import {
  addComponents,
  deleteComponent,
  deleteAllComponents,
  importComponents,
  updateComponentContent,
  updateComponentStyle,
  updateComponentsPosition
} from "../store/modules/componentSlice";
import type { ComponentData, ComponentStyle } from "../store/modules/componentSlice";

const DEBOUNCE_DELAY = 300;

// 创建防抖 action 的类型定义
interface DebouncedComponentActions {
  addComponents: (component: ComponentData) => void;
  deleteComponent: (id: string) => void;
  deleteAllComponents: () => void;
  updateComponentContent: (payload: { id: string; content: string }) => void;
  updateComponentStyle: (payload: { id: string; style: Partial<ComponentStyle> }) => void;
  importComponents: (components: ComponentData[]) => void;
  updateComponentsPosition: (payload: { id: string; x: number; y: number; content: string }) => void;
}

const debounceDispatch = (dispatch: Dispatch): DebouncedComponentActions => {
  return {
    addComponents: debounce(
      (component: ComponentData) => dispatch(addComponents(component)),
      DEBOUNCE_DELAY
    ),
    
    deleteComponent: debounce(
      (id: string) => dispatch(deleteComponent(id)),
      DEBOUNCE_DELAY
    ),
    
    deleteAllComponents: debounce(
      () => dispatch(deleteAllComponents()),
      DEBOUNCE_DELAY
    ),
    
    updateComponentContent: debounce(
      (payload: { id: string; content: string }) => 
        dispatch(updateComponentContent(payload)),
      DEBOUNCE_DELAY
    ),
    
    updateComponentStyle: debounce(
      (payload: { id: string; style: Partial<ComponentStyle> }) => 
        dispatch(updateComponentStyle(payload)),
      DEBOUNCE_DELAY
    ),
    
    importComponents: debounce(
      (components: ComponentData[]) => dispatch(importComponents(components)),
      DEBOUNCE_DELAY
    ),
    
    updateComponentsPosition: debounce(
      (payload: { id: string; x: number; y: number; content: string }) => 
        dispatch(updateComponentsPosition(payload)),
      DEBOUNCE_DELAY
    )
  };
};

export default debounceDispatch;