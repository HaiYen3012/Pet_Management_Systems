import React, { useEffect, useState } from 'react';
import { Button, Form, Spin, InputNumber, Popconfirm, Table, Typography, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import './manage-staff.scss';
import ModalStaff from "./modalStaff"
import staff from 'api/staff';
import { toast } from 'react-toastify';

const StaffManage = () => {
    const [form] = Form.useForm();
    const dataModalDefault = {
        key: "",
        user_id: "",
        fullname: "",
        username: "",
        email: "",
        phone_numbers: "",
        address: "",
        city: "",
        country: "",
        created_at: "",
    }
    const [listStaff, setListStaff] = useState(dataModalDefault);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [action, setAction] = useState('');
    const [dataModal, setDataModal] = useState({});

    const handleOk = () => {
        setIsModalOpen(false);
        setAction('');
        setDataModal(dataModalDefault);
        form.resetFields();
    };

    const showModal = () => {
        setIsModalOpen(true);
    }

    const handleCancel = () => {
        setDataModal(dataModalDefault);
        setAction('');
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleCreate = () => {
        setDataModal(dataModalDefault);
        setAction("CREATE");
        showModal();
    };

    const convertDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        const formattedDate = `${hours}:${minutes}:${seconds} ${day}/${month}/${year} `;
        return formattedDate;
    };

    const fetchData = async () => {
        const data = (await staff.getAllStaff()).data;
        const modifiedData = data.map((item) => {
            let newItem = {
                ...item,
                key: item.user_id,
                created_at: convertDate(item.created_at)
            }
            return newItem;
        });
        setListStaff(modifiedData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'user_id',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.user_id - b.user_id,
            fixed: 'left',
            width: '60px',
        },
        {
            title: 'Tên nhân viên',
            dataIndex: 'fullname',
            fixed: 'left',
        },
        {
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            width: '140px',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '220px',
        },
        {
            title: 'SĐT',
            dataIndex: 'phone_numbers',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
        },
        {
            title: 'Thành phố',
            dataIndex: 'city',
        },
        {
            title: 'Quốc tịch',
            dataIndex: 'country',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
        },
        {
            title: 'Cập nhật',
            width: 95,
            render: (text, record) => {
                const handleUpdate = () => {
                    setAction("UPDATE");
                    setDataModal(record);
                    showModal();
                }
                return (
                    <Button onClick={() => handleUpdate()}  >
                        <EditOutlined style={{ fontSize: '20px', color: 'orange' }} />
                    </Button >
                )
            },
            fixed: 'right',
        },
        {
            title: 'Xóa',
            width: 90,
            render: (text, record) => {
                const handleDelete = async () => {
                    console.log(record);
                    await staff.deleteStaff(record.user_id);
                    toast.success("Xóa nhân viên thành công!")
                    fetchData();
                }
                return (
                    <Popconfirm
                        title="Xóa nhân viên"
                        description="Bạn có chắc chắn muốn xóa?"
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => handleDelete()}
                    >
                        <Button danger>
                            <DeleteOutlined style={{ fontSize: '20px', color: 'red' }} />
                        </Button>
                    </Popconfirm>
                )
            },
            fixed: 'right',
        },
    ];

    return (
        <>
            <div className="manage-customer__container">
                <Space style={{ width: '100%', justifyContent: 'center' }}>
                    <Typography.Title level={2}>Quản lý nhân viên</Typography.Title>
                    <br /><br />
                </Space>


                <div className="manage-customer__content">
                    <Button onClick={handleCreate} type="primary" style={{ marginBottom: 16, width: "100px" }} >
                        <PlusOutlined />Thêm
                    </Button>
                    {
                        listStaff && listStaff.length > 0
                            ?
                            <Table
                                columns={columns}
                                dataSource={listStaff}
                                pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'] }}
                                bordered
                                scroll={{
                                    x: 1500,
                                }}
                            />
                            :
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
                                style={{
                                    height: '100vh',
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            />
                    }

                </div>
            </div>

            <ModalStaff
                form={form}
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                action={action}
                dataModal={dataModal}
                fetchData={fetchData}
            />
        </>

    )
}

export default StaffManage;
