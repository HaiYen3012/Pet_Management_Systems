const petService = require('../services/pets.service')
const userService = require('../services/users.service')
const { ErrorHandler } = require('../helpers/error')
const serviceAppointment = require('../services/servicesAppointment.service')
const timeSlotService = require('../services/time_slot.service')
// Appointment
const createAppointment = async (req, res) => {
  const { date, note, time_slot, pet_id } = req.body
  const { user_id } = req.user
  total = 0.0
  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (+user_id === req.user.user_id || req.user.roles.include('admin') || req.user.roles.include('staff')) {
    const currentDate = new Date()
    const appointmentDate = new Date(date)
    // Kiểm tra nếu date nhỏ hơn hôm nay
    if (appointmentDate < currentDate.setHours(0, 0, 0, 0)) {
      throw new ErrorHandler(400, 'The appointment date cannot be in the past.')
    }
    // Kiểm tra time_slot trong bảng time_slot
    const timeSlot = await timeSlotService.getTimeSlotApointment(time_slot)
    if (!timeSlot) {
      throw new ErrorHandler(404, 'Time slot not found')
    }

    const [hours, minutes] = timeSlot.time.split(':').map(Number)
    const appointmentTime = new Date(date)
    appointmentTime.setHours(hours, minutes, 0, 0)

    // Nếu ngày hẹn là hôm nay và thời gian hẹn nhỏ hơn thời gian hiện tại
    if (
      appointmentDate.toDateString() === currentDate.toDateString() &&
      appointmentTime < new Date()
    ) {
      throw new ErrorHandler(400, 'The appointment time cannot be in the past.')
    }
    // Kiểm tra trùng lặp date và time_slot nếu trạng thái không phải 'canceled' hoặc 'completed'
    const existingAppointments =
      await serviceAppointment.getAppointmentsByDateAndTimeSlot(date, time_slot)
    if (
      existingAppointments.some(
        (app) => app.status !== 'canceled' && app.status !== 'completed',
      )
    ) {
      throw new ErrorHandler(
        400,
        'The time slot is already booked for the selected date.',
      )
    }

    const appointment = await serviceAppointment.createAppointment({
      date,
      note,
      time_slot,
    })
    let service_id = appointment.id
    const appointment_order = await serviceAppointment.createAppointmentOrder({
      service_id,
      user_id,
      pet_id,
      total,
    })

    res.status(201).json({
      status: 'success',
      appointment,
      appointment_order,
    })
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const getAllAppointmentbyUserSession = async (req, res) => {
  const { user_id, roles } = req.user

  const user = await userService.getUserById(user_id)
  const isAdminStaff = roles.includes('admin') || roles.includes('staff');

  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (+user_id === req.user.user_id || isAdminStaff) {
    const allAppointment = await serviceAppointment.getAllAppointmentbyUserSession(
      user_id,
      isAdminStaff,
    )
    res.status(201).json({
      status: 'success',
      allAppointment,
    })
    console.log(user_id)
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const getAllAppointmentbyPetId = async (req, res) => {
  const { user_id, roles } = req.user
  const{ pet_id } = req.query
  const user = await userService.getUserById(user_id)
  const isAdminStaff = roles.includes('admin') || roles.includes('staff');
  // const pet = await petService.getPetById(pet_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (+user_id === req.user.user_id || isAdminStaff) {
    const allAppointment = await serviceAppointment.getAllAppointmentbyPetId(
      pet_id, user_id, isAdminStaff
    )
    res.status(201).json({
      status: 'success',
      allAppointment,
    })
    console.log(user_id)
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const getAppointmentbyID = async (req, res) => {
  const { user_id } = req.user;

  try {
    const user = await userService.getUserById(user_id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const { appointment_id } = req.query;

    if (!appointment_id) {
      return res.status(400).json({ status: 'error', message: 'Missing appointment_id query parameter' });
    }

    const appointmentById = await serviceAppointment.getAppointmentbyID(appointment_id);
    if (!appointmentById) {
      return res.status(404).json({ status: 'error', message: 'Appointment not found' });
    }

    const hasAccess = req.user.roles.includes('admin') || req.user.roles.includes('staff') || appointmentById.user_id === +user_id;

    if (hasAccess) {
      return res.status(200).json({
        status: 'success',
        appointmentById,
      });
    } else {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

const deleteAppointment = async (req, res) => {
  const { user_id } = req.user
  const { id } = req.body
  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (+user_id === req.user.user_id || req.user.roles.includes('admin') || req.user.roles.include('staff')) {
    const delete_appointment = await serviceAppointment.deleteAppointment(id)
    res.status(200).json({
      status: 'success',
      delete_appointment,
    })
  } else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const updateAppointment = async (req, res) => {
  const { user_id } = req.user
  const user = await userService.getUserById(user_id)
  if (!user) {
    throw new ErrorHandler(404, 'User not found')
  }
  if (req.user.roles.includes('admin') || req.user.roles.includes('staff')) {
    const { id, date, note, time_slot, pet_id, status } = req.body
    const validStatuses = ['complete', 'canceled', 'processing']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status',
      })
    }
    const update_appointment = await serviceAppointment.updateAppointment({id,date,note,time_slot,pet_id})
    const response = await serviceAppointment.updateAppointmentStatus({id,status})
    if (response.message === 'Appointment not found') {
      return res.status(404).json({
        status: 'error',
        message: response.message,
      })
    }    
    res.status(200).json({
      status: 'success',
      message: response.message,
    })
    
  }else if(req.user.roles.includes('customer')) {
    const { id, date, note, time_slot, pet_id, status } = req.body;
    if (!status){ 
      const response = await serviceAppointment.updateAppointment({id,date,note,time_slot,pet_id})
      return res.status(200).json({
        status: 'success',
        message: response.message
      })
    }
    if (status !== 'canceled') {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized action',
      })
    }
    if (!date || !note || !time_slot || !pet_id) {
    const response = await serviceAppointment.updateAppointmentStatus({
      id,
      status,
    })
      return res.status(200).json({
        status: 'success',
        message: response.message,
      })          
    }
    const response = await serviceAppointment.updateAppointmentStatus({id,status})
    if (response.message === 'Appointment not found') {
      return res.status(404).json({
        status: 'error',
        message: response.message,
      })
    }
    await serviceAppointment.updateAppointment({id,date,note,time_slot,pet_id});
    res.status(200).json({      
      status: 'success',
      message: response.message})
  }else {
    throw new ErrorHandler(401, 'Unauthorized')
  }
}

const updateAppointmentStatus = async (req, res) => {
  const { id, status } = req.body
  const validStatuses = ['complete', 'canceled', 'processing']
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid status',
    })
  }

  try {
    if (req.user.roles.includes('admin') || req.user.roles.includes('staff')) {
      const response = await serviceAppointment.updateAppointmentStatus({
        id,
        status,
      })
      if (response.message === 'Appointment not found') {
        return res.status(404).json({
          status: 'error',
          message: response.message,
        })
      }

      res.status(200).json({
        status: 'success',
        message: response.message,
      })
    } else if (req.user.roles.includes('customer')) {
      // Customer chỉ có thể hủy (canceled) cuộc hẹn
      if (status !== 'canceled') {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized action',
        })
      }

      const response = await serviceAppointment.updateAppointmentStatus({
        id,
        status,
      })
      if (response.message === 'Appointment not found') {
        return res.status(404).json({
          status: 'error',
          message: response.message,
        })
      }

      res.status(200).json({
        status: 'success',
        message: response.message,
      })
    } else {
      throw new ErrorHandler(401, 'Unauthorized')
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    })
  }
}

const getPetIdFromAppointment = async (appointment_id) => {
  try {
    const pet_id = await serviceAppointment.getPetIdFromAppointment(appointment_id);
    return pet_id;
  } catch (error) {
    console.error('Error in getPetIdFromAppointmentOrder:', error);
    throw error;
  }
};

const createMedicalRecord = async (req, res) => {
  const { appointment_id, neutered, symptoms, diagnostic, prescriptions } = req.body;
  const { user_id } = req.user;

  const user = await userService.getUserById(user_id);
  if (!user) {
    throw new ErrorHandler(404, 'User not found');
  }

  if (req.user.roles.includes('admin') || req.user.roles.includes('staff')) {
    try {
      // Kiểm tra trạng thái của cuộc hẹn
      const appointment = await serviceAppointment.getAppointmentbyID(appointment_id);

      // Kiểm tra xem cuộc hẹn có tồn tại không
      if (!appointment) {
        return res.status(404).json({
          status: "error",
          message: "Appointment not found",
        });
      }

      // Lấy trạng thái của cuộc hẹn từ đối tượng appointment
      const status = appointment.status;
      if (status !== 'complete') {
        return res.status(400).json({
          status: "error",
          message: "Appointment must be completed before creating a medical record.",
        });
      }

      // Tạo medical_record mới
      const newMedicalRecord = await serviceAppointment.createMedicalRecord({ neutered, symptoms, diagnostic });
      const medicalRecordId = newMedicalRecord.id;


      const newPrescriptions = prescriptions.map(prescription => ({
        ...prescription,
        medical_record_id: medicalRecordId
      }));

      // Tạo các đơn thuốc mới
      const createdPrescriptions = await serviceAppointment.createPrescription(newPrescriptions);
      // Cập nhật medical_record_id trong bảng appointments
      await serviceAppointment.updateAppointmentWithMedicalRecordId(medicalRecordId, appointment_id);

      // Lấy pet_id từ bảng appointment_orders
      const pet_id = await getPetIdFromAppointment(appointment_id);

      // Cập nhật medical_record_id trong bảng pets
      const petUpdateResponse = await serviceAppointment.updatePetWithMedicalRecordId(medicalRecordId, pet_id);

      res.status(201).json({
        status: "success",
        medicalRecord: newMedicalRecord,
        new_prescriptions: createdPrescriptions,
        message: petUpdateResponse.message,
        appointment_message: appointment.message,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  } else {
    throw new ErrorHandler(401, 'Unauthorized');
  }
};

const getMedicalRecordsByAppointmentId = async (req, res) => {
  const { appointment_id } = req.query;
  const { user_id } = req.user;

  const user = await userService.getUserById(user_id);
  if (!user) {
    throw new ErrorHandler(404, 'User not found');
  }

  if (+user_id === req.user.user_id || req.user.roles.include('admin') || req.user.roles.include('staff')) {
    try {
      const medicalRecords = await serviceAppointment.getMedicalRecordsByAppointmentId(appointment_id);
      let medical_recordId = medicalRecords.id;
      // console.log(medical_recordId)
      const prescriptions = await serviceAppointment.getPrescriptionsByMedicalRecordId(medical_recordId);
      res.status(200).json({ status: 'success', medicalRecords, prescriptions });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

const getMedicalRecordsbyPetId = async (req, res) => {
  const { pet_id } = req.query;
  const { user_id } = req.user;

  const user = await userService.getUserById(user_id);
  if (!user) {
    throw new ErrorHandler(404, 'User not found');
  }

  if (+user_id === req.user.user_id || req.user.roles.include('admin') || req.user.roles.include('staff')) {
    try {
      const medicalRecords = await serviceAppointment.getMedicalRecordsbyPetId(pet_id);
      let medical_recordId = medicalRecords.id;
      // console.log(medical_recordId)
      const prescriptions = await serviceAppointment.getPrescriptionsByMedicalRecordId(medical_recordId);
      res.status(200).json({ status: 'success', medicalRecords, prescriptions });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

const updateMedicalRecord = async (req, res) => {
  const { medical_record_id, neutered, symptoms, diagnostic, prescriptions } = req.body;

  try {
    // Kiểm tra vai trò của người dùng
    if (req.user.roles.includes('admin') || req.user.roles.includes('staff')) {
      // Gọi hàm service để thực hiện cập nhật thông tin y tế
      const updatedMedicalRecord = await serviceAppointment.updateMedicalRecord({medical_record_id, neutered, symptoms, diagnostic, prescriptions });
      
      const newPrescriptions = prescriptions.map(prescription => ({
        ...prescription,
        medical_record_id: medical_record_id
      }));
      // console.log("New Prescriptions after mapping:", newPrescriptions);
      // Cập nhật các đơn thuốc mới
      const updatedPrescriptions = await serviceAppointment.updatePrescription(newPrescriptions);
      res.status(200).json({
        status: 'success',
        message: 'Medical record updated successfully',
        updatedMedicalRecord,
        updatedPrescriptions
      });
    } else {
      // Nếu không có quyền truy cập, trả về lỗi Unauthorized
      throw new ErrorHandler(401, 'Unauthorized');
    }
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};


module.exports = {
  createAppointment,
  getAllAppointmentbyUserSession,
  getAllAppointmentbyPetId,
  getAppointmentbyID,
  deleteAppointment,
  updateAppointment,
  updateAppointmentStatus,

  createMedicalRecord,
  getMedicalRecordsByAppointmentId,
  getMedicalRecordsbyPetId,
  updateMedicalRecord
}
