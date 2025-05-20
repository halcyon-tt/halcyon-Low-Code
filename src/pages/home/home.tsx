import Header from '../../components/layout/header'
import SideMenu from '../../components/layout/sideMenu'
import CanvasArea from '../../components/layout/canvasArea'
import RightPanel from '../../components/layout/rightPanel'
import '../../assets/css/components/header.scss'
import '../home/home.scss'
export default function Home () {
  
    return (
    <div className="container">
      <Header/>
      <div className="main">
      <SideMenu/>
      <CanvasArea/>
      <RightPanel/>
      </div>
    </div>
    )
}

