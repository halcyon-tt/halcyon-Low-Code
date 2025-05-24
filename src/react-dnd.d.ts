import 'react-dnd';

declare module 'react-dnd' {
  interface DragSourceMonitor {
    getDifferenceFromInitialOffset(): { x: number; y: number } | null;
  }
}