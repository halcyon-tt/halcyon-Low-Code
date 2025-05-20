import '../../assets/css/baseComponents/eleSlot.scss'
interface eleSlotPropos{
  Info ?: string;
}
const EleSlot:React.FC<eleSlotPropos> = ({Info = "组件类型"}) => {
  return (
    <div className="eleSlot"> 
    <div>{Info}</div>
    </div>
    
  )
}

export default EleSlot