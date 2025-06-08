import React, { useState, useEffect, useCallback } from 'react';
import { Table, Checkbox, Button, Typography, Space, Select, Modal, Form, Input, Card } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import ServiceHistoryAPI from 'api/service/service-history';
import { toast } from 'react-toastify';
import './ServiceHistory.scss';

const { Option } = Select;
const { confirm } = Modal;
const { Title } = Typography;

function ServiceHistory() {
  const [allServices, setAllServices] = useState([]); // Lưu trữ tất cả dịch vụ
  const [filteredRows, setFilteredRows] = useState([]); // Dữ liệu hiển thị trên bảng
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBankFormVisible, setBankFormVisible] = useState(false);
  const [bankForm] = Form.useForm();

  // Tối ưu: Chỉ fetch dữ liệu một lần khi component mount
  useEffect(() => {
    const fetchAllServices = async () => {
      setLoading(true);
      try {
        const detailPetResponse = await ServiceHistoryAPI.getDetailPet();
        const servicesData = detailPetResponse.data.flatMap(pet =>
          pet.services.map(service => ({
            ...service,
            pet_name: pet.pet_name,
            species: pet.species,
            status: service.status === 'complete' ? 'completed' : service.status, // Chuẩn hóa status
          }))
        );
        console.log('Dữ liệu dịch vụ:', servicesData); // Kiểm tra dữ liệu
        setAllServices(servicesData);
        setFilteredRows(servicesData); // Ban đầu hiển thị tất cả
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu: ", error);
        toast.error("Không thể tải lịch sử dịch vụ.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllServices();
  }, []);

  // Tối ưu: Lọc dữ liệu trên client thay vì gọi lại API
  const handleStatusFilter = (value) => {
    if (value === 'all') {
      setFilteredRows(allServices);
    } else {
      const filteredData = allServices.filter(row => row.status === value);
      setFilteredRows(filteredData);
    }
  };

  const handleCancelService = async () => {
    const servicesToUpdate = allServices.filter(row => selected.includes(row.order_id));
    
    // Sử dụng Promise.all để xử lý song song và bắt lỗi tốt hơn
    try {
      await Promise.all(
        servicesToUpdate.map(service => {
          const body = { id: service.id, status: 'canceled' };
          switch (service.service_type) {
            case 'beauty': return ServiceHistoryAPI.cancelBeauty(body);
            case 'storage': return ServiceHistoryAPI.cancelStorageService(body);
            case 'appointment': return ServiceHistoryAPI.cancelAppointment(body);
            default: return Promise.reject(new Error('Loại dịch vụ không xác định'));
          }
        })
      );
  
      // Cập nhật lại state sau khi tất cả API thành công
      const updatedServices = allServices.map(row =>
        selected.includes(row.order_id) ? { ...row, status: 'canceled' } : row
      );
      setAllServices(updatedServices);
      setFilteredRows(updatedServices); // Cập nhật lại bảng với toàn bộ dữ liệu đã sửa
      setSelected([]);
      setBankFormVisible(false);
      bankForm.resetFields();
      toast.success("Đã hủy dịch vụ thành công!");
    } catch (error) {
      console.error("Lỗi khi hủy dịch vụ: ", error);
      toast.error("Có lỗi xảy ra, không thể hủy dịch vụ.");
    }
  };

  const showConfirmCancel = () => {
    const selectedRows = allServices.filter(row => selected.includes(row.order_id));
    if (selected.length === 0) {
      toast.warn("Vui lòng chọn dịch vụ cần hủy.");
      return;
    }

    const alreadyCanceled = selectedRows.some(row => row.status === 'canceled');
    if (alreadyCanceled) {
      Modal.error({
        title: 'Không thể thực hiện',
        content: 'Một trong các dịch vụ bạn chọn đã được hủy trước đó.',
      });
      return;
    }

    confirm({
      title: 'Bạn chắc chắn muốn hủy dịch vụ đã chọn?',
      icon: <ExclamationCircleOutlined />,
      content: 'Dịch vụ sẽ được hoàn tiền theo chính sách. Vui lòng cung cấp thông tin để nhận hoàn tiền.',
      okText: 'Đồng ý hủy',
      cancelText: 'Không',
      okButtonProps: { danger: true },
      onOk: () => setBankFormVisible(true),
    });
  };

  const getStatusTag = (status) => (
    <span className={`status-tag ${status}`}>{status}</span>
  );

  const columns = [
    {
      key: 'checkbox',
      width: 60,
      render: (_, record) => (
        <Checkbox 
          checked={selected.includes(record.order_id)} 
          onChange={() => {
            const newSelected = selected.includes(record.order_id)
              ? selected.filter(id => id !== record.order_id)
              : [...selected, record.order_id];
            setSelected(newSelected);
          }} 
        />
      )
    },    
    { title: 'ID Dịch Vụ', dataIndex: 'order_id', key: 'order_id', width: 120 },
    { title: 'Tên Thú Cưng', dataIndex: 'pet_name', key: 'pet_name' },
    { title: 'Loại Dịch Vụ', dataIndex: 'service_type', key: 'service_type', render: (text) => text.charAt(0).toUpperCase() + text.slice(1) },
    {
      title: 'Ngày Đăng Ký',
      dataIndex: 'service_date',
      key: 'service_date',
      render: (text) => moment(text).format('DD/MM/YYYY')
    },
    { title: 'Tổng Tiền', dataIndex: 'total', key: 'total', render: (text) => `${Number(text).toLocaleString('vi-VN')} ₫` },
    { title: 'Trạng Thái', dataIndex: 'status', key: 'status', render: getStatusTag },
  ];

  return (
    <div className="service-history-page">
      <Card className="service-history-card">
        <div className="service-history-header">
          <Title level={2}>Lịch sử Dịch vụ</Title>
          <div className="service-history-controls">
            <Select defaultValue="all" onChange={handleStatusFilter} style={{ width: 150 }}>
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="created">Đã tạo</Option>
              <Option value="processing">Đang xử lý</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="canceled">Đã hủy</Option>
            </Select>
            <Button type="primary" danger className="btn-cancel-service" onClick={showConfirmCancel}>
              Hủy Dịch Vụ
            </Button>
          </div>
        </div>

        <Table 
          className="service-history-table"
          dataSource={filteredRows} 
          columns={columns} 
          rowKey="order_id" 
          pagination={{ pageSize: 8, showSizeChanger: false }}
          loading={loading}
        />
      </Card>
      
      <Modal
        title="Thông Tin Nhận Hoàn Tiền"
        className="bank-info-modal"
        open={isBankFormVisible}
        onCancel={() => {
          setBankFormVisible(false);
          bankForm.resetFields();
        }}
        footer={null}
        centered
      >
        <Form form={bankForm} onFinish={handleCancelService} layout="vertical">
          <Form.Item
            name="accountNumber"
            label="Số tài khoản"
            rules={[{ required: true, message: 'Vui lòng nhập số tài khoản!' }]}
          >
            <Input placeholder="Nhập số tài khoản ngân hàng của bạn" />
          </Form.Item>
          <Form.Item
            name="bankName"
            label="Tên Ngân hàng"
            rules={[{ required: true, message: 'Vui lòng chọn ngân hàng!' }]}
          >
            <Select placeholder="Chọn từ danh sách">
              <Option value="AgriBank">Agribank</Option>
              <Option value="VietinBank">VietinBank</Option>
              <Option value="MB Bank">MB Bank</Option>
              <Option value="Techcombank">Techcombank</Option>
              <Option value="Vietcombank">Vietcombank</Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginTop: 24 }}>
            <Button type="primary" htmlType="submit" className="btn-confirm-refund">
              Xác nhận và Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ServiceHistory;