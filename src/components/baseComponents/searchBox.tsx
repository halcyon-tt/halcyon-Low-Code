import '../../assets/css/baseComponents/searchBox.scss'
interface SearchBoxProps{
  text?:string;
}
const  SearchBox:React.FC<SearchBoxProps> = ({text = "搜索"}) => {
  return (
    <div className="searchBox">
      <div className="searchZoom">
        <input type="text" id="sbox" placeholder={text}/>
        <span className="searchBtn"></span>
      </div>
    </div>
  )
}

export default SearchBox