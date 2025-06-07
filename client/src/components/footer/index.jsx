// --- START OF FILE FooterRender.jsx (PHIÊN BẢN "ĐẲNG CẤP") ---

import { Layout, Space, Typography, Divider } from 'antd'
import { HeartFilled } from '@ant-design/icons'
import './footer.scss' // Tạo một file SCSS mới cho footer

const { Footer } = Layout
const { Text, Link } = Typography

const FooterRender = () => {
  return (
    // Thêm class để dễ dàng style
    <Footer className="footer-wrapper">
      <div className="footer-wrapper__content">
        <Text className="footer-wrapper__copyright">
          © {new Date().getFullYear()} PetCare Plus. All Rights Reserved.
        </Text>
        
        <Divider type="vertical" className="footer-wrapper__divider" />

        <Space className="footer-wrapper__made-with">
          <Text>Made with</Text>
          <HeartFilled className="footer-wrapper__heart-icon" />
          <Text>for Pet Lovers</Text>
        </Space>
      </div>
    </Footer>
  )
}

export default FooterRender