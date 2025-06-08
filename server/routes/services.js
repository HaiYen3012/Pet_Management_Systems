const {
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
  updateMedicalRecord,
} = require('../controllers/servicesAppointment.controller')
const {
  createBeauty,
  allBeauty,
  getAllBeautybyUser_ID,
  getBeautybyID,
  deleteBeauty,
  updateBeauty,
  getBeautybyPet_ID,
} = require('../controllers/servicesBeauty.controller')
const {
  createStorageService,
  getAllStorageService,
  getStorageServicebyID,
  getStorageServicebyUser_ID,
  deleteStorageService,
  updateStorageService,
  updateStorageServiceStatus,
  getAllRoom,
} = require('../controllers/servicesStorage.controller')
const { servicePet } = require('../controllers/pets.controller')
const {
  servicePrice,
  allPrice,
} = require('../controllers/servicePrice.controller')
const router = require('express').Router()
const verifyStaff = require('../middleware/verifyStaff')
const verifyToken = require('../middleware/verifyToken')

router.use(verifyToken)
// Appointment
router.route('/CreateAppointment').post(createAppointment)
router
  .route('/getAllAppointmentbyUserSession')
  .get(getAllAppointmentbyUserSession)
router.route('/getAllAppointmentbyPetId').get(getAllAppointmentbyPetId)
router.route('/getAppointmentbyID').get(getAppointmentbyID)
router.route('/deleteAppointment').delete(deleteAppointment)
router.route('/updateAppointment').put(updateAppointment)
router.route('/updateStatus').put(updateAppointmentStatus)

//Medical Records
router.route('/CreateMedicalRecord').post(createMedicalRecord)
router
  .route('/getMedicalRecordsbyAppointmentId')
  .get(getMedicalRecordsByAppointmentId)
router.route('/getMedicalRecordsbyPetId').get(getMedicalRecordsbyPetId)
router.route('/updateMedicalRecord').put(updateMedicalRecord)

// Storage
router.route('/CreateStorageService').post(createStorageService)
router.route('/getAllStorageService').get(verifyStaff, getAllStorageService)
router.route('/getStorageServicebyID').get(verifyStaff, getStorageServicebyID)
router.route('/getStorageServicebyUser_ID').get(getStorageServicebyUser_ID)
router.route('/deleteStorageService').delete(deleteStorageService)
router.route('/updateStorageService').put(updateStorageService)
router.route('/allRoom').get(getAllRoom)

// Beauty
router.route('/createBeauty').post(createBeauty)
router.route('/allBeauty').get(allBeauty)
router.route('/getAllBeautybyUser_ID').get(getAllBeautybyUser_ID)
router.route('/getBeautybyPet_ID').get(getBeautybyPet_ID)
router.route('/getBeautybyID').get(verifyStaff, getBeautybyID)
router.route('/deleteBeauty').delete(verifyStaff, deleteBeauty)
router.route('/updateBeauty').put(updateBeauty)

router.route('/detailPet').get(servicePet)

router.route('/servicePrice').get(servicePrice)
router.route('/allPrice').get(allPrice)
module.exports = router
