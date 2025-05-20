import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import store from './store/modules'
import zhCN from 'antd/locale/zh_CN';
import router from './router'
import { Provider } from 'react-redux'
import './main.scss'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}> 
      <ConfigProvider locale={zhCN}>
        <RouterProvider router={router}/>
      </ConfigProvider>
      </Provider>

  </StrictMode>,
)
