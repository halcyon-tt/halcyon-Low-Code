import { Button } from 'antd'
import { useState } from 'react'

export default function Header (){
  const [loadings,setLoadings] = useState<boolean[]>([]);
  const enterLoading = (index:number)=>{
    setLoadings((prevLoadings)=>{
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    })
    setTimeout(()=>{
      setLoadings((prevLoadings)=>{
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      })
    },3000);
  }
    return (
      <header className="header">
      <div className="logo">
      <div className="logo-img"></div>
      <div className="logo-text">Halcyon LowCode</div>
      </div>
      <div className="operate">
      <Button type='primary' loading={loadings[0]} iconPosition='end' onClick={() => enterLoading(0)}><span>导出HTML</span></Button>
      <Button type='primary' loading={loadings[1]} iconPosition='end' onClick={() => enterLoading(1)}><span>导出为React</span></Button>
      <Button type='primary' loading={loadings[2]} iconPosition='end' onClick={() => enterLoading(2)}><span>导出Json</span></Button>
      </div>
    </header>
    )

}
