import React from 'react'
import { Layout } from 'antd'
import HeaderRender from 'components/header'
import SiderRender from 'components/siderbar'
import FooterRender from 'components/footer'
import './main-layout.scss' // <-- IMPORT FILE SCSS MỚI Ở ĐÂY

const { Content, Sider } = Layout

const App = (props) => {
  const theme = 'light' // Giữ theme light để Ant Design không ghi đè màu tối

  return (
    <Layout className="main-layout-wrapper"> {/* <-- THÊM CLASS WRAPPER */}
      <HeaderRender />
      <Layout className="main-layout-wrapper__body"> {/* <-- THÊM CLASS WRAPPER */}
        <SiderRender theme={theme} />
        <Layout className="main-layout-wrapper__content-area"> {/* <-- THÊM CLASS WRAPPER */}
          <Content className="main-layout-wrapper__content">
            {/* Truyền component vào đây */}
            <props.component />
          </Content>
          <FooterRender />
        </Layout>
      </Layout>
    </Layout>
  )
}
export default App