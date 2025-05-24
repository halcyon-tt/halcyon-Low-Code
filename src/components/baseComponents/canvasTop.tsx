import icon1 from "../../assets/images/pc.png"
import icon2 from "../../assets/images/phone.png"
import icon3 from "../../assets/images/ctrl-z.png"
import "../../assets/css/baseComponents/canvasTop.scss"
import { deleteComponent } from "../../store/modules/componentSlice"
import { useDispatch } from "react-redux"
import { Button } from "antd"
type mediaType = "PC" | "Phone"
interface CanvasTopProps {
  activeTab: mediaType;
  onTabChange: (type: mediaType) => void;
  componentId: string;
}
function CanvasTop({activeTab,onTabChange,componentId}:CanvasTopProps ){
  const dispatch = useDispatch();
  return (
    <div className="top">
      <div className="top-left">
        <img className="top-left-logo"/>
      </div>
      <div className="top-center">
        <div className={`top-center-pc ${activeTab === 'PC' ? 'active' : ''}`} onClick={()=>onTabChange('PC')}>
          <img src={icon1}/>
        </div>
        <div className={`top-center-phone ${activeTab === 'Phone' ? 'active' : ''}`} onClick={()=>onTabChange('Phone')}>
          <img src={icon2}/>
        </div>
      </div>
      <div className="top-right">
        <div className="top-right-operator">
          <img src={icon3} className="show"/>
          <img src={icon3} className="show restore"/>
        </div>
        <div className="top-right-function">
          {/* <Button ><span>静态定位</span></Button> */}
          <Button onClick={()=>dispatch(deleteComponent(componentId))}><span>删除</span></Button>
          <Button ><span>保存</span></Button>
          <Button ><span>导入Json</span></Button>
          <Button ><span>重置</span></Button>
          <Button ><span>预览</span></Button>
          <Button ><span>发布</span></Button>
        </div>
      </div>
    </div>
  )
}

export default CanvasTop