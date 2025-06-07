import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Radio, Table, Space, Typography } from 'antd';
import staff from 'api/staff';
import { toast } from 'react-toastify';
import service from 'api/service';
import { EditOutlined } from '@ant-design/icons'
import MedicalRecordModal from '../pet-info/pet-modal/medical_record';
import CreateRecord from './create-record';

const ManageMedicalRecord = () => {

    const [dataTable, setDataTable] = useState([]);
    const [medicalRecordVisible, setMedicalRecordVisible] = useState(false)
    const [isModalCreate, setIsModalCreate] = useState(false)
    const [selectedPet, setSelectedPet] = useState({})
    const [formCreate] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const data = {
                appointment_id: selectedPet.id,
                ...values,
            }
            const res = await service.createMedicalRecord(data);
            if (res && res.status === 201) {
                toast(`Thêm hồ sơ khám bệnh thành công cho thú cưng ${selectedPet.id}`);
            }
            setIsModalCreate(false)

        } catch (error) {
            console.log(error);
            setIsModalCreate(false)
        }
    }

    const handleOk = () => {
        setIsModalCreate(false)
        formCreate.resetFields()
    }

    const handleCancel = () => {
        setIsModalCreate(false)
        formCreate.resetFields()
    }

    const showMedicalRecord = () => {
        setMedicalRecordVisible(true)
    }

    const hideMedicalRecord = () => {
        setMedicalRecordVisible(false)
    }
    const fetchData = async () => {
        try {
            const res = await service.getAllAppointment();
            console.log(res);
            if (res && res.status === 201) {
                const data = res.data.allAppointment;
                console.log(data);
                const dataComplete = data
                    .filter((item) => item.status === 'complete')
                    .map((item) => {
                        const statusRecord = item.medical_record_id ? 'Đã tạo' : 'Chưa tạo';
                        return {
                            ...item,
                            statusRecord
                        };
                    });
                console.log(dataComplete);
                setDataTable(dataComplete);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const columns = [
        {
            title: 'Appointment ID',
            dataIndex: 'id',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.id - b.id,
            fixed: 'left',
            width: '10px',
        },
        {
            title: 'Pet Id',
            dataIndex: 'pet_id',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.medical_record_id - b.medical_record_id,
            fixed: 'left',
            width: '10px',
        },
        {
            title: 'User Id',
            dataIndex: 'user_id',
            width: '10px',
        },
        {
            title: 'Medical Record Id',
            dataIndex: 'medical_record_id',
            width: '10px',
        },
        {
            title: 'Trạng thái hồ sơ',
            dataIndex: 'statusRecord',
            width: '140px',
        },
        {
            title: '',
            width: 95,
            render: (text, record) => {
                const handleOnClick = () => {
                    console.log(record);
                    const newRecord = {
                        ...record,
                        pet_id: parseInt(record.pet_id, 10)
                    }
                    setSelectedPet(newRecord)
                    record.statusRecord === 'Chưa tạo'
                        ?
                        setIsModalCreate(true)
                        :
                        setMedicalRecordVisible(true)

                }
                return (
                    <Button onClick={() => handleOnClick()} type={record.statusRecord === 'Chưa tạo' ? 'dashed' : "primary"} >
                        {record.statusRecord === 'Chưa tạo' ? 'Tạo hồ sơ' : 'Xem chi tiết'}
                    </Button >
                )
            },
            fixed: 'right',
        },
    ];

    return (
        <div className="manage-medical-record">
            <Space style={{ width: '100%', justifyContent: 'center' }}>
                <Typography.Title level={2}>Hồ sơ khám bệnh</Typography.Title>
                <br /><br />
            </Space>
            <Table
                columns={columns}
                dataSource={dataTable}
                pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'] }}
                bordered
            />
            <MedicalRecordModal
                visible={medicalRecordVisible}
                onCancel={hideMedicalRecord}
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
    )
}

export default ManageMedicalRecord;