import React, { useEffect, useState } from 'react';
import service from 'api/service';
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { formatDateIsoString } from 'helpers/formartdate';

function MedicalRecordTitle({ title, date }) {
  return (
    <div className="flex gap-1 self-start mb-4">
      <div className="text-3xl font-medium leading-10 text-black text-opacity-80">
        {title}
      </div>
      <div className="my-auto text-sm leading-5 text-black text-opacity-50">
        {date}
      </div>
    </div>
  );
}

function MedicalRecordDetail({ label, value }) {
  return (
    <div className="flex gap-10 p-2">
      <div className="text-base w-40 font-medium leading-6 text-black text-opacity-80">
        {label}
      </div>
      <div className="text-sm not-italic">{value}</div>
    </div>
  );
}

function MedicalRecord({diagnostic, neutered, symptoms, }) {
  return (
    <div className="flex flex-col justify-center bg-white rounded-sm border border-solid border-zinc-100 p-4">
      <MedicalRecordDetail label="Triệu chứng :" value={symptoms} />
      <MedicalRecordDetail label="Chuẩn đoán :" value={diagnostic} />
      <MedicalRecordDetail label="Tiền sử bệnh lý :" value="Không có" />
    </div>
  );
}

function PrescriptionTable({prescriptions}) {
 

  // const prescriptions = [
  //   {
  //     name: 'Thuốc đau bụng',
  //     description: 'Sáng 2 viên, tối 2 viên sau ăn',
  //     unit: 'Viên',
  //     amount: 30,
  //   },
  //   {
  //     name: 'Thuốc đau bụng',
  //     description: 'Sáng 2 viên, tối 2 viên sau ăn',
  //     unit: 'Viên',
  //     amount: 30,
  //   },
  //   {
  //     name: 'Thuốc đau bụng',
  //     description: 'Sáng 2 viên, tối 2 viên sau ăn',
  //     unit: 'Viên',
  //     amount: 30,
  //   },
  // ];

  return (
    <div className=" w-full mt-4">
      <table className="w-full bg-white border border-solid border-zinc-100">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-4 py-2 text-left border-b border-solid border-black border-opacity-10">STT</th>
            <th className="px-4 py-2 text-left border-b border-solid border-black border-opacity-10">Tên thuốc</th>
            <th className="px-4 py-2 text-left border-b border-solid border-black border-opacity-10">Mô tả</th>
            {/* <th className="px-4 py-2 text-left border-b border-solid border-black border-opacity-10">Đơn vị tính</th> */}
            <th className="px-4 py-2 text-left border-b border-solid border-black border-opacity-10">Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((prescription, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border-b border-solid border-black border-opacity-10">{index + 1}</td>
              <td className="px-4 py-2 border-b border-solid border-black border-opacity-10">{prescription.medicine}</td>
              <td className="px-4 py-2 border-b border-solid border-black border-opacity-10">{prescription.note}</td>
              {/* <td className="px-4 py-2 border-b border-solid border-black border-opacity-10">{prescription.unit}</td> */}
              <td className="px-4 py-2 border-b border-solid border-black border-opacity-10">{prescription.dosage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaginationButton({ children, active }) {
  return (
    <div
      className={`flex justify-center items-center px-2 py-px w-8 h-8 text-sm leading-6 text-center whitespace-nowrap bg-white rounded-sm border ${active
          ? 'border-sky-500 text-sky-500'
          : 'border-zinc-300 text-black text-opacity-80'
        } border-solid`}
    >
      {children}
    </div>
  );
}

function PaginationArrow({ src, alt }) {
  return (
    <div className="flex justify-center items-center p-2.5 w-8 h-8 bg-white rounded-sm border border-solid border-zinc-300">
      <img loading="lazy" src={src} alt={alt} className="w-3 aspect-square" />
    </div>
  );
}

export function Pagination() {
  return (
    <div className="flex gap-2 self-end mt-4">
      <PaginationArrow
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/220fbb8d6d949daa944f15505399166ff0f5e13155ef3440cae16321a60b187a?apiKey=f19a917c094b4f6fa8172f34eb76d09c&"
        alt="Previous page"
      />
      <PaginationButton active>1</PaginationButton>
      <PaginationButton>2</PaginationButton>
      <PaginationButton>3</PaginationButton>
      <PaginationButton>4</PaginationButton>
      <PaginationButton>5</PaginationButton>
      <PaginationArrow
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/755c430c06f4ff3914692fe640bb1afaa76d927161e5df758d7039ff333a5cbf?apiKey=f19a917c094b4f6fa8172f34eb76d09c&"
        alt="Next page"
      />
    </div>
  );
}

export function MedicalRecordSection() {
  const [medicalRecords, setMedicalRecords] = useState({})
  const [prescriptions, setPrescription] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { slug } = useParams()

  useEffect(() => {
    const params = { pet_id: slug }
    service
      .getMedicalRecordsbyPetId(params)
      .then((res) => {
        setMedicalRecords(res.data.medicalRecords)
        setPrescription(res.data.prescriptions)
        // console.log(res);
      })
      .catch((error) => {
        console.log(error);
        setError(true)
      }).finally (()=> {
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
          style={{
            height: '60vh',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
          }}
        />
      </div>
    )
  }

  if (error ) {
    return (
      <div className="flex justify-center items-center text-red-500 text-xl">
        Thú cưng hiện không có hồ sơ bệnh án
      </div>
    )
  }
  return (
    <div className="flex flex-col ml-5 w-[74%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col grow pb-4 max-md:mt-10 max-md:max-w-full">
        <MedicalRecordTitle
          title="Hồ sơ bệnh án"
          date={`Ngày khám : ${formatDateIsoString(medicalRecords.created_at)}`}
        />
        <MedicalRecord {...medicalRecords}/>
        <div className="mt-7 text-xl font-medium leading-7 text-black text-opacity-80 max-md:max-w-full">
          Đơn thuốc
        </div>
        <PrescriptionTable prescriptions={prescriptions} />
        <Pagination />
      </div>
    </div>
  );
}
