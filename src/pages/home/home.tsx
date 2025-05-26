import Header from '../../components/layout/header'
import SideMenu from '../../components/layout/sideMenu'
import CanvasArea from '../../components/layout/canvasArea'
import RightPanel from '../../components/layout/rightPanel'
import store from '../../store'
import { downloadFile,convertComponentStyles } from '../../utils/fileUtils';
import { COMPONENT_DEFAULT_STYLES } from '../../config/componentStyle';
import { Modal ,} from "antd"
// import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { ComponentData } from "../../store/modules/componentSlice"
import type { CanvasTabType,CanvasState} from "../../store/modules/canvasSlice"
import '../../assets/css/components/header.scss'
import '../home/home.scss'
export default function Home () {
  const activeTab = useSelector((state:{canvas:CanvasState})=>state.canvas.activeTab)
  // 导出时合并默认样式和组件自定义样式
const getStyle = (component: ComponentData) => {
  const defaultStyle = COMPONENT_DEFAULT_STYLES[component.type];
  const mergedStyle = { ...defaultStyle, ...component.style };
  // 将对象转换为 CSS 字符串
  return Object.entries(mergedStyle)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
};
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
  const generateHTML = (components: ComponentData[], activeTab: CanvasTabType) => {
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
          ${convertComponentStyles(comp.style)}
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
        ${ 
      comp.type === 'text' ? 
        `<div id="${comp.id}" style="${getStyle(comp)}">${comp.content}</div>` :
      comp.type === 'button' ? 
        `<button id="${comp.id}" style="${getStyle(comp)}">${comp.content}</button>` :
      comp.type === 'image' ? 
        `<img id="${comp.id}" src="${comp.content}" style="${getStyle(comp)}" />` :
      ''
    }
  `).join('')}
    </div>
  </body>
  </html>
    `;
  };
  
  const generateReactComponent = (components: ComponentData[], activeTab: CanvasTabType) => {
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
              ${JSON.stringify(comp.style, (key, value) => {
            // 处理React样式中的数字值
            if (typeof value === 'number' && [
              'width', 'height', 'fontSize', 'borderRadius'
            ].includes(key)) return `${value}px`;
            return value;
          }, 2).replace(/"([^"]+)":/g, '$1:')}
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

