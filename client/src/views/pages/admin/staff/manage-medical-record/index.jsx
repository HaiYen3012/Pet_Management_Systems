import React, { useEffect, useState } from 'react';
import { Table, Typography, Form, Button, Input, Select, Card, Space, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import service from 'api/service';
import MedicalRecordModal from '../pet-info/pet-modal/medical_record';
import CreateRecord from './create-record';

// --- BẢNG MÀU "VÀNG VÀNG CUTE" ---
const theme = {
    pageBg: '#fffaf0',          // Nền vàng kem
    cardBg: '#ffffff',          // Nền bảng màu trắng
    cardShadow: 'rgba(224, 185, 68, 0.15)', // Bóng đổ vàng nhạt
    primaryYellow: '#ffd54f',    // Màu vàng nắng
    yellowHover: '#ffc107',     // Màu vàng đậm hơn khi hover
    textPrimary: '#5d4037',     // Chữ chính nâu đậm
    textSecondary: '#a1887f',   // Chữ phụ nâu nhạt
    border: '#ffecb3',          // Viền vàng nhạt
    statusGreenBg: '#e8f5e9',   // Nền tag xanh lá
    statusGreenText: '#4caf50', // Chữ tag xanh lá
    statusGrayBg: '#f5f5f5',    // Nền tag xám
    statusGrayText: '#757575',  // Chữ tag xám
};

// --- COMPONENT NÚT BẤM "CUTE" ---
const ActionButton = ({ onClick, isPrimary, children }) => {
    const [isHovered, setIsHovered] = useState(false);

    const baseStyle = {
        padding: '6px 14px',
        borderRadius: '8px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: "'Nunito', sans-serif",
        border: 'none',
        fontSize: '14px',
    };

    const primaryStyle = {
        backgroundColor: theme.primaryYellow,
        color: theme.textPrimary,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    };
    const primaryHoverStyle = {
        backgroundColor: theme.yellowHover,
        transform: 'translateY(-2px)',
    };

    const secondaryStyle = {
        backgroundColor: 'transparent',
        color: theme.primaryYellow,
        border: `2px dashed ${theme.primaryYellow}`,
    };
    const secondaryHoverStyle = {
        backgroundColor: 'rgba(255, 213, 79, 0.1)',
        color: theme.yellowHover,
        borderColor: theme.yellowHover,
    };

    let finalStyle = isPrimary ? { ...baseStyle, ...primaryStyle } : { ...baseStyle, ...secondaryStyle };
    if (isHovered) {
        finalStyle = isPrimary ? { ...finalStyle, ...primaryHoverStyle } : { ...finalStyle, ...secondaryHoverStyle };
    }

    return (
        <button
            style={finalStyle}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </button>
    );
};

// --- STYLE OBJECTS ---
const styles = {
    pageWrapper: {
        background: 'linear-gradient(135deg, #fff8dc 0%, #ffebcd 50%, #ffefd5 100%)',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: "'Nunito', sans-serif",
    },
    cardWrapper: {
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
        border: '2px solid #ffd700',
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: 'linear-gradient(45deg, #fff8dc, #ffebcd)',
        borderRadius: '16px',
        border: '1px solid #ffd700',
    },
    title: {
        color: '#b8860b',
        marginBottom: '8px',
        textShadow: '2px 2px 4px rgba(255, 215, 0, 0.3)',
    },
    description: {
        color: 'gray',
        fontSize: '16px',
        margin: 0,
        fontWeight: '500',
    },
    searchForm: {
        background: 'linear-gradient(45deg, #fff8dc, #ffebcd)',
        border: '2px solid #ffd700',
        padding: '15px',
        borderRadius: '20px',
        boxShadow: '0 4px 16px rgba(255, 215, 0, 0.2)',
    },
    table: {
        background: '#fffacd',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '2px solid #ffd700',
    },
    tableHeaderCell: {
        backgroundColor: '#fffde7',
        color: theme.textPrimary,
        fontWeight: '700',
        borderBottom: `2px solid ${theme.border}`,
    },
    statusTag: {
        padding: '4px 20px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '500',
    },
};

// --- COMPONENT CHÍNH ---
const ManageMedicalRecords = () => {
    const [form] = Form.useForm();
    const [dataTable, setDataTable] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [medicalRecordVisible, setMedicalRecordVisible] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [selectedPet, setSelectedPet] = useState({});
    const [formCreate] = Form.useForm();

    const fetchData = async () => {
        try {
            const res = await service.getAllAppointment();
            if (res && res.status === 201) {
                const dataComplete = res.data.allAppointment
                    .filter((item) => item.status === 'complete')
                    .map((item) => ({
                        ...item,
                        key: item.id,
                        statusRecord: item.medical_record_id ? 'Đã tạo' : 'Chưa tạo',
                    }))
                    .sort((a, b) => b.id - a.id);
                setDataTable(dataComplete);
                setOriginalData(dataComplete);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Lỗi khi tải danh sách hồ sơ.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onFinish = async (values) => {
        try {
            const data = { appointment_id: selectedPet.id, ...values };
            const res = await service.createMedicalRecord(data);
            if (res && res.status === 201) {
                toast.success('Đã tạo hồ sơ thành công! ✨');
                fetchData();
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo hồ sơ.');
        } finally {
            setIsModalCreate(false);
            formCreate.resetFields();
        }
    };

    const handleOk = () => {
        setIsModalCreate(false);
        formCreate.resetFields();
    };

    const handleCancel = () => {
        setIsModalCreate(false);
        formCreate.resetFields();
    };

    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        if (value === '') {
            setDataTable(originalData);
        } else {
            const filteredData = originalData.filter((record) =>
                record.pet_id && record.pet_id.toString().toLowerCase().includes(value)
            );
            setDataTable(filteredData);
        }
    };

    const handleSortChange = (value) => {
        const [field, order] = value.split('-');
        const sorted = [...dataTable].sort((a, b) => {
            const dateA = moment(a[field]);
            const dateB = moment(b[field]);
            if (dateA.isBefore(dateB)) return order === 'ascend' ? -1 : 1;
            if (dateA.isAfter(dateB)) return order === 'ascend' ? 1 : -1;
            return 0;
        });
        setDataTable(sorted);
    };

    const columns = [
        {
            title: 'Appointment ID',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
            onHeaderCell: () => ({ style: styles.tableHeaderCell }),
        },
        {
            title: 'Pet ID',
            dataIndex: 'pet_id',
            onHeaderCell: () => ({ style: styles.tableHeaderCell }),
        },
        {
            title: 'User ID',
            dataIndex: 'user_id',
            onHeaderCell: () => ({ style: styles.tableHeaderCell }),
        },
        {
            title: 'Medical Record ID',
            dataIndex: 'medical_record_id',
            render: (id) => id || '---',
            onHeaderCell: () => ({ style: styles.tableHeaderCell }),
        },
        {
            title: 'Trạng thái hồ sơ',
            dataIndex: 'statusRecord',
            onHeaderCell: () => ({ style: styles.tableHeaderCell }),
            render: (status) => {
                const isCreated = status === 'Đã tạo';
                const tagStyle = {
                    ...styles.statusTag,
                    backgroundColor: isCreated ? theme.statusGreenBg : theme.statusGrayBg,
                    color: isCreated ? theme.statusGreenText : theme.statusGrayText,
                    border: `1px solid ${isCreated ? '#b7eb8f' : '#d9d9d9'}`,
                };
                return <span style={tagStyle}>{status}</span>;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            fixed: 'right',
            align: 'center',
            onHeaderCell: () => ({ style: styles.tableHeaderCell }),
            render: (_, record) => {
                const isCreated = record.statusRecord === 'Đã tạo';
                const handleOnClick = () => {
                    setSelectedPet({ ...record, pet_id: parseInt(record.pet_id, 10) });
                    if (isCreated) {
                        setMedicalRecordVisible(true);
                    } else {
                        setIsModalCreate(true);
                    }
                };
                return (
                    <ActionButton onClick={handleOnClick} isPrimary={isCreated}>
                        {isCreated ? 'Xem chi tiết' : 'Tạo hồ sơ'}
                    </ActionButton>
                );
            },
        },
    ];

    return (
        <div style={styles.pageWrapper}>
            <Card style={styles.cardWrapper}>
                <div style={styles.header}>
                    <Typography.Title level={2} style={styles.title}>
                        Quản lý hồ sơ khám bệnh
                    </Typography.Title>
                    <p style={styles.description}>
                        Theo dõi và quản lý hồ sơ khám bệnh của thú cưng một cách hiệu quả.
                    </p>
                </div>
                <Space
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16,
                        marginLeft: 50,
                        width: '100%',
                    }}
                >
                    <Form
                        layout="inline"
                        style={styles.searchForm}
                    >
                        <Form.Item label={<span style={{ color: '#b8860b', fontWeight: '600' }}>ID thú cưng</span>}>
                            <Input
                                placeholder="Nhập ID thú cưng"
                                style={{
                                    width: 200,
                                    borderColor: '#ffd700',
                                    borderRadius: '12px',
                                    backgroundColor: '#fffacd',
                                }}
                                onChange={handleSearchChange}
                                onPressEnter={handleSearchChange}
                            />
                        </Form.Item>
                        <Button
                            type="primary"
                            onClick={handleSearchChange}
                            style={{
                                marginLeft: 8,
                                marginRight: 10,
                                background: 'linear-gradient(45deg, #ffd700, #ffb347)',
                                borderColor: '#ffd700',
                                borderRadius: '12px',
                                fontWeight: '600',
                                height: '38px',
                            }}
                        >
                            Tìm kiếm
                        </Button>
                    </Form>
                </Space>
                <Row
                    style={{
                        marginBottom: 16,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 20px',
                    }}
                >
                    <Typography.Title level={3} style={{
                        marginBottom: 0,
                        color: '#b8860b',
                        textShadow: '1px 1px 2px rgba(255, 215, 0, 0.3)',
                    }}>
                        Danh sách hồ sơ
                    </Typography.Title>
                    <Space>
                        <Select
                            placeholder="Sắp xếp theo"
                            style={{ width: 200, borderRadius: '12px' }}
                            onChange={handleSortChange}
                        >
                            <Option value="date-ascend">Ngày khám (Tăng dần)</Option>
                            <Option value="date-descend">Ngày khám (Giảm dần)</Option>
                        </Select>
                    </Space>
                </Row>
                <Form form={form} component={false}>
                    <Table
                        columns={columns}
                        dataSource={dataTable}
                        pagination={{
                            defaultPageSize: 8,
                            showSizeChanger: true,
                            pageSizeOptions: ['8', '15', '25'],
                            style: { padding: '20px' },
                        }}
                        rowKey="key"
                        style={styles.table}
                        scroll={{ x: 800 }}
                    />
                </Form>
                <MedicalRecordModal
                    visible={medicalRecordVisible}
                    onCancel={() => setMedicalRecordVisible(false)}
                    selectedPet={selectedPet}
                />
                <CreateRecord
                    isModalCreate={isModalCreate}
                    handleOk={handleOk}
                    handleCancel={handleCancel}
                    form={formCreate}
                    onFinish={onFinish}
                />
            </Card>
        </div>
    );
};

export default ManageMedicalRecords;