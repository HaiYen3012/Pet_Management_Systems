import React, { useEffect, useState } from 'react';
import service from 'api/service';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { formatDateIsoString } from 'helpers/formartdate';

// --- ICONS (Sử dụng SVG để dễ dàng tùy chỉnh màu sắc và kích thước) ---
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

// --- COMPONENTS ĐÃ ĐƯỢC THIẾT KẾ LẠI VỚI TÔNG MÀU VÀNG - NÂU ---

function MedicalRecordTitle({ title, date }) {
  return (
    <div className="pb-4 mb-6 border-b-2 border-amber-200/80">
      <h1 className="text-4xl font-bold text-amber-900">{title}</h1>
      <p className="mt-1 text-base text-amber-700">{date}</p>
    </div>
  );
}

function MedicalRecordDetail({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-4 px-4 py-3 border-b border-amber-200/50 last:border-b-0">
      <div className="col-span-1 font-semibold text-amber-800">{label}</div>
      <div className="col-span-2 text-amber-900 not-italic">{value}</div>
    </div>
  );
}

function MedicalRecord({ diagnostic, symptoms }) {
  return (
    <div className="bg-amber-50 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-amber-800 mb-4">Thông tin khám bệnh</h3>
        <div className="flex flex-col">
          <MedicalRecordDetail label="Triệu chứng:" value={symptoms || "Chưa cập nhật"} />
          <MedicalRecordDetail label="Chuẩn đoán:" value={diagnostic || "Chưa cập nhật"} />
          <MedicalRecordDetail label="Tiền sử bệnh lý:" value="Không có" />
        </div>
      </div>
    </div>
  );
}

function PrescriptionTable({ prescriptions }) {
  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div className="mt-8 text-center text-amber-700 p-8 bg-amber-50 rounded-xl shadow-lg">
        Không có đơn thuốc nào.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-amber-900 mb-4">Đơn thuốc</h2>
      <div className="overflow-x-auto bg-amber-50 rounded-xl shadow-lg">
        <table className="w-full text-left">
          <thead className="bg-amber-400 text-white">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-sm">STT</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-sm">Tên thuốc</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-sm">Ghi chú/Liều dùng</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-sm text-right">Số lượng</th>
            </tr>
          </thead>
          <tbody className="text-amber-800">
            {prescriptions.map((prescription, index) => (
              <tr key={index} className="border-t border-amber-200/80 hover:bg-amber-200/60 transition-colors">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-amber-900">{prescription.medicine}</td>
                <td className="px-6 py-4">{prescription.note}</td>
                <td className="px-6 py-4 text-right">{prescription.dosage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaginationButton({ children, active, onClick }) {
  const baseClasses = "flex justify-center items-center w-10 h-10 text-base font-semibold rounded-lg transition-colors duration-200";
  const activeClasses = "bg-amber-500 text-white shadow-md cursor-default";
  const inactiveClasses = "bg-amber-50/80 text-amber-800 border border-amber-300 hover:bg-amber-200/80 hover:border-amber-400";

  return (
    <button onClick={onClick} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
      {children}
    </button>
  );
}

function PaginationArrow({ direction, onClick, disabled }) {
  const classes = `flex justify-center items-center w-10 h-10 bg-amber-50/80 text-amber-800 border border-amber-300 rounded-lg transition-colors duration-200 ${
    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-200/80 hover:border-amber-400'
  }`;

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {direction === 'prev' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </button>
  );
}

export function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  return (
    <div className="flex justify-end items-center gap-2 mt-8">
      <PaginationArrow direction="prev" onClick={() => {/* Logic lùi trang */}} disabled={currentPage === 1} />
      {[1, 2, 3, 4, 5].map(page => (
        <PaginationButton key={page} active={currentPage === page} onClick={() => setCurrentPage(page)}>
          {page}
        </PaginationButton>
      ))}
      <PaginationArrow direction="next" onClick={() => {/* Logic tiến trang */}} disabled={currentPage === totalPages} />
    </div>
  );
}

// --- MAIN COMPONENT ---

export function MedicalRecordSection() {
  const [medicalRecords, setMedicalRecords] = useState({});
  const [prescriptions, setPrescription] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    setLoading(true);
    const params = { pet_id: slug };
    service
      .getMedicalRecordsbyPetId(params)
      .then((res) => {
        setMedicalRecords(res.data.medicalRecords || {});
        setPrescription(res.data.prescriptions || []);
        if (!res.data.medicalRecords) {
           setError(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-amber-100">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 40, color: '#a16207' }} spin />}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4 bg-amber-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-semibold text-amber-900">Không tìm thấy hồ sơ</h2>
          <p className="text-amber-700 mt-2">Thú cưng này hiện chưa có hồ sơ bệnh án nào.</p>
      </div>
    );
  }

  return (
    // Nền chính màu vàng ấm
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-amber-100 min-h-screen">
      <div className="w-full">
        <MedicalRecordTitle
          title="Hồ sơ bệnh án"
          date={`Ngày khám: ${formatDateIsoString(medicalRecords.created_at)}`}
        />
        <MedicalRecord {...medicalRecords} />
        <PrescriptionTable prescriptions={prescriptions} />
        <Pagination />
      </div>
    </div>
  );
}