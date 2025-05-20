import CanvasTop from "../baseComponents/canvasTop"
import "../../assets/css/components/canvasArea.scss"
import addbtn from "../../assets/images/add-btn.png"
import { Modal ,} from "antd"
// import type {ModalProps} from "antd"
 import {
  useState,
  useId,
} from "react"
function CanvasArea() {
  // const [dynamicContent,setDynamicContent] = useState<string>('');
  const [isPromptVisible,setIsPromptVisible] = useState<boolean>(false);
  const [isRealTimeViewVisible,setIsRealTimeViewVisible] = useState<boolean>(false);
  const [isBackgroundVisible,setBackgroundVisible] = useState<boolean>(false);

  const promptId:string = useId();
  const realTimeViewId:string = useId();
  const backgroundId: string = useId();

  return (
    <div className="canvas">
      <CanvasTop/>
      <div className="center mainBtn">
        <div className="btn" style={{zIndex:100}}>
          <img src={addbtn}/>
        </div>
        <div className="DynamicDraw" contentEditable="true"></div>
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