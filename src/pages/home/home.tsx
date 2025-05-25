import Header from '../../components/layout/header'
import SideMenu from '../../components/layout/sideMenu'
import CanvasArea from '../../components/layout/canvasArea'
import RightPanel from '../../components/layout/rightPanel'
import store from '../../store'
import { downloadFile } from '../../utils/fileUtils';
import { Modal ,} from "antd"
import { useState } from 'react'
import type { ComponentData } from "../../store/modules/componentSlice"
import '../../assets/css/components/header.scss'
import '../home/home.scss'
type mediaType = "PC" | "Phone"
export default function Home () {
 const [activeTab,setActiveTab] = useState<mediaType>('PC')

    const handleExport = async (type: 'html' | 'react' | 'json') => {
      try {
        // 获取最新状态
        const currentComponents = store.getState().components.components;
        const currentActiveTab = activeTab;
    
        // 生成内容
        let content = '';
        let filename = '';
        let mimeType = '';
        
        switch (type) {
          case 'html':
            content = generateHTML(currentComponents, currentActiveTab);
            filename = 'export.html';
            mimeType = 'text/html';
            break;
          case 'react':
            content = generateReactComponent(currentComponents, currentActiveTab);
            filename = 'ExportedComponent.jsx';
            mimeType = 'text/javascript';
            break;
          case 'json':
            content = generateJSON(currentComponents);
            filename = 'components.json';
            mimeType = 'application/json';
            break;
        }
    
        // 执行下载
        downloadFile(content, filename, mimeType);
      } catch (error) {
        console.error('导出失败:', error);
        Modal.error({
          title: '导出失败',
          content: (error as Error).message,
        });
      }
    };
    // 添加工具函数
  const generateHTML = (components: ComponentData[], activeTab: mediaType) => {
    return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Exported Page</title>
    <style>
      .canvas-container {
        position: relative;
        width: ${activeTab === 'PC' ? '1200px' : '375px'};
        height: 800px;
        margin: 0 auto;
      }
      ${components.map(comp => `
        #${comp.id} {
          ${Object.entries(comp.style)
            .map(([k, v]) => `${k}: ${v};`)
            .join('')}
          position: absolute;
          left: ${comp.position.x}px;
          top: ${comp.position.y}px;
        }
      `).join('\n')}
    </style>
  </head>
  <body>
    <div class="canvas-container">
      ${components.map(comp => `
        <div id="${comp.id}">
          ${comp.type === 'text' ? comp.content : 
           comp.type === 'button' ? `<button>${comp.content}</button>` :
           comp.type === 'image' ? `<img src="${comp.content}" />` : ''}
        </div>
      `).join('')}
    </div>
  </body>
  </html>
    `;
  };
  
  const generateReactComponent = (components: ComponentData[], activeTab: mediaType) => {
    return `
  import React from 'react';
  
  const ExportedComponent = () => {
    return (
      <div style={{
        position: 'relative',
        width: '${activeTab === 'PC' ? '1200px' : '375px'}',
        height: '800px',
        margin: '0 auto'
      }}>
        ${components.map(comp => `
          <div 
            key="${comp.id}"
            style={{
              position: 'absolute',
              left: ${comp.position.x},
              top: ${comp.position.y},
              ${Object.entries(comp.style)
                .map(([k, v]) => `${k}: '${v}',`)
                .join('\n')}
            }}
          >
            ${comp.type === 'text' ? comp.content : 
             comp.type === 'button' ? `<button>${comp.content}</button>` :
             comp.type === 'image' ? `<img src="${comp.content}" alt="image" />` : ''}
          </div>
        `).join('')}
      </div>
    );
  };
  
  export default ExportedComponent;
    `;
  };
  
  const generateJSON = (components: ComponentData[]) => {
    return JSON.stringify({
      version: '1.0',
      components: components.map(comp => ({
        id: comp.id,
        type: comp.type,
        content: comp.content,
        position: comp.position,
        style: comp.style
      })),
      meta: {
        exportTime: new Date().toISOString()
      }
    }, null, 2);
  };
    return (
    <div className="container">
      <Header onExport={handleExport}/>
      <div className="main">
      <SideMenu/>
      <CanvasArea/>
      <RightPanel/>
      </div>
    </div>
    )
}

