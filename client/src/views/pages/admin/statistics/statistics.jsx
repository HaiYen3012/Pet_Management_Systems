import React, { useState, useEffect } from 'react';
import { 
  TrophyOutlined, 
  DollarOutlined, 
  UserOutlined, 
  CreditCardOutlined,
  HeartOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  LoadingOutlined
} from '@ant-design/icons';

// Fake data
const petRegistrationData = [
  { month: 'Tháng 1', dogs: 45, cats: 32, birds: 12, others: 8 },
  { month: 'Tháng 2', dogs: 52, cats: 38, birds: 15, others: 10 },
  { month: 'Tháng 3', dogs: 48, cats: 41, birds: 18, others: 12 },
  { month: 'Tháng 4', dogs: 65, cats: 44, birds: 22, others: 15 },
  { month: 'Tháng 5', dogs: 58, cats: 39, birds: 20, others: 13 },
  { month: 'Tháng 6', dogs: 72, cats: 51, birds: 25, others: 18 }
];

const revenueData = [
  { month: 'Tháng 1', appointment: 15000000, beauty: 8500000, storage: 3500000 },
  { month: 'Tháng 2', appointment: 18500000, beauty: 9200000, storage: 4100000 },
  { month: 'Tháng 3', appointment: 22000000, beauty: 11800000, storage: 4800000 },
  { month: 'Tháng 4', appointment: 25500000, beauty: 13200000, storage: 5200000 },
  { month: 'Tháng 5', appointment: 28000000, beauty: 15600000, storage: 5800000 },
  { month: 'Tháng 6', appointment: 31200000, beauty: 17800000, storage: 6500000 }
];

const healthTrendData = [
  { condition: 'Tiêm phòng', count: 245, trend: 12 },
  { condition: 'Khám tổng quát', count: 189, trend: 8 },
  { condition: 'Điều trị da liễu', count: 156, trend: -3 },
  { condition: 'Khám răng miệng', count: 134, trend: 15 },
  { condition: 'Phẫu thuật nhỏ', count: 89, trend: 5 },
  { condition: 'Điều trị tiêu hóa', count: 67, trend: -8 }
];

const serviceUsageData = [
  { service: 'Khám/Chữa bệnh', usage: 45.2, color: '#FFD700' },
  { service: 'Vệ sinh/Làm đẹp', usage: 32.8, color: '#FFA500' },
  { service: 'Lưu trữ thú cưng', usage: 15.3, color: '#FF8C00' },
  { service: 'Tư vấn dinh dưỡng', usage: 6.7, color: '#FFB347' }
];

// MỚI: Dữ liệu cho lịch sử hoạt động gần đây
const recentActivityData = [
  { id: 1, petName: 'Milo a.k.a Vàng', service: 'Khám tổng quát', doctor: 'BS. An', date: '02/06/2025', cost: 350000 },
  { id: 2, petName: 'Luna Mèo Anh', service: 'Tiêm phòng dại', doctor: 'BS. Bình', date: '15/05/2025', cost: 250000 },
  { id: 3, petName: 'Kiki Phốc Sóc', service: 'Cắt tỉa lông', doctor: 'Spa. Chi', date: '14/05/2025', cost: 450000 },
  { id: 4, petName: 'Jack Corgi', service: 'Lưu trữ (2 ngày)', doctor: 'Reception', date: '13/05/2025', cost: 600000 },
  { id: 5, petName: 'Bông Gòn Poodle', service: 'Điều trị da', doctor: 'BS. An', date: '12/05/2025', cost: 750000 },
];

const Statistics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate summary stats
  const totalPetsRegistered = petRegistrationData.reduce((acc, month) => 
    acc + month.dogs + month.cats + month.birds + month.others, 0
  );
  
  const totalRevenue = revenueData.reduce((acc, month) => 
    acc + month.appointment + month.beauty + month.storage, 0
  );

  const currentMonthRevenue = revenueData[revenueData.length - 1];
  const previousMonthRevenue = revenueData[revenueData.length - 2];
  const revenueGrowth = ((
    (currentMonthRevenue.appointment + currentMonthRevenue.beauty + currentMonthRevenue.storage) -
    (previousMonthRevenue.appointment + previousMonthRevenue.beauty + previousMonthRevenue.storage)
  ) / (previousMonthRevenue.appointment + previousMonthRevenue.beauty + previousMonthRevenue.storage) * 100);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ';
  };

  const StatCard = ({ icon, title, value, unit, trend, color = '#FFD700' }) => (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="stat-card__content">
        <div className="stat-card__icon" style={{ backgroundColor: `${color}20`, color }}>
          {icon}
        </div>
        <div className="stat-card__info">
          <div className="stat-card__title">{title}</div>
          <div className="stat-card__value">{value}</div>
          <div className="stat-card__unit">{unit}</div>
          {trend !== undefined && (
            <div className={`stat-card__trend ${trend >= 0 ? 'positive' : 'negative'}`}>
              {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              {Math.abs(trend).toFixed(1)}% so với tháng trước
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const PieChart = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.usage, 0);
    let cumulativePercentage = 0;

    return (
      <div className="chart-container">
        <h3 className="chart-title">{title}</h3>
        <div className="pie-chart-wrapper">
          <div className="pie-chart">
            <svg viewBox="0 0 200 200" className="pie-svg">
              {data.map((item, index) => {
                const percentage = (item.usage / total) * 100;
                const angle = (percentage / 100) * 360;
                const startAngle = (cumulativePercentage / 100) * 360;
                const endAngle = startAngle + angle;
                
                const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
                const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
                const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
                const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                
                cumulativePercentage += percentage;
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={item.color}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                );
              })}
              <circle cx="100" cy="100" r="40" fill="#fff" />
              <text x="100" y="95" textAnchor="middle" className="pie-center-text">Tổng</text>
              <text x="100" y="110" textAnchor="middle" className="pie-center-value">100%</text>
            </svg>
          </div>
          <div className="pie-legend">
            {data.map((item, index) => (
              <div key={index} className="legend-item">
                <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                <span className="legend-label">{item.service}</span>
                <span className="legend-value">{item.usage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const BarChart = ({ data, title, keys, colors }) => {
    const maxValue = Math.max(...data.map(item => 
      keys.reduce((sum, key) => sum + item[key], 0)
    ));

    return (
      <div className="chart-container">
        <h3 className="chart-title">{title}</h3>
        <div className="bar-chart">
          <div className="bar-chart-content">
            {data.map((item, index) => (
              <div key={index} className="bar-group">
                <div className="bar-stack">
                  {keys.map((key, keyIndex) => (
                    <div
                      key={key}
                      className="bar-segment"
                      style={{
                        height: `${(item[key] / maxValue) * 200}px`,
                        backgroundColor: colors[keyIndex],
                      }}
                      title={`${key}: ${item[key]}`}
                    />
                  ))}
                </div>
                <div className="bar-label">{item.month}</div>
              </div>
            ))}
          </div>
          <div className="bar-legend">
            {keys.map((key, index) => (
              <div key={key} className="legend-item">
                <div className="legend-color" style={{ backgroundColor: colors[index] }}></div>
                <span>{key === 'dogs' ? 'Chó' : key === 'cats' ? 'Mèo' : key === 'birds' ? 'Chim' : 'Khác'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const LineChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(item => 
      item.appointment + item.beauty + item.storage
    ));

    return (
      <div className="chart-container">
        <h3 className="chart-title">{title}</h3>
        <div className="line-chart">
          <div className="line-chart-content">
            <svg viewBox="0 0 600 300" className="line-svg">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <g key={i}>
                  <line x1="50" y1={50 + i * 50} x2="550" y2={50 + i * 50} stroke="#f0f0f0" strokeWidth="1" />
                  <text x="40" y={55 + i * 50} textAnchor="end" className="axis-label">
                    {formatCurrency(maxValue - (i * maxValue / 4))}
                  </text>
                </g>
              ))}
              
              {/* Lines */}
              {['appointment', 'beauty', 'storage'].map((key, lineIndex) => {
                const color = ['#FFD700', '#FFA500', '#FF8C00'][lineIndex];
                let pathData = '';
                
                data.forEach((item, index) => {
                  const x = 50 + (index * (500 / (data.length - 1)));
                  const y = 250 - ((item[key] / maxValue) * 200);
                  pathData += `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                });
                
                return (
                  <g key={key}>
                    <path d={pathData} fill="none" stroke={color} strokeWidth="3" />
                    {data.map((item, index) => (
                      <circle
                        key={index}
                        cx={50 + (index * (500 / (data.length - 1)))}
                        cy={250 - ((item[key] / maxValue) * 200)}
                        r="4"
                        fill={color}
                      />
                    ))}
                  </g>
                );
              })}
              
              {/* X-axis labels */}
              {data.map((item, index) => (
                <text
                  key={index}
                  x={50 + (index * (500 / (data.length - 1)))}
                  y="280"
                  textAnchor="middle"
                  className="axis-label"
                >
                  {item.month}
                </text>
              ))}
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const HealthTrendTable = () => (
    <div className="chart-container">
      <h3 className="chart-title">Phân tích xu hướng sức khỏe thú cưng</h3>
      <div className="health-trend-table">
        {healthTrendData.map((item, index) => (
          <div key={index} className="health-trend-row">
            <div className="health-condition">{item.condition}</div>
            <div className="health-count">{item.count} ca</div>
            <div className={`health-trend ${item.trend >= 0 ? 'positive' : 'negative'}`}>
              {item.trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              {Math.abs(item.trend)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // MỚI: Component hiển thị Lịch sử hoạt động
  const RecentActivityFeed = ({ data }) => (
    <div className="chart-container recent-activity-container">
      <h3 className="chart-title">Lịch sử khám & Dịch vụ gần đây</h3>
      <div className="activity-feed">
        {data.map(item => (
          <div key={item.id} className="activity-item">
            <div className="activity-icon">
              <MedicineBoxOutlined />
            </div>
            <div className="activity-details">
              <div className="activity-pet-service">
                <span className="pet-name">{item.petName}</span>
                <span className="service-name">{item.service}</span>
              </div>
              <div className="activity-meta">
                <span className="date"><CalendarOutlined /> {item.date}</span>
                <span className="cost"><DollarOutlined /> {formatCurrency(item.cost)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


  return (
    <div className="statistics-dashboard">
      <style jsx>{`
        .statistics-dashboard {
          padding: 24px;
          background: linear-gradient(135deg, #fff9e6 0%, #fff4d6 100%);
          min-height: 100vh;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.1);
        }
        
        .header-title {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .header-icon {
          font-size: 36px;
          color: #FFD700;
        }
        
        .title-text {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }
        
        .header-controls {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        
        .year-selector {
          padding: 8px 16px;
          border: 2px solid #FFD700;
          border-radius: 8px;
          background: white;
          color: #333;
          font-weight: 500;
        }
        
        .tab-navigation {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }
        
        .tab-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          background: white;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .tab-btn.active {
          background: #FFD700;
          color: white;
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }
        
        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(255, 215, 0, 0.15);
        }
        
        .stat-card__content {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .stat-card__icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        
        .stat-card__info {
          flex: 1;
        }
        
        .stat-card__title {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }
        
        .stat-card__value {
          font-size: 32px;
          font-weight: bold;
          color: #333;
          margin-bottom: 4px;
        }
        
        .stat-card__unit {
          font-size: 14px;
          color: #999;
        }
        
        .stat-card__trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          margin-top: 8px;
        }
        
        .stat-card__trend.positive {
          color: #52c41a;
        }
        
        .stat-card__trend.negative {
          color: #ff4d4f;
        }
        
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 24px;
        }
        
        .chart-container {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .chart-title {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          margin-bottom: 24px;
          text-align: center;
        }
        
        .pie-chart-wrapper {
          display: flex;
          align-items: center;
          gap: 40px;
          justify-content: center;
        }
        
        .pie-chart {
          width: 200px;
          height: 200px;
        }
        
        .pie-svg {
          width: 100%;
          height: 100%;
        }
        
        .pie-center-text {
          fill: #666;
          font-size: 12px;
        }
        
        .pie-center-value {
          fill: #333;
          font-size: 16px;
          font-weight: bold;
        }
        
        .pie-legend {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }
        
        .legend-label {
          flex: 1;
          font-weight: 500;
        }
        
        .legend-value {
          font-weight: bold;
          color: #FFD700;
        }
        
        .bar-chart {
          height: 300px;
        }
        
        .bar-chart-content {
          display: flex;
          align-items: end;
          justify-content: space-around;
          height: 240px;
          padding: 0 20px;
          border-bottom: 2px solid #f0f0f0;
        }
        
        .bar-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .bar-stack {
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
          min-width: 40px;
        }
        
        .bar-segment {
          width: 40px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .bar-segment:hover {
          opacity: 0.8;
        }
        
        .bar-label {
          font-size: 12px;
          color: #666;
          writing-mode: horizontal-tb;
          text-align: center;
        }
        
        .bar-legend {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 16px;
        }
        
        .line-chart {
          height: 300px;
        }
        
        .line-chart-content {
          width: 100%;
          height: 100%;
        }
        
        .line-svg {
          width: 100%;
          height: 100%;
        }
        
        .axis-label {
          font-size: 12px;
          fill: #666;
        }
        
        .health-trend-table {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .health-trend-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: #fafafa;
          border-radius: 8px;
          border-left: 4px solid #FFD700;
        }
        
        .health-condition {
          font-weight: 500;
          color: #333;
        }
        
        .health-count {
          color: #666;
          font-weight: 500;
        }
        
        .health-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: bold;
        }
        
        .health-trend.positive {
          color: #52c41a;
        }
        
        .health-trend.negative {
          color: #ff4d4f;
        }

        /* MỚI: CSS cho Lịch sử hoạt động */
        .recent-activity-container .activity-feed {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 280px; /* Chiều cao tối đa để có thanh cuộn */
          overflow-y: auto;
          padding-right: 8px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          background: #fafafa;
          border-radius: 8px;
          border-left: 4px solid #FFA500;
        }

        .activity-icon {
          font-size: 20px;
          color: #FFA500;
          background-color: #FFA50020;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .activity-details {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .activity-pet-service {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .activity-pet-service .pet-name {
          font-weight: bold;
          color: #333;
        }

        .activity-pet-service .service-name {
          font-size: 14px;
          color: #666;
        }

        .activity-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          font-size: 12px;
          color: #888;
        }

        .activity-meta .date, .activity-meta .cost {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        @media (max-width: 768px) {
          .statistics-dashboard {
            padding: 16px;
          }
          
          .dashboard-header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .charts-grid {
            grid-template-columns: 1fr;
          }
          
          .pie-chart-wrapper {
            flex-direction: column;
            gap: 24px;
          }

          .activity-details {
            flex-direction: column;
            align-items: flex-start;
          }

          .activity-meta {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            margin-top: 8px;
          }
        }
      `}</style>

      <div className="dashboard-header">
        <div className="header-title">
          <TrophyOutlined className="header-icon" />
          <h1 className="title-text">Thống kê quản lý thú cưng</h1>
        </div>
        <div className="header-controls">
          <select className="year-selector" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <PieChartOutlined /> Tổng quan
        </button>
        <button 
          className={`tab-btn ${activeTab === 'registration' ? 'active' : ''}`}
          onClick={() => setActiveTab('registration')}
        >
          <UserOutlined /> Đăng ký thú cưng
        </button>
        <button 
          className={`tab-btn ${activeTab === 'revenue' ? 'active' : ''}`}
          onClick={() => setActiveTab('revenue')}
        >
          <DollarOutlined /> Doanh thu
        </button>
        <button 
          className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`}
          onClick={() => setActiveTab('health')}
        >
          <HeartOutlined /> Sức khỏe
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<UserOutlined />}
          title="Tổng thú cưng đăng ký"
          value={totalPetsRegistered.toLocaleString()}
          unit="con"
          trend={8.5}
          color="#FFD700"
        />
        <StatCard
          icon={<DollarOutlined />}
          title="Tổng doanh thu"
          value={formatCurrency(totalRevenue)}
          unit=""
          trend={revenueGrowth}
          color="#FFA500"
        />
        <StatCard
          icon={<MedicineBoxOutlined />}
          title="Lượt khám chữa bệnh"
          value="1,247"
          unit="lượt"
          trend={12.3}
          color="#FF8C00"
        />
        <StatCard
          icon={<HeartOutlined />}
          title="Tỷ lệ khỏe mạnh"
          value="94.5"
          unit="%"
          trend={2.1}
          color="#FFB347"
        />
      </div>

      {/* THAY ĐỔI: Cập nhật logic hiển thị để thêm component mới */}
      <div className="charts-grid">
        {(activeTab === 'overview' || activeTab === 'revenue') && (
            <PieChart data={serviceUsageData} title="Tỉ lệ sử dụng dịch vụ" />
        )}
        
        {/* MỚI: Chỉ hiển thị Lịch sử hoạt động ở tab Tổng quan */}
        {activeTab === 'overview' && (
            <RecentActivityFeed data={recentActivityData} />
        )}

        {(activeTab === 'overview' || activeTab === 'revenue') && (
          <LineChart data={revenueData} title="Xu hướng doanh thu theo tháng" />
        )}
        
        {(activeTab === 'overview' || activeTab === 'registration') && (
          <BarChart 
            data={petRegistrationData} 
            title="Thống kê đăng ký thú cưng theo loài" 
            keys={['dogs', 'cats', 'birds', 'others']}
            colors={['#FFD700', '#FFA500', '#FF8C00', '#FFB347']}
          />
        )}
        
        {(activeTab === 'overview' || activeTab === 'health') && (
          <HealthTrendTable />
        )}
      </div>
    </div>
  );
};

export default Statistics;