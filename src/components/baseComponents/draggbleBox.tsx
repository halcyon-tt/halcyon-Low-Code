import "../../assets/css/baseComponents/draggableBox.scss"
interface DraggableBoxProps{
   comName ?: string;
   imgUrl ?: string;
   id ?: string;
}
const  DraggableBox:React.FC<DraggableBoxProps> = ({
  comName = "默认组件",
  imgUrl = "../../assets/images/home/header-logo.jpg",
  id = "组件名称"
})=> {
  return (
      <div draggable="true" className="comBox" id={id}>
        <img className="img-show" draggable="false" src={imgUrl} alt="图片失踪了"/>
        <div className="com-name">{comName}</div>
      </div>
  )
}

export default DraggableBox