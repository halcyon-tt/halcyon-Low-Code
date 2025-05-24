// components/ComponentRenderer.tsx
import { useDrag} from 'react-dnd';
import { useDispatch,useSelector } from 'react-redux';
// import { useCallback } from 'react';
import { updateComponentsPosition,selectComponent } from '../../store/modules/componentSlice';
import type { ComponentData } from '../../store/modules/componentSlice';
// import { throttle } from 'lodash';
// import { useCallback,useRef } from 'react';
import type { ComponentState } from 'react'; 
interface ComponentRendererProps {
  component: ComponentData;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ component }) => {
  const dispatch = useDispatch();
  // const offsetRef = useRef({ x: 0, y: 0 });
  // const ref = useRef<HTMLDivElement>(null);
  // const throttledUpdate = useCallback(throttle((id:string, x:number, y:number) => {
  //   dispatch(updateComponentsPosition({ id, x, y, content: component.content }));
  // }, 16), [dispatch]);
  // 拖拽逻辑
  // const domRef = useRef<HTMLDivElement>(null);
  const selectedId = useSelector((state: { components: ComponentState }) => state.components.selectedId);
  const [{isDragging}, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: () => {
      // 在这里触发选中动作
      dispatch(selectComponent(component.id));
      return {
        id: component.id,
        type: component.type,
        content: component.content,
        initialPosition: component.position
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
      end: (item: unknown, monitor: { didDrop: () => unknown; }) => {
        if (!monitor.didDrop()) {
          // 取消无效拖拽
          dispatch(updateComponentsPosition({
            id: component.id,
            x: component.position.x,
            y: component.position.y,
            content: component.content
          }));
        }
      }
    
  }));
  const renderComponent = () => {
    switch (component.type) {
      case 'text':
        return (
          <div
            // contentEditable
            // onMouseDown={(e) => e.stopPropagation()}
            onBlur={(e) => dispatch(updateComponentsPosition({
              id: component.id,
              x: component.position.x,
              y: component.position.y,
              content: e.currentTarget.textContent || ''
            }))}
            style={{
              fontSize: component.style.fontSize,
              color: component.style.color,
              minWidth: 100,
              border: '1px dashed #999',
              padding: 4
            }}
          >
            {component.content}
          </div>
        );

      case 'button':
        return (
          <button
          // onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: component.style.width,
              height: component.style.height,
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '8px 16px'
            }}
          >
            {component.content}
          </button>
        );

      case 'image':
        return (
          <img 
          // onMouseDown={(e) => e.stopPropagation()}
            src={component.content} 
            alt="图片"
            style={{ 
              width: component.style.width,
              height: component.style.height,
              border: '1px dashed #999'
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={(node)=>{
        drag(node)
      }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        if (e.button === 0) { 
          dispatch(selectComponent(component.id));
        }
      }}
      style={{
        position: "absolute",
        left: `${component.position.x}px`,
        top: `${component.position.y}px`,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        outline: selectedId === component.id ? "2px solid #1890ff" : "none",
        ...component.style
      }}
    >
      {renderComponent()}
    </div>
  );
};
export default ComponentRenderer