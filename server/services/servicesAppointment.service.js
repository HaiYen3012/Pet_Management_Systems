const { ErrorHandler } = require('../helpers/error')
const {
  createAppointmentdb,
  createAppointmentOrderdb,
  getAppointmentsByDateAndTimeSlotdb,
  getAllAppointmentbyUserSessiondb,
  getAllAppointmentbyPetIdDb,
  getAppointmentbyIDdb,
  deleteAppointmentdb,
  updateAppointmentdb,
  updateAppointmentStatusdb,

  getPetIdFromAppointmentdb,
  createMedicalRecorddb,
  updatePetWithMedicalRecordIddb,
  updateAppointmentWithMedicalRecordIddb,
  createPrescriptiondb,

  getPrescriptionsByMedicalRecordIdDb,
  getMedicalRecordsByAppointmentIdDb,
  getMedicalRecordsbyPetIdDb,
  updateMedicalRecordDb,
  updatePrescriptiondb,
} = require('../db/serviceAppointment.db')

class ServiceAppointment {
  //Apointment

  createAppointment = async (appointment) => {
    try {
      return await createAppointmentdb(appointment)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }

  createAppointmentOrder = async (appointment_order) => {
    try {
      return await createAppointmentOrderdb(appointment_order)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }

  getAppointmentsByDateAndTimeSlot = async (date, time_slot) => {
    try {
      return await getAppointmentsByDateAndTimeSlotdb(date, time_slot)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, error.message)
    }
  }

  getAllAppointmentbyUserSession = async (user_id, isAdminStaff) => {
    try {
      // console.log(user_id)
      return await getAllAppointmentbyUserSessiondb(user_id, isAdminStaff)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(
        error.statusCode,
        'getAllAppointmentbyUserSession False',
      )
    }
  }

  getAllAppointmentbyPetId = async (pet_id, user_id, isAdminStaff) => {
    try {
      // console.log(user_id)
      return await getAllAppointmentbyPetIdDb(pet_id, user_id, isAdminStaff)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(
        error.statusCode,
        'getAllAppointmentbyPetIdDb False',
      )
    }
  }

  getAppointmentbyID = async (appointment_id) => {
    try {
      // console.log(user_id)
      return await getAppointmentbyIDdb(appointment_id)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, 'getAppointmentbyID False')
    }
  }

  deleteAppointment = async (id) => {
    try {
      return await deleteAppointmentdb(id)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, 'deleteAppointment False')
    }
  }

  updateAppointment = async (update_appointment) => {
    try {
      // console.log(update_appointment);
      return await updateAppointmentdb(update_appointment)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, 'updateAppointment False')
    }
  }

  updateAppointmentStatus = async (response) => {
    try {
      console.log(response)
      return await updateAppointmentStatusdb(response)
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(error.statusCode, 'updateAppointmentStatus False')
    }
  }

  getPetIdFromAppointment = async (appointment_id) => {
    try {
      return await getPetIdFromAppointmentdb(appointment_id)
    } catch (error) {
      console.error('Error fetching pet_id from appointment_orders:', error)
      throw error
    }
  }

  createMedicalRecord = async (newMedicalRecord) => {
    try {
      return await createMedicalRecorddb(newMedicalRecord)
    } catch (error) {
      throw new ErrorHandler(error.statusCode, 'createMedicalRecord False')
    }
  }

  updatePetWithMedicalRecordId = async (medicalRecordId, pet_id) => {
    try {
      return await updatePetWithMedicalRecordIddb(medicalRecordId, pet_id)
    } catch (error) {
      throw new ErrorHandler(
        error.statusCode,
        'Update pets with medical_record_id False',
      )
    }
  }

  updateAppointmentWithMedicalRecordId = async (
    medicalRecordId,
    appointment_id,
  ) => {
    try {
      return await updateAppointmentWithMedicalRecordIddb(
        medicalRecordId,
        appointment_id,
      )
    } catch (error) {
      throw new ErrorHandler(
        error.statusCode,
        'Update appointments with medical_record_id False',
      )
    }
  }

  createPrescription = async (newPrescriptions) => {
    try {
      // Dùng Promise.all để chèn nhiều đơn thuốc vào cơ sở dữ liệu cùng lúc
      const createdPrescriptions = await Promise.all(
        newPrescriptions.map(async (prescription) => {
          // console.log("Prescription to insert:", prescription);
          return await createPrescriptiondb(prescription)
        }),
      )
      return createdPrescriptions
    } catch (error) {
      throw new ErrorHandler(500, 'createPrescription False')
    }
  }
  getMedicalRecordsByAppointmentId = async (appointment_id) => {
    try {
      return await getMedicalRecordsByAppointmentIdDb(appointment_id)
    } catch (error) {
      throw new Error(
        'Error in getMedicalRecordsByAppointmentIdDb service: ' + error.message,
      )
    }
  }
  getPrescriptionsByMedicalRecordId = async (medical_recordId) => {
    try {
      return await getPrescriptionsByMedicalRecordIdDb(medical_recordId)
    } catch (error) {
      throw new Error(
        'Error in getPrescriptionsByMedicalRecordId service: ' + error.message,
      )
    }
  }
  getMedicalRecordsbyPetId = async (pet_id) => {
    try {
      return await getMedicalRecordsbyPetIdDb(pet_id)
    } catch (error) {
      throw new Error(
        'Error in getMedicalRecordsbyPetIdDb service: ' + error.message,
      )
    }
  }

  updateMedicalRecord = async (updatedMedicalRecord) => {
    try {
      return await updateMedicalRecordDb(updatedMedicalRecord)
    } catch (error) {
      throw new ErrorHandler(
        error.statusCode,
        'Update pets with medical_record_id False',
      )
    }
  }

  updatePrescription = async (newPrescriptions) => {
    try {
      return await updatePrescriptiondb(newPrescriptions)
    } catch (error) {
      console.error(`Error in updatePrescription service: ${error.message}`)
      throw new ErrorHandler(500, 'updatePrescription False')
    }
  }
}

module.exports = new ServiceAppointment()
