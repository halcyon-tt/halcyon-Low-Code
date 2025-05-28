import CanvasTop from "../baseComponents/canvasTop"
import "../../assets/css/components/canvasArea.scss"
import addbtn from "../../assets/images/add-btn.png"
import { throttle } from "lodash";
import type { ComponentData } from "../../store/modules/componentSlice"
import { Button } from "antd/lib";
import ComponentRenderer from "../baseComponents/componentRender"
import { useRef,useEffect,useCallback,useMemo } from "react"
import { useDispatch,useSelector  } from "react-redux"
import { useDrop } from "react-dnd"
import { Modal ,} from "antd"
import { COMPONENT_DEFAULT_STYLES } from "../../config/componentStyle";
import { selectComponent } from "../../store/modules/componentSlice";
import { type CanvasTabType ,type CanvasState, setActiveTab} from "../../store/modules/canvasSlice";
import DefaultImage from "../../assets/images/home/header-logo.jpg"
import store from "../../store"
import debounceDispatch from "../../utils/debounce";
import "../../assets/css/baseComponents/canvasTop.scss"
// import type {ModalProps} from "antd"
 import {
  useState,
  useId,
} from "react"

interface DragItem {
  type: keyof typeof COMPONENT_DEFAULT_STYLES
  id?: string
  initialPosition?: { x: number; y: number }
  content?: string
  imageUrl?: string
}
interface PreviewContentProps {
  components: ComponentData[];
  activeTab: CanvasTabType;
  isPreview?: boolean;
}
const PreviewContent = ({ components, activeTab, isPreview = true }: PreviewContentProps) => {
  return (
    <div className={`preview-container ${activeTab.toLowerCase()}`}>
      <div className="preview-content">
        {components.map((component) => (
          <ComponentRenderer 
            key={component.id}
            component={component}
            isPreview={isPreview}
          />
        ))}
      </div>
    </div>
  );
};
const getDefaultSize = (type: string): { width: number; height: number } => {
  const style = COMPONENT_DEFAULT_STYLES[type as keyof typeof COMPONENT_DEFAULT_STYLES];
  // 解析宽高
  const parseValue = (value: string | number) => {
    if (typeof value === 'number') return value;
    if (value.endsWith('px')) return parseInt(value);
    return 100;
  };
  
  return {
    width: parseValue(style.width),
    height: parseValue(style.height)
  };
};
function CanvasArea() {
  const dispatch = useDispatch()
  const debouncedDispatch = useMemo(() => debounceDispatch(dispatch), [dispatch]);
  const components = useSelector(
    (state: { components: { components: ComponentData[] } }) => 
      state.components.components || []
  );
  const selectedId = useSelector(
    (state: { components: { selectedId: string | null } }) => state.components.selectedId
  );
  const activeTab = useSelector((state:{canvas:CanvasState})=>state.canvas.activeTab)
  // const [dynamicContent,setDynamicContent] = useState<string>('');
  const [isPromptVisible,setIsPromptVisible] = useState<boolean>(false);
  const [isRealTimeViewVisible,setIsRealTimeViewVisible] = useState<boolean>(false);
  const [isBackgroundVisible,setBackgroundVisible] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const dropRef = useRef<HTMLDivElement>(null)
  const componentsRef = useRef(components)
  const canvasRectRef = useRef<DOMRect | null>(null)
  const promptId:string = useId();
  const realTimeViewId:string = useId();
  const backgroundId: string = useId();
  // const componentsRef = useRef(components);


  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'button': return '按钮';
      case 'text': return '点击编辑文本';
      case 'image': return DefaultImage;
      default: return '';
    }
  };
  useEffect(() => {
    componentsRef.current = components
    if(dropRef.current)canvasRectRef.current = dropRef.current?.getBoundingClientRect()
  }, [components])
//组件移动处理
  const handleComponentMove = useCallback(
    throttle((item: DragItem, monitor) => {
      if (!item.id) return;
      const canvasRect = canvasRectRef.current;
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
      
      debouncedDispatch.updateComponentsPosition({
        id: item.id,
        x: clampedX,
        y: clampedY,
        content: component.content || ''
      })
    },16,{ trailing: true, leading: false }), 
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
      if (item.id) return ;
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta || (delta.x === 0 && delta.y === 0)) return;
      if (delta) {
        handleComponentMove(item, delta);
      }
      const canvasRect = dropRef.current?.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset()
      if (!clientOffset || !canvasRect) return

       // 使用默认尺寸计算中心点
  const defaultSize = getDefaultSize(item.type);
  const x = clientOffset.x - canvasRect.left - defaultSize.width / 2;
  const y = clientOffset.y - canvasRect.top - defaultSize.height / 2;

  // 边界限制
  const maxX = canvasRect.width - defaultSize.width;
  const maxY = canvasRect.height - defaultSize.height;
  const clampedX = Math.max(0, Math.min(x, maxX));
  const clampedY = Math.max(0, Math.min(y, maxY));
      
      // 创建新组件数据
      const componentData: ComponentData = {
        id: `${item.type}-${Date.now()}`,
        type: item.type,
        content: item.content || getDefaultContent(item.type),
        position: { x:clampedX, y:clampedY },
        style: { 
          ...COMPONENT_DEFAULT_STYLES[item.type],
        }
      }
      if (item.id) dispatch(selectComponent(item.id));
     debouncedDispatch.addComponents(componentData);

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
      onTabChange={(type:CanvasTabType) => dispatch(setActiveTab(type))}
      componentId={selectedId|| ''}
      onPreview={()=>setPreviewVisible(true)}
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
      <Modal
         title="画布预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
        <Button key="close" onClick={() => setPreviewVisible(false)}>
          关闭预览
        </Button>,
      ]}
        width="100%"
        style={{ 
        top: 0, 
        maxWidth: '100vw',
        height: '100vh',
        padding: 0,
        margin: 0
      }}
  bodyStyle={{ 
    padding: 0,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    overflow: 'auto'
  }}
  destroyOnClose
>
  <div style={{
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box'
  }}>
    <div 
      className={`preview-container ${activeTab.toLowerCase()}`}
      style={{
        position: 'relative',
        boxShadow: '0 0 30px rgba(0,0,0,0.15)',
        backgroundColor: 'white',
        overflow: 'hidden',
        ...(activeTab === 'PC' ? {
          width: '100%',
          maxWidth: '1200px',
          height: '90vh',
          borderRadius: '8px'
        } : {
          width: '375px',
          height: '667px',
          border: '12px solid #333',
          borderTopWidth: '40px',
          borderBottomWidth: '40px',
          borderRadius: '36px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
        })
      }}
    >
      <PreviewContent 
        components={components} 
        activeTab={activeTab} 
      />
    </div>
  </div>
</Modal>
    </div>
  )
}

export default CanvasArea