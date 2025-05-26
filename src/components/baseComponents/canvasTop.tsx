import icon1 from "../../assets/images/pc.png"
import icon2 from "../../assets/images/phone.png"
import icon3 from "../../assets/images/ctrl-z.png"
import "../../assets/css/baseComponents/canvasTop.scss"
import { deleteComponent,deleteAllComponents,importComponents } from "../../store/modules/componentSlice"
import { useDispatch } from "react-redux"
import { Button } from "antd"
import type { CanvasTabType } from "../../store/modules/canvasSlice"
interface CanvasTopProps {
  activeTab: CanvasTabType;
  onTabChange: (type: CanvasTabType) => void;
  componentId: string;
}
function CanvasTop({activeTab,onTabChange,componentId}:CanvasTopProps ){
  const dispatch = useDispatch();
  const handleImportJson = () => {
    // 1. 创建隐藏的 file input 元素
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    // 2. 文件选择回调
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // 3. 读取文件内容
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          // 4. 解析 JSON
          const json = JSON.parse(event.target?.result as string);
          
          // 5. 验证数据结构
          if (!Array.isArray(json.components)) {
            throw new Error('无效的 JSON 格式');
          }

          // 6. 更新 Redux 状态
          dispatch(importComponents(json.components));
          alert('导入成功！');
        } catch (err) {
          alert('导入失败: ' + (err as Error).message);
        }
      };
      reader.readAsText(file);
    };

    // 7. 触发文件选择
    input.click();
  };

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
          {/* <Button><span>保存</span></Button> */}
          <Button onClick={handleImportJson}><span>导入Json</span></Button>
          <Button  onClick={()=>dispatch(deleteAllComponents())}><span>重置</span></Button>
          <Button ><span>预览</span></Button>
          {/* <Button ><span>发布</span></Button> */}
        </div>
      </div>
    </div>
  )
}

export default CanvasTop