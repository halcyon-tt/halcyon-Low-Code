import "../../assets/css/baseComponents/draggableBox.scss"
import { useDrag } from "react-dnd";
import { useRef } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { COMPONENT_DEFAULT_STYLES } from "../../config/componentStyle";
interface DraggableBoxProps{
   comName ?: string;
   imgUrl ?: string;
   id ?: string;
   type : keyof typeof COMPONENT_DEFAULT_STYLES
}
const  DraggableBox:React.FC<DraggableBoxProps> = ({
  comName = "默认组件",
  imgUrl = "../../assets/images/home/header-logo.jpg",
  id = "组件名称",
  type
})=>
  { const ref = useRef<HTMLDivElement>(null);
    const [{isDragging},drag] = useDrag(()=>({
      type:'COMPONENT',
      item:{
        type,
        defaults: COMPONENT_DEFAULT_STYLES[type],
        tempId: `${type}-${nanoid()}`
      },
      collect:(monitor)=>({
        isDragging:monitor.isDragging(),
      }),
    }))
    drag(ref)
  return (
      <div 
      draggable="true" 
      className="comBox" 
      id={id} 
      ref={ref} 
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}>
        <img className="img-show" draggable="false" src={imgUrl} alt="图片失踪了"/>
        <div className="com-name">{comName}</div>
      </div>
  )
}

export default DraggableBox