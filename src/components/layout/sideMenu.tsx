import '../../assets/css/components/sideMenu.scss'
import SearchBox from '../baseComponents/searchBox'
import EleSlot from '../baseComponents/eleSlot'
import DraggableBox from '../baseComponents/draggbleBox'
import "../../assets/images/icon_text.png"
import img1 from "../../assets/images/icon_text.png"
import img2 from "../../assets/images/icon_btn.png"
import img3 from "../../assets/images/icon_image.png"
import img4 from "../../assets/images/icon_video.png"
import img5 from "../../assets/images/icon_link.png"
import img6 from "../../assets/images/Layout_Nature.svg"
import img7 from "../../assets/images/Layout_Header.svg"
import img8 from "../../assets/images/Layout_chooseCard.svg"
import { Drawer } from 'antd'
import { useState } from 'react'
function SideMenu() {
  const [isOpen,setIsOpen] = useState<boolean>(false)
  return (
    <div className="left" >
      <div className="menuBtn"
      role="button"
      onClick={() => setIsOpen(true)}
      tabIndex={0}
      style={{
        backgroundPosition: isOpen ? '-48px 0px' : '-24px 0px',
        transition: 'background-position 0.2s'
      }}
      
      ></div>
      <Drawer
        placement="left"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        closable={false}
        mask={false}
        width={300}
        className="custom-drawer"
        contentWrapperStyle={{
          top: 41,
          left: 41,
          height: 'calc(100% - 41px)',
          boxShadow: '4px 6px 6px 0 rgba(31, 50, 88, .08)',
          // textAlign:'center'
        }}
        bodyStyle={{ 
          padding: 0,
          height: '100%',
          backgroundColor: '#fff',
          border: '1px solid hsla(0, 0%, 92.9%, .6)'
        }}
      >
        {/* 原有菜单内容 */}
        <div className="menu">
          <div className='menuTitle'>
            <span className="Tleft">组件库</span>
            <span className="Tright">
              <span 
                className="closeBtn" 
                onClick={() => setIsOpen(false)}
                style={{
                  backgroundPosition: isOpen ? '0 -19px' : '0 0',
                  transition: 'background-position 0.2s'
                }}
              ></span>
              <span className="topBtn"></span>
            </span>
          </div>
          <SearchBox text={"搜索组件"}/>
          <EleSlot Info={"基础组件"}/>
          <div className='baseEleBox'>
            <DraggableBox comName={'文本'} imgUrl={img1} id={'text'} type='text'/>
            <DraggableBox comName={'按钮'} imgUrl={img2} id={'btn'} type='button'/>
            <DraggableBox comName={'图片'} imgUrl={img3} id={'image'} type='image'/>
            <DraggableBox comName={'视频'} imgUrl={img4} id={'video'} type='video' />
            <DraggableBox comName={'链接'} imgUrl={img5} id={'link'} type='link' />
          </div>
          <EleSlot Info={"复合组件"}/>
          <div className='baseEleBox'>
            <DraggableBox comName={'自然布局'} imgUrl={img6} id={'TexCom'} type='nature'/>
            <DraggableBox comName={'页头'} imgUrl={img7} id={'TexCom'} type='header'/>
            <DraggableBox comName={'选项卡'} imgUrl={img8} id={'TexCom'} type='chooseCard'/>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default SideMenu