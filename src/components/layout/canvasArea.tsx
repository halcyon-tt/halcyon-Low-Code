import CanvasTop from "../baseComponents/canvasTop"
import "../../assets/css/components/canvasArea.scss"
import addbtn from "../../assets/images/add-btn.png"
import { throttle } from "lodash";
import type { ComponentData } from "../../store/modules/componentSlice"
import { addComponents,updateComponentsPosition } from "../../store/modules/componentSlice"
import ComponentRenderer from "../baseComponents/componentRender"
import { useRef } from "react"
import { useDispatch } from "react-redux"
import { useDrop } from "react-dnd"
import { Modal ,} from "antd"
import { useSelector } from "react-redux"
import { useEffect,useCallback } from "react"
import { COMPONENT_DEFAULT_STYLES } from "../../config/componentStyle";
import { selectComponent } from "../../store/modules/componentSlice";
import store from "../../store";
// import type {ModalProps} from "antd"
 import {
  useState,
  useId,
} from "react"
type mediaType = "PC" | "Phone"
interface DragItem {
  type: keyof typeof COMPONENT_DEFAULT_STYLES
  id?: string
  initialPosition?: { x: number; y: number }
  content?: string
  imageUrl?: string
}
function CanvasArea() {
  const dispatch = useDispatch()
  const components = useSelector(
    (state: { components: { components: ComponentData[] } }) => 
      state.components.components || []
  );
  const selectedId = useSelector(
    (state: { components: { selectedId: string | null } }) => state.components.selectedId
  );
  // const [dynamicContent,setDynamicContent] = useState<string>('');
  const [isPromptVisible,setIsPromptVisible] = useState<boolean>(false);
  const [isRealTimeViewVisible,setIsRealTimeViewVisible] = useState<boolean>(false);
  const [isBackgroundVisible,setBackgroundVisible] = useState<boolean>(false);
  const [activeTab,setActiveTab] = useState<mediaType>('PC')
  const dropRef = useRef<HTMLDivElement>(null)
  const componentsRef = useRef(components)
  const canvasRectRef = useRef<DOMRect | null>(null)
  const promptId:string = useId();
  const realTimeViewId:string = useId();
  const backgroundId: string = useId();
  // const componentsRef = useRef(components);
  useEffect(() => {
    componentsRef.current = components
    if(dropRef.current)canvasRectRef.current = dropRef.current?.getBoundingClientRect()
  }, [components])
  const handleComponentMove = useCallback(
    throttle((item: DragItem, monitor) => {
      if (!item.id ) return;
      const canvasRect = dropRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    const clientOffset = monitor.getClientOffset();
    if (!clientOffset) return;
    // 获取组件尺寸
    const componentElem = document.getElementById(item.id);
    const componentRect = componentElem?.getBoundingClientRect();
    const componentWidth = componentRect?.width || 0;
    const componentHeight = componentRect?.height || 0;
    // 计算有效移动范围
    const maxX = canvasRect.width - componentWidth;
    const maxY = canvasRect.height - componentHeight;

    const latestComponents = store.getState().components.components;
    const component = latestComponents.find(c => c.id === item.id);
      if (!component) return
      const newX = clientOffset.x - canvasRect.left - componentWidth/2;
      const newY = clientOffset.y - canvasRect.top - componentHeight/2;
  
      // 边界限制
      const clampedX = Math.max(0, Math.min(newX, maxX));
      const clampedY = Math.max(0, Math.min(newY, maxY));
      
      dispatch(updateComponentsPosition({
        id: item.id,
        x: clampedX,
        y: clampedY,
        content: item.content || ''
      }))
    },16,{ trailing: false }),
    [dispatch]
  )
  useEffect(() => {
    return () => {
      handleComponentMove.cancel();
    };
  }, []);
  //放置处理
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "COMPONENT",
    drop: (item: DragItem, monitor) => {
      handleComponentMove.flush(); 
      handleComponentMove.cancel();
      if (item.id) return // 现有组件移动不处
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta || (delta.x === 0 && delta.y === 0)) return;
      if (delta) {
        handleComponentMove(item, delta);
      }
      const canvasRect = dropRef.current?.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset()
      if (!clientOffset || !canvasRect) return

      // 计算相对画布位置
      const x = clientOffset.x - canvasRect.left
      const y = clientOffset.y - canvasRect.top

      // 获取组件默认配置
      const defaultConfig = COMPONENT_DEFAULT_STYLES[item.type]
      
      // 创建新组件数据
      const componentData: ComponentData = {
        id: `${item.type}-${Date.now()}`,
        type: item.type,
        content: item.content ||  "",
        position: { x, y },
        style: { ...defaultConfig }
      }
      if (item.id) dispatch(selectComponent(item.id));
      // 特殊类型处理
      switch(item.type) {
        case 'text':
          componentData.content = '点击编辑文本'
          break
        case 'image':
          if (item.imageUrl) {
            componentData.content = item.imageUrl
          }
          break
      }

      dispatch(addComponents(componentData))
    },
    hover: (item: DragItem, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;
       const canvasRect = dropRef.current?.getBoundingClientRect();
      if (!canvasRect || !monitor.isOver({ shallow: true })) return;  
      if (!monitor.getItem() || !monitor.getDifferenceFromInitialOffset()) return;
      if (!monitor.canDrop()) return;
      // const delta = monitor.getDifferenceFromInitialOffset()
      // if (!delta || Math.abs(delta.x) < 1 || Math.abs(delta.y) < 1) return;
      // if (delta)
        handleComponentMove(item, monitor)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    }),
    
  }))

  drop(dropRef)
  return (
    <div className="canvas">
      <CanvasTop 
      activeTab={activeTab}
      onTabChange={(type) => setActiveTab(type)}
      componentId={selectedId|| ''}
      />
      <div className={`center mainBtn ${activeTab === 'Phone' ? 'phoneSize' : ''}`}
      ref={(node) => {
          dropRef.current = node;
          drop(node);
          }}
      style={{
        backgroundColor: selectedId||isOver ? 'transparent' : '#baf8ff',
      }}
      onClick={() => {
          dispatch(selectComponent(null));
      }}
      >
        {components.map((component) => (
          <ComponentRenderer 
            key={component.id}
            component={component}
          />
        ))}
        <div className="btn" style={{zIndex:1}} onClick={(e) => {
    e.stopPropagation();
  }}>
          <img src={addbtn}/>
        </div>
        <div className="DynamicDraw" contentEditable="true"  ></div>
        <div >
        <Modal title="提示" style={{zIndex:2001, display:"none"}}  aria-descibedby={promptId} open={isPromptVisible}  wrapClassName="overlay" className="overlay-dialog" onCancel={()=>setIsPromptVisible(false)} onOk={()=>setIsPromptVisible(false)}>
        <div id={promptId}>
        这里是提示的具体内容。
      </div>
        </Modal>
        <div className="RealTimeView">
          <Modal style={{zIndex:2002,display:"none"}} aria-describedby={realTimeViewId} className="overlay-dialog" wrapClassName="overlay" open={isRealTimeViewVisible} onCancel={()=>setIsRealTimeViewVisible(false)} onOk={()=>setIsRealTimeViewVisible(false)}>
          </Modal>
        </div>
        <div className="background">
        <Modal title={"生成的链接"} style={{zIndex:2003,display:"none"}} aria-describedby={backgroundId} className="overlay-dialog" wrapClassName="overlay" open={isBackgroundVisible} onCancel={()=>setBackgroundVisible(false)} onOk={()=>setBackgroundVisible(false)}>
        </Modal>
        </div>
        <a className="target" href="" target="_blank" style={{display:"none"}} aria-hidden="true"></a>
      
      </div>
      </div>
      
    </div>
  )
}

export default CanvasArea