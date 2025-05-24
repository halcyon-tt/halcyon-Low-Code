import "../../assets/css/components/rightPanel.scss"
import icon1 from "../../assets/images/page.png"
import { useState } from "react"
import { useDispatch,useSelector } from "react-redux"
import { type ComponentData,updateComponentStyle,updateComponentContent } from "../../store/modules/componentSlice"
import { Input,} from "antd"
import TextProperties from "../properties/textProperties"
import ImageProperties from "../properties/imageProperties" 
import ButtonProperties from "../properties/buttonProperties"
type Tabtype = "属性" | "样式"
function RightPanel() {
  const parseStyleValue = (value?: string) => {
    if (typeof value === "number") return value;
    return parseInt((value || "0").replace("px", ""));
  }
  const formatStyleValue = (value: number) => 
    `${value}px`;
  const dispatch = useDispatch();


  // 获取组件相关信息
  const selectedId = useSelector((state:{components:{selectedId:string|null}})=>state.components.selectedId)
  const components = useSelector((state:{components:{components:ComponentData[]}})=>state.components.components)
  const selectedComponent = components.find((c)=>c.id === selectedId)

  // 样式更新相关处理

  const handleStyleChange = (key:string,value:string | number)=>{
    if(!selectedComponent) return;
    const formattedValue = typeof value === "number" ? formatStyleValue(value) : value;
    dispatch(updateComponentStyle({
      id:selectedComponent.id,
      style:{
        ...selectedComponent.style,[key]:formattedValue,
      }
    })
  )
  }
  //渲染属性面板和样式面板
  const renderContentTab = () =>{
    if(!selectedComponent) return null;
    switch(selectedComponent.type){
      case "text":
        return (
          <div className="property-item">
            <label>文本内容</label>
            <Input.TextArea
             rows={35}
             value={selectedComponent.content}
             onChange = {(e)=>{
                dispatch(updateComponentContent({
                  id:selectedComponent.id,
                  content:e.target.value
                }))
             }}
             >
            </Input.TextArea>
          </div>
        )
      default:
        <div className="property-item">当前组件无内容属性</div>;
    }
  }

  const renderStyleTab = () =>{
    if(!selectedComponent) return null;
    const commonProps = {
      component :selectedComponent,
      onStyleChange:handleStyleChange,
      parse:parseStyleValue,
      format:formatStyleValue,
    }
    switch(selectedComponent.type){
      case "text":
        return <TextProperties {...commonProps}/>;
      case "image":
        return <ImageProperties {...commonProps}/>;
      case "button":
        return <ButtonProperties {...commonProps}/>;
        default :
        return <div className="property-item">当前组件无样式属性</div>;
    }


  }
  const [activeTab,setActiveTab] = useState<Tabtype>("属性")
  return (
    <div className="right">
      <div className="right-describ">
        <img src={icon1}/>
        页面
      </div>
      <div className="right-choices">
        <div className={`right-choices-one ${activeTab === "属性" ? "active" : ""}`} onClick={()=>setActiveTab("属性")}>属性</div>
        <div className={`right-choices-one ${activeTab === "样式" ? "active" : ""}`} onClick={()=>setActiveTab("样式")}>样式</div>
      </div>
      <div className="right-main right-text">
      {!selectedComponent ? (
          <div className="right-main-promot">您还未选中任何组件哟</div>
        ) : (
          <div className="right-main-content">
            {activeTab === "属性" ? renderContentTab() : renderStyleTab()}
          </div>
        )}
      </div>
    </div>
  )
}

export default RightPanel