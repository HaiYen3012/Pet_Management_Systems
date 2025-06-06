import './statistics.scss'
import React, { useEffect, useState } from 'react'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import {
  Card,
  Col,
  Row,
  Statistic,
  DatePicker,
  Space,
  Input,
  Select,
  ConfigProvider,
  Typography,
  Spin,
} from 'antd'
import { PieChart } from '@mui/x-charts/PieChart'
import { BarChart } from '@mui/x-charts/BarChart'
import { axisClasses } from '@mui/x-charts/ChartsAxis'
import analysis from 'api/analysis'
import viVN from 'antd/lib/locale/vi_VN'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import localeData from 'dayjs/plugin/localeData'
import _ from 'lodash'

dayjs.locale('vi')
dayjs.extend(localeData)
const defaultYear = dayjs().year()
const d = new Date()
const monthNow = d.getMonth() + 1

const appoinmentFake = [
  { month: 'Tháng 1', count: '2', sum: 1000000 },
  { month: 'Tháng 2', count: '1', sum: 2000000 },
  { month: 'Tháng 3', count: '1', sum: 1500000 },
  { month: 'Tháng 4', count: '3', sum: 3000000 },
  { month: 'Tháng 5', count: '2', sum: 2500000 },
  { month: 'Tháng 6', count: '0', sum: 0 },
  { month: 'Tháng 7', count: '0', sum: 0 },
  { month: 'Tháng 8', count: '0', sum: 0 },
  { month: 'Tháng 9', count: '0', sum: 0 },
  { month: 'Tháng 10', count: '0', sum: 0 },
  { month: 'Tháng 11', count: '0', sum: 0 },
  { month: 'Tháng 12', count: '0', sum: 0 },
]

const beautyFake = [
  { month: 'Tháng 1', count: '2', sum: 500000 },
  { month: 'Tháng 2', count: '1', sum: 1000000 },
  { month: 'Tháng 3', count: '1', sum: 800000 },
  { month: 'Tháng 4', count: '3', sum: 1200000 },
  { month: 'Tháng 5', count: '2', sum: 1500000 },
  { month: 'Tháng 6', count: '0', sum: 0 },
  { month: 'Tháng 7', count: '0', sum: 0 },
  { month: 'Tháng 8', count: '0', sum: 0 },
  { month: 'Tháng 9', count: '0', sum: 0 },
  { month: 'Tháng 10', count: '0', sum: 0 },
  { month: 'Tháng 11', count: '0', sum: 0 },
  { month: 'Tháng 12', count: '0', sum: 0 },
]

const storageFake = [
  { month: 'Tháng 1', count: '2', sum: 200000 },
  { month: 'Tháng 2', count: '1', sum: 300000 },
  { month: 'Tháng 3', count: '1', sum: 250000 },
  { month: 'Tháng 4', count: '3', sum: 500000 },
  { month: 'Tháng 5', count: '2', sum: 450000 },
  { month: 'Tháng 6', count: '0', sum: 0 },
  { month: 'Tháng 7', count: '0', sum: 0 },
  { month: 'Tháng 8', count: '0', sum: 0 },
  { month: 'Tháng 9', count: '0', sum: 0 },
  { month: 'Tháng 10', count: '0', sum: 0 },
  { month: 'Tháng 11', count: '0', sum: 0 },
  { month: 'Tháng 12', count: '0', sum: 0 },
]

const Statistics = () => {
  const [paymentCount, setPaymentCount] = useState(0)
  const [revenueAppointmentData, setRevenueAppointmentData] =
    useState(appoinmentFake)
  const [revenueBeautyData, setRevenueBeautyData] = useState(beautyFake)
  const [revenueStorageData, setRevenueStorageData] = useState(storageFake)
  const [revenueChangePercentage, setRevenueChangePercentage] = useState(0)
  const [visitCount, setVisitCount] = useState('0')
  const [useRate, setUseRate] = useState({
    appointment: '',
    beauty: '',
    storage: '',
  })
  const [yearData, setYearData] = useState('2024')
  const [selected, setSelected] = useState('appoinment')
  const [revenueMonthNow, setRevenueMonthNow] = useState(0)

  const [isLoading, setIsLoading] = useState(false)

  const calculatePercentageChange = (current, previous) => {
    console.log('pre', previous, 'curr', current)
    if (previous === 0) return current === 0 ? 0 : 100
    return ((current - previous) / previous) * 100
  }

  const valueFormatter = (value) =>
    value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ'

  const chartSetting = {
    yAxis: [
      {
        label: 'Doanh thu (vnđ)',
      },
    ],
    series: [
      { dataKey: 'sum', label: 'Tổng doanh thu 1 tháng', valueFormatter },
    ],
    height: 300,
    sx: {
      [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
        transform: 'translateX(-10px)',
      },
    },
  }

  useEffect(() => {
    const getMonthlyRevenue = (data, month) => {
      const monthData = data.find(
        (d) => parseInt(d.month.split(' ')[1]) === month,
      )
      return monthData ? monthData.sum : 0
    }

    const currentMonthRevenue =
      getMonthlyRevenue(revenueAppointmentData, monthNow) +
      getMonthlyRevenue(revenueBeautyData, monthNow) +
      getMonthlyRevenue(revenueStorageData, monthNow)

    const previousMonthRevenue =
      getMonthlyRevenue(revenueAppointmentData, monthNow - 1) +
      getMonthlyRevenue(revenueBeautyData, monthNow - 1) +
      getMonthlyRevenue(revenueStorageData, monthNow - 1)

    setRevenueMonthNow(currentMonthRevenue)

    if (monthNow > 1) {
      const changePercentage = calculatePercentageChange(
        currentMonthRevenue,
        previousMonthRevenue,
      )
      setRevenueChangePercentage(changePercentage)
    }
  }, [revenueAppointmentData, revenueBeautyData, revenueStorageData, monthNow])

  const formatMonth = (data) => {
    const newData = data.map((item) => ({
      ...item,
      month: `Tháng ${item.month}`,
    }))

    return newData
  }

  const fetchData = async () => {
    setIsLoading(true)
    const response = await analysis.getData(yearData)
    setIsLoading(false)
    if (response && response.status === 200) {
      setVisitCount(response.data.visitCount.visit)
      setPaymentCount(response.data.paymentCount.payment)
      setUseRate({
        appointment: response.data.paymentCount.service.appointment.percent,
        beauty: response.data.paymentCount.service.beauty.percent,
        storage: response.data.paymentCount.service.storage.percent,
      })
      // setRevenueAppointmentData(formatMonth(response.data.revenueData.appointmentData))
      // setRevenueBeautyData(formatMonth(response.data.revenueData.beautyData))
      // setRevenueStorageData(formatMonth(response.data.revenueData.storageData))
    }
  }

  const formatCurrencyVND = (value) => {
    return (
      new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value) + ' VNĐ'
    )
  }

  useEffect(() => {
    fetchData()
  }, [yearData])

  const onChangeYear = (date, dateString) => {
    setYearData(dateString)
  }

  const handleChangeSelect = (value) => {
    setSelected(value)
  }

  return (
    <ConfigProvider locale={viVN}>
      <div className="statistics">
        <Space style={{ width: '100%', justifyContent: 'center' }}>
          <Typography.Title level={2}>Thống kê báo cáo</Typography.Title>
          <br />
          <br />
        </Space>

        <div className="statistics__date" style={{ textAlign: 'left' }}>
          <DatePicker
            onChange={onChangeYear}
            picker="year"
            defaultValue={dayjs(`${defaultYear}-01-01`)}
            placeholder="Chọn năm"
            style={{ width: 100, height: 40 }}
          />
        </div>
        {isLoading ? (
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
            style={{
              height: '100vh',
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
            }}
          />
        ) : (
          <div className="statistics__content">
            <div
              className="statistics__content__item"
              style={{ height: '340px' }}
            >
              <Card
                title="Tỉ lệ sử dụng dịch vụ"
                style={{ width: '55%', height: 340 }}
              >
                <PieChart
                  series={[
                    {
                      data: [
                        {
                          id: 0,
                          value: `${useRate.appointment}`,
                          label: 'Khám/Chữa bệnh',
                        },
                        {
                          id: 1,
                          value: `${useRate.beauty}`,
                          label: 'Vệ sinh/Làm đẹp',
                        },
                        {
                          id: 2,
                          value: `${useRate.storage}`,
                          label: 'Lưu trữ',
                        },
                      ],
                    },
                  ]}
                  width={480}
                  height={200}
                />
              </Card>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexDirection: 'column',
                  width: '40%',
                }}
              >
                <div style={{ display: 'flex', gap: '8%' }}>
                  <Card title="Truy cập" style={{ width: '50%' }}>
                    <div className="data">{visitCount} lượt</div>
                  </Card>
                  <Card title="Thanh toán" style={{ width: '50%' }}>
                    <div className="data">{paymentCount} lượt</div>
                  </Card>
                </div>

                <Card
                  title={`Tổng doanh thu trong tháng ${monthNow}`}
                  style={{ width: '100%' }}
                >
                  <div className="data">
                    {formatCurrencyVND(revenueMonthNow)}
                  </div>
                  <div className="evaluate">
                    <Statistic
                      title=""
                      value={Math.abs(revenueChangePercentage)}
                      precision={2}
                      valueStyle={{
                        color:
                          revenueChangePercentage > 0 ? '#3f8600' : '#cf1322',
                      }}
                      prefix={
                        revenueChangePercentage > 0 ? (
                          <ArrowUpOutlined />
                        ) : (
                          <ArrowDownOutlined />
                        )
                      }
                      suffix="%"
                    />
                    <span className="text">So với tháng trước</span>
                  </div>
                </Card>
              </div>
            </div>

            <div className="statistics__content__item">
              <Card
                title="Biểu đồ doanh thu"
                style={{ width: '100%' }}
                extra={
                  <Select
                    onChange={handleChangeSelect}
                    defaultValue="appoinment"
                    style={{
                      width: 170,
                    }}
                    allowClear
                    options={[
                      {
                        value: 'appoinment',
                        label: 'Khám / Chữa bệnh',
                      },
                      {
                        value: 'beauty',
                        label: 'Dịch vụ làm đẹp',
                      },
                      {
                        value: 'storage',
                        label: 'Dịch vụ lưu trữ',
                      },
                    ]}
                  />
                }
              >
                <div style={{ width: '100%' }}>
                  <BarChart
                    dataset={(() => {
                      if (selected === 'appoinment') {
                        return revenueAppointmentData
                      } else if (selected === 'beauty') {
                        return revenueBeautyData
                      } else if (selected === 'storage') {
                        return revenueStorageData
                      }
                    })()}
                    xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                    {...chartSetting}
                  />
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  )
}

export default Statistics
