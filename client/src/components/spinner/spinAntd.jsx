import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

export function SpinAntd() {
  return (
    <Spin
      indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
      style={{
        height: '60vh',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
      }}
    />
  )
}
