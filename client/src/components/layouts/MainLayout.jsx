import React from 'react'
import { Breadcrumb, Layout, theme } from 'antd'
import HeaderRender from 'components/header'
import SiderRender from 'components/siderbar'
import FooterRender from 'components/footer'
const { Content, Sider, Header } = Layout

const App = (props) => {
  //   const {
  //     token: { colorBgContainer, borderRadiusLG },
  //   } = theme.useToken();
  const theme = 'light'
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <HeaderRender />
      <Layout>
        <SiderRender theme={theme} />
        <Layout>
          <Content
            style={{
              margin: '16px 16px',
            }}
          >
            <props.component />
          </Content>
          <FooterRender />
        </Layout>
      </Layout>
    </Layout>
  )
}
export default App
