import { Button } from 'antd'
import { useState } from 'react'
interface HeaderProps {
  onExport: (type: 'html' | 'react' | 'json') => Promise<void>;
}

export default function Header ({ onExport}: HeaderProps){
  const [loadingType, setLoadingType] = useState<'html'|'react'|'json'|null>(null);
  // const [loadings,setLoadings] = useState<boolean[]>([]);
  const handleExport = async (type: 'html' | 'react' | 'json') => {
    setLoadingType(type);
    try {
      await onExport(type);
    } finally {
      setTimeout(() => setLoadingType(null), 1000);
    }
  };



  // const enterLoading = (index:number)=>{
  //   setLoadings((prevLoadings)=>{
  //     const newLoadings = [...prevLoadings];
  //     newLoadings[index] = true;
  //     return newLoadings;
  //   })
  //   setTimeout(()=>{
  //     setLoadings((prevLoadings)=>{
  //       const newLoadings = [...prevLoadings];
  //       newLoadings[index] = false;
  //       return newLoadings;
  //     })
  //   },3000);
  // }
    return (
      <header className="header">
      <div className="logo">
      <div className="logo-img"></div>
      <div className="logo-text">Halcyon LowCode</div>
      </div>
      <div className="operate">
      <Button type='primary' loading={loadingType === 'html'}
          onClick={() => handleExport('html')} iconPosition='end'><span>导出HTML</span></Button>
      <Button type='primary'  loading={loadingType === 'react'}
          onClick={() => handleExport('react')} iconPosition='end'><span>导出为React</span></Button>
      <Button type='primary'  loading={loadingType === 'json'}
          onClick={() => handleExport('json')} iconPosition='end' ><span>导出Json</span></Button>
      </div>
    </header>
    )

}
