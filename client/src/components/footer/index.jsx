import { Layout } from 'antd'

const { Footer } = Layout

const FooterRender = () => {
  return (
    <Footer
      style={{
        textAlign: 'center',
      }}
    >
      From thang fong with lớp @{new Date().getFullYear()}
    </Footer>
  )
}

export default FooterRender
