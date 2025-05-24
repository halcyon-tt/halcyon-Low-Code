import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import {DndProvider} from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import store from './store'
import zhCN from 'antd/locale/zh_CN';
import router from './router'
import { Provider } from 'react-redux'
import './main.scss'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}> 
      <DndProvider backend={HTML5Backend}>
      <ConfigProvider locale={zhCN}>
        <RouterProvider router={router}/>
      </ConfigProvider>
      </DndProvider>
      </Provider>

  </StrictMode>,
)
