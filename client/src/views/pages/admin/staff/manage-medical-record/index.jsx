import React, { useEffect, useState } from 'react';
import { Table, Typography, Form, Button } from 'antd'; // Giữ lại Button để dùng trong Modal
import { toast } from 'react-toastify';
import service from 'api/service';

// Các component con của bạn (giữ nguyên)
import MedicalRecordModal from '../pet-info/pet-modal/medical_record';
import CreateRecord from './create-record';


// --- BẢNG MÀU "VÀNG VÀNG CUTE" ---
const theme = {
    pageBg: '#fffaf0',          // Nền vàng kem
    cardBg: '#ffffff',          // Nền bảng màu trắng để nổi bật
    cardShadow: 'rgba(224, 185, 68, 0.15)', // Bóng đổ màu vàng nhạt
    primaryYellow: '#ffd54f',    // Màu vàng nắng cho các nút chính
    yellowHover: '#ffc107',     // Màu vàng đậm hơn khi hover
    textPrimary: '#5d4037',     // Chữ chính màu nâu đậm
    textSecondary: '#a1887f',   // Chữ phụ màu nâu nhạt
    border: '#ffecb3',          // Viền vàng nhạt
    statusGreenBg: '#e8f5e9',   // Nền tag xanh lá
    statusGreenText: '#4caf50', // Chữ tag xanh lá
    statusGrayBg: '#f5f5f5',    // Nền tag xám
    statusGrayText: '#757575',  // Chữ tag xám
};

// --- COMPONENT NÚT BẤM "CUTE" TÙY CHỈNH ---
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

    const primaryStyle = { // Style cho nút "Xem chi tiết"
        backgroundColor: theme.primaryYellow,
        color: theme.textPrimary,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    };
    const primaryHoverStyle = {
        backgroundColor: theme.yellowHover,
        transform: 'translateY(-2px)',
    };

    const secondaryStyle = { // Style cho nút "Tạo hồ sơ" (giống dashed)
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


// --- STYLE OBJECTS CHO COMPONENT CHÍNH ---
const styles = {
    pageWrapper: {
        backgroundColor: theme.pageBg,
        padding: '24px',
        minHeight: '100vh',
        fontFamily: "'Nunito', sans-serif",
    },
    header: {
        textAlign: 'center',
        marginBottom: '24px',
    },
    title: {
        color: theme.textPrimary,
        fontWeight: '800',
    },
    tableWrapper: {
        background: theme.cardBg,
        borderRadius: '16px',
        padding: '8px',
        boxShadow: `0 8px 30px ${theme.cardShadow}`,
        overflow: 'hidden',
    },
    tableHeaderCell: {
        backgroundColor: '#fffde7',
        color: theme.textPrimary,
        fontWeight: '700',
        borderBottom: `2px solid ${theme.border}`,
    },
    statusTagBase: {
        padding: '4px 12px',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '12px',
        display: 'inline-block',
    },
};


// --- COMPONENT CHÍNH ---
const ManageMedicalRecord = () => {
    // Toàn bộ logic của bạn được giữ nguyên
    const [dataTable, setDataTable] = useState([]);
    const [medicalRecordVisible, setMedicalRecordVisible] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [selectedPet, setSelectedPet] = useState({});
    const [formCreate] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const data = { appointment_id: selectedPet.id, ...values };
            const res = await service.createMedicalRecord(data);
            if (res && res.status === 201) {
                toast.success(`Đã tạo hồ sơ thành công! ✨`);
                fetchData(); // Tải lại dữ liệu để cập nhật
            }
        } catch (error) {
            toast.error("Oops! Có lỗi xảy ra.");
        } finally {
            setIsModalCreate(false);
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
                    .sort((a,b) => b.id - a.id);
                setDataTable(dataComplete);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Các cột vẫn giữ nguyên nội dung, chỉ thêm style
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
                    ...styles.statusTagBase,
                    backgroundColor: isCreated ? theme.statusGreenBg : theme.statusGrayBg,
                    color: isCreated ? theme.statusGreenText : theme.statusGrayText,
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
                    isCreated ? setMedicalRecordVisible(true) : setIsModalCreate(true);
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
            <header style={styles.header}>
                <Typography.Title level={2} style={styles.title}>
                    Hồ Sơ Khám Bệnh
                </Typography.Title>
            </header>
            
            <div style={styles.tableWrapper}>
                <Table
                    columns={columns}
                    dataSource={dataTable}
                    pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'] }}
                    // Bỏ `bordered` để có giao diện sạch sẽ hơn
                />
            </div>
            
            {/* Các Modal của bạn giữ nguyên, không cần thay đổi */}
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
        </div>
    );
};

export default ManageMedicalRecord;