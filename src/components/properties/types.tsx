
import type { ComponentData } from "../../store/modules/componentSlice";

export interface StyleConfigProps {
  component: ComponentData;
  onStyleChange: (key: string, value: string | number) => void;
  parse: (value?: string) => number;
  format: (value: number) => string;
}