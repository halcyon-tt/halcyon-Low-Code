import "../../assets/css/components/rightPanel.scss"
import icon1 from "../../assets/images/page.png"
import { useState } from "react"
type Tabtype = "属性" | "样式"
function RightPanel() {
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
        <div className="right-main-promot">您还未选中任何组件哟</div>
      </div>
    </div>
  )
}

export default RightPanel