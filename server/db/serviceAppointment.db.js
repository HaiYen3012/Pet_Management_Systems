const pool = require('../config')

const createTimeSlotdb = async ({ time }) => {
  const { rows: time_slot } = await pool.query(
    `INSERT INTO time_slot(time) 
          VALUES($1) 
          returning id, time`,
    [time],
  )
  return time_slot
}

const createAppointmentdb = async ({ date, note, time_slot }) => {
  const { rows: appointment } = await pool.query(
    `INSERT INTO appointments(date, note, time_slot) 
      VALUES($1, $2, $3) 
      returning id, medical_record_id, status, date, note, time_slot`,
    [date, note, time_slot],
  )
  // console.log(Appointment[0])
  return appointment[0]
}

const createAppointmentOrderdb = async ({
  service_id,
  user_id,
  pet_id,
  total,
}) => {
  const { rows: appointment_order } = await pool.query(
    `INSERT INTO "appointment_orders"("service_id", "user_id","pet_id","total") 
        VALUES($1, $2, $3, $4) 
        returning "id", "service_id", "user_id", "pet_id", "total", "created_at"`,
    [service_id, user_id, pet_id, total],
  )
  return appointment_order[0]
}

const getAppointmentsByDateAndTimeSlotdb = async (date, time_slot) => {
  const { rows: appointments } = await pool.query(
    `SELECT * FROM appointments 
       WHERE date::date = $1::date AND time_slot = $2`,
    [date, time_slot],
  )
  return appointments
}

const getAllAppointmentbyUserSessiondb = async (user_id, isAdminStaff) => {
  let queryString = `
    SELECT 
      appointments.*,
      appointment_orders.*,
      time_slot_appointment.id AS time_slot,
      time_slot_appointment.time,
      time_slot_appointment.price,
      time_slot_appointment.unit
    FROM appointments
    INNER JOIN appointment_orders ON appointments.id = appointment_orders.service_id
    INNER JOIN time_slot_appointment ON appointments.time_slot = time_slot_appointment.id
  `
  const queryParams = []

  if (!isAdminStaff) {
    queryString += ' WHERE appointment_orders.user_id = $1'
    queryParams.push(user_id)
  }

  const { rows: appointments } = await pool.query(queryString, queryParams)

  if (appointments.length === 0) {
    return { message: 'No appointments found' }
  }
  return appointments
}

const getAllAppointmentbyPetIdDb = async (pet_id, user_id, isAdminStaff) => {
  let query
  let params

  if (isAdminStaff) {
    query = `
    SELECT 
      appointments.*,
      appointment_orders.*,
      time_slot_appointment.id AS time_slot,
      time_slot_appointment.time,
      time_slot_appointment.price,
      time_slot_appointment.unit
    FROM appointments
    INNER JOIN appointment_orders ON appointments.id = appointment_orders.service_id
    INNER JOIN time_slot_appointment ON appointments.time_slot = time_slot_appointment.id
    WHERE appointment_orders.pet_id = $1`
    params = [pet_id]
  } else {
    query = `
    SELECT 
      appointments.*,
      appointment_orders.*,
      time_slot_appointment.id AS time_slot,
      time_slot_appointment.time,
      time_slot_appointment.price,
      time_slot_appointment.unit
    FROM appointments
    INNER JOIN appointment_orders ON appointments.id = appointment_orders.service_id
    INNER JOIN time_slot_appointment ON appointments.time_slot = time_slot_appointment.id
    WHERE appointment_orders.pet_id = $1 AND appointment_orders.user_id = $2`
    params = [pet_id, user_id]
  }

  const { rows: appointmentByPetId } = await pool.query(query, params)

  if (appointmentByPetId.length === 0) {
    return { message: 'No appointment found with the specified pet_id/user_id' }
  }

  return appointmentByPetId
}

const getAppointmentbyIDdb = async (appointment_id) => {
  const { rows: appointmentById } = await pool.query(
    `SELECT 
      appointments.*,
      appointment_orders.*,
      time_slot_appointment.id AS time_slot,
      time_slot_appointment.time,
      time_slot_appointment.price,
      time_slot_appointment.unit
    FROM appointments
    INNER JOIN appointment_orders ON appointments.id = appointment_orders.service_id
    INNER JOIN time_slot_appointment ON appointments.time_slot = time_slot_appointment.id
    WHERE appointments.id = $1`,
    [appointment_id],
  )
  if (appointmentById.length === 0) {
    return { message: 'No appointment found with the specified ID' }
  }
  return appointmentById[0]
}

const deleteAppointmentdb = async (id) => {
  try {
    // Bắt đầu một transaction
    await pool.query('BEGIN')

    // Xóa các bản ghi trong bảng appointment_orders theo service_id (liên kết với id của bảng appointments)
    await pool.query('DELETE FROM appointment_orders WHERE service_id = $1', [
      id,
    ])

    // Xóa bản ghi trong bảng appointments theo id
    const { rowCount } = await pool.query(
      'DELETE FROM appointments WHERE id = $1',
      [id],
    )

    // Nếu không có bản ghi nào bị xóa, trả về thông báo không có
    if (rowCount === 0) {
      await pool.query('ROLLBACK')
      return { message: 'No appointment found with the specified ID' }
    }

    // Commit transaction nếu mọi thứ suôn sẻ
    await pool.query('COMMIT')

    return { message: 'Appointment successfully deleted' }
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await pool.query('ROLLBACK')
    console.error('Error in deleteAppointmentdb:', error)
    throw error
  }
}

const updateAppointmentdb = async ({ id, date, note, time_slot, pet_id }) => {
  try {
    // Bắt đầu transaction
    await pool.query('BEGIN')

    // Kiểm tra xem cuộc hẹn có tồn tại không
    const { rows: existingAppointment } = await pool.query(
      'SELECT * FROM appointments WHERE id = $1',
      [id],
    )

    if (existingAppointment.length === 0) {
      await pool.query('ROLLBACK')
      return { message: 'Appointment not found' }
    }

    // Kiểm tra xem đơn hàng cuộc hẹn có tồn tại không
    const { rows: existingAppointmentOrder } = await pool.query(
      'SELECT * FROM appointment_orders WHERE service_id = $1',
      [id],
    )

    if (existingAppointmentOrder.length === 0) {
      await pool.query('ROLLBACK')
      return { message: 'Appointment order not found' }
    }

    // Cập nhật thông tin trong bảng appointments
    const updateAppointmentsQuery = `
      UPDATE appointments
      SET date = $1, note = $2, time_slot = $3
      WHERE id = $4
    `
    await pool.query(updateAppointmentsQuery, [date, note, time_slot, id])

    // Cập nhật thông tin pet_id trong bảng appointment_orders
    const updateAppointmentOrdersQuery = `
      UPDATE appointment_orders
      SET pet_id = $1
      WHERE service_id = $2
    `
    await pool.query(updateAppointmentOrdersQuery, [pet_id, id])

    // Commit transaction nếu mọi thứ suôn sẻ
    await pool.query('COMMIT')

    return { message: 'Appointment successfully updated' }
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await pool.query('ROLLBACK')
    console.error('Error in updateAppointmentdb:', error)
    throw new ErrorHandler(500, 'Internal server error')
  }
}

const updateAppointmentStatusdb = async ({ id, status }) => {
  try {
    // Bắt đầu transaction
    await pool.query('BEGIN')

    // Kiểm tra xem cuộc hẹn có tồn tại không
    const { rows: existingAppointment } = await pool.query(
      'SELECT * FROM appointments WHERE id = $1',
      [id],
    )

    if (existingAppointment.length === 0) {
      await pool.query('ROLLBACK')
      return { message: 'Appointment not found' }
    }

    // Cập nhật trạng thái trong bảng appointments
    const updateStatusQuery = `
      UPDATE appointments
      SET status = $1
      WHERE id = $2
    `
    await pool.query(updateStatusQuery, [status, id])

    // Commit transaction nếu mọi thứ suôn sẻ
    await pool.query('COMMIT')

    return { message: 'Appointment status successfully updated' }
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await pool.query('ROLLBACK')
    console.error('Error in updateAppointmentStatusdb:', error)
    throw new ErrorHandler(500, 'Internal server error')
  }
}

const getPetIdFromAppointmentdb = async (appointment_id) => {
  const query = `SELECT appointment_orders.pet_id
    FROM appointment_orders
    JOIN appointments ON appointments.id = appointment_orders.service_id
    WHERE appointments.id = $1
    `
  const { rows } = await pool.query(query, [appointment_id])
  if (rows.length > 0) {
    return rows[0].pet_id
  } else {
    return null
  }
}

const createMedicalRecorddb = async ({ neutered, symptoms, diagnostic }) => {
  console.log(neutered, symptoms, diagnostic);
  const insertMedicalRecordQuery = `
    INSERT INTO medical_records (neutered, symptoms, diagnostic, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING id, neutered, symptoms, diagnostic, created_at
  `
  const { rows } = await pool.query(insertMedicalRecordQuery, [
    neutered,
    symptoms,
    diagnostic,
  ])
  return rows[0]
}

const updatePetWithMedicalRecordIddb = async (medicalRecordId, pet_id) => {
  try {
    // Bắt đầu transaction
    await pool.query('BEGIN')

    // Lấy pet_id từ bảng appointment_orders
    const getPetIdQuery = `
      SELECT pet_id
      FROM appointment_orders
      WHERE pet_id = $1
    `
    const { rows: petRows } = await pool.query(getPetIdQuery, [pet_id])

    if (petRows.length === 0) {
      throw new ErrorHandler(404, 'Pet not found for the given appointment')
    }

    const petId = petRows[0].pet_id

    // Cập nhật medical_record_id trong bảng pets
    const updatePetQuery = `
      UPDATE pets
      SET medical_record_id = $1
      WHERE pet_id = $2
    `
    await pool.query(updatePetQuery, [medicalRecordId, petId])

    // Commit transaction nếu mọi thứ suôn sẻ
    await pool.query('COMMIT')

    return { message: 'Pet medical record successfully updated' }
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await pool.query('ROLLBACK')
    console.error('Error in updatePetWithMedicalRecordId:', error)
    throw new ErrorHandler(500, 'Internal server error')
  }
}

const updateAppointmentWithMedicalRecordIddb = async (
  medicalRecordId,
  appointment_id,
) => {
  try {
    const updateAppointmentQuery = `
      UPDATE appointments
      SET medical_record_id = $1
      WHERE id = $2
    `
    await pool.query(updateAppointmentQuery, [medicalRecordId, appointment_id])

    return { message: 'Appointment medical record successfully updated' }
  } catch (error) {
    console.error('Error in updateAppointmentWithMedicalRecordId:', error)
    throw new ErrorHandler(500, 'Internal server error')
  }
}

const createPrescriptiondb = async ({
  medicine,
  dosage,
  note,
  medical_record_id,
}) => {
  const query = `
    INSERT INTO prescription_item (medicine, dosage, note, medical_record_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `
  const values = [medicine, dosage, note, medical_record_id]
  try {
    const { rows } = await pool.query(query, values)
    return rows[0]
  } catch (error) {
    throw new Error('Database insertion error')
  }
}

const getMedicalRecordsByAppointmentIdDb = async (appointment_id) => {
  try {
    const query = `
      SELECT *
      FROM medical_records
      WHERE id IN (SELECT medical_record_id FROM appointments WHERE id = $1);
      `
    const { rows } = await pool.query(query, [appointment_id])
    // console.log(rows)
    return rows[0]
  } catch (error) {
    throw new Error(
      'Error in getAllMedicalRecordsByAppointmentIdDb: ' + error.message,
    )
  }
}

const getPrescriptionsByMedicalRecordIdDb = async (medical_recordId) => {
  try {
    const query = `
      SELECT *
      FROM prescription_item
      WHERE medical_record_id = $1;
      `
    const { rows } = await pool.query(query, [medical_recordId])
    // console.log(rows)
    return rows
  } catch (error) {
    throw new Error(
      'Error in getPrescriptionsByMedicalRecordIdDb: ' + error.message,
    )
  }
}

const getMedicalRecordsbyPetIdDb = async (pet_id) => {
  try {
    const query = `
      SELECT *
      FROM medical_records
      WHERE id IN (SELECT medical_record_id FROM pets WHERE pet_id = $1);
      `
    const { rows } = await pool.query(query, [pet_id])
    // console.log(rows)
    return rows[0]
  } catch (error) {
    throw new Error('Error in getMedicalRecordsbyPetIdDb: ' + error.message)
  }
}

const updateMedicalRecordDb = async ({
  medical_record_id,
  neutered,
  symptoms,
  diagnostic,
}) => {
  const query = `
    UPDATE medical_records
    SET neutered = $1, symptoms = $2, diagnostic = $3
    WHERE id = $4
    RETURNING *
  `
  const values = [neutered, symptoms, diagnostic, medical_record_id]
  console.log(values)
  try {
    const { rows } = await pool.query(query, values)
    return rows[0]
  } catch (error) {
    throw new Error('Database update error')
  }
}

const updatePrescriptiondb = async (newPrescriptions) => {
  try {
    const medical_record_id =
      newPrescriptions.length > 0 ? newPrescriptions[0].medical_record_id : null
    const selectQuery = `
      SELECT *
      FROM prescription_item
      WHERE medical_record_id = $1
    `
    const selectValues = [medical_record_id]
    const { rows: pre_items } = await pool.query(selectQuery, selectValues)
    const preItemIds = pre_items.map((item) => item.id)
    console.log('preItemIds:', preItemIds)
    let index = 0
    for (let id of preItemIds) {
      const prescription = pre_items.find((item) => item.id === id)
      if (prescription) {
        const { medicine, dosage, note } = newPrescriptions[index]
        const query = `
              UPDATE prescription_item
              SET medicine = $1, dosage = $2, note = $3
              WHERE id = $4
              RETURNING *
          `
        const updateValues = [medicine, dosage, note, id]
        try {
          await pool.query(query, updateValues)
          console.log(`updateValues`, updateValues)
          index++
        } catch (error) {
          console.error(
            `Error updating prescription item with ID ${id}: ${error}`,
          )
          throw new Error('Database update error')
        }
      } else {
        console.error(
          `Prescription item with ID ${id} not found in newPrescriptions`,
        )
      }
    }
    return 'Prescription items updated successfully'
  } catch (error) {
    console.error(`Error updating prescriptions: ${error}`)
    throw new Error('Database update error')
  }
}
module.exports = {
  createTimeSlotdb,

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
}
