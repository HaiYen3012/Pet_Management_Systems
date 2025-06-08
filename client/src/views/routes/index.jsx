import loadableComponent from 'utils/loadable-component'
import React from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import MainLayout from 'components/layouts/MainLayout'
import Register from 'views/pages/register'
import ForgotPassword from 'views/pages/forgot-password/forgot-password'
import ResetPassword from 'views/pages/forgot-password/reset-password'
import Homepage from 'views/pages/homePage'
import { RoleProtectedRoute } from './role.protected.route'
import GuestRoute from './guest-route'
import ManageMedicalRecord from 'views/pages/admin/staff/manage-medical-record'

const PetList = loadableComponent(() => import('views/pages/customer/info-pet'))
const PetInfo = loadableComponent(
  () => import('views/pages/customer/info-pet/PetInfo'),
)
const ServiceRegisterPet = loadableComponent(
  () => import('views/pages/customer/service-register'),
)
const ServiceHistory = loadableComponent(
  () => import('views/pages/customer/service-history'),
)
const ServiceCost = loadableComponent(
  () => import('views/pages/customer/service-cost'),
)

const StaffManage = loadableComponent(
  () => import('views/pages/admin/staff/manage-staff'),
)
const ManageCustomer = loadableComponent(
  () => import('views/pages/admin/customer/manage-customer'),
)
const Statistics = loadableComponent(
  () => import('views/pages/admin/statistics/statistics'),
)
const PetInfoOverview = loadableComponent(
  () => import('views/pages/admin/staff/pet-info/info_overview'),
)

const CleaningInfo = loadableComponent(
  () =>
    import(
      'views/pages/admin/staff/service-management/cleaning-service/cleaning_info'
    ),
)
const CleaningServiceUsage = loadableComponent(
  () =>
    import(
      'views/pages/admin/staff/service-management/cleaning-service/cleaning_useage'
    ),
)
const MedicalInfo = loadableComponent(
  () =>
    import(
      'views/pages/admin/staff/service-management/medical-service/medical_info'
    ),
)
const MedicalServiceUsage = loadableComponent(
  () =>
    import(
      'views/pages/admin/staff/service-management/medical-service/medical_useage'
    ),
)
const StorageInfo = loadableComponent(
  () =>
    import(
      'views/pages/admin/staff/service-management/storage-service/storage_info'
    ),
)
const StorageServiceUsage = loadableComponent(
  () =>
    import(
      'views/pages/admin/staff/service-management/storage-service/storage_useage'
    ),
)

const Login = loadableComponent(() => import('views/pages/login'))
const PersonalInfo = loadableComponent(
  () => import('views/pages/customer/personal-info'),
)

const AddStaffForm = loadableComponent(
  () => import('views/pages/admin/staff/staff-info/add_form'),
)
const UpdateStaffForm = loadableComponent(
  () => import('views/pages/admin/staff/staff-info/update_form'),
)
const PetManager = loadableComponent(
  () => import('views/pages/staff/pet-manager'),
)

function AllRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />

        <Route element={<RoleProtectedRoute roles={['customer']} />}>
          <Route path="/pet" element={<MainLayout component={PetList} />} />
          <Route
            path="/pet/basic-info/:slug"
            element={<MainLayout component={PetInfo} />}
          />

          <Route
            path="/service-register"
            element={<MainLayout component={ServiceRegisterPet} />}
          />
          <Route
            path="/service-history"
            element={<MainLayout component={ServiceHistory} />}
          />
          <Route
            path="/service-cost"
            element={<MainLayout component={ServiceCost} />}
          />
        </Route>

        <Route element={<RoleProtectedRoute roles={['staff']} />}>
          <Route
            path="/staff/pet-manage"
            element={<MainLayout component={PetInfoOverview} />}
          />
          <Route
            path="/staff/customer-manage"
            element={<MainLayout component={ManageCustomer} />}
          />
          <Route
            path="/staff/medical-record-manage"
            element={<MainLayout component={ManageMedicalRecord} />}
          />
        </Route>

        <Route element={<RoleProtectedRoute roles={['admin']} />}>
          <Route
            path="/admin/statistics"
            element={<MainLayout component={Statistics} />}
          />
          <Route
            path="/admin/staff-manage"
            element={<MainLayout component={StaffManage} />}
          />
          <Route
            path="/admin/customer-manage"
            element={<MainLayout component={ManageCustomer} />}
          />
          <Route
            path="/admin/pet-manage"
            element={<MainLayout component={PetInfoOverview} />}
          />
          <Route
            path="/admin/staff-manage/add"
            element={<MainLayout component={AddStaffForm} />}
          />
          <Route
            path="/admin/staff-manage/update"
            element={<MainLayout component={UpdateStaffForm} />}
          />
          <Route
            path="/admin/medical-record-manage"
            element={<MainLayout component={ManageMedicalRecord} />}
          />
        </Route>

        <Route element={<RoleProtectedRoute roles={['staff', 'admin']} />}>
          <Route
            path="/cleaning-info"
            element={<MainLayout component={CleaningInfo} />}
          />
          <Route
            path="/cleaning-used"
            element={<MainLayout component={CleaningServiceUsage} />}
          />
          <Route
            path="/medical-info"
            element={<MainLayout component={MedicalInfo} />}
          />
          <Route
            path="/medical-used"
            element={<MainLayout component={MedicalServiceUsage} />}
          />
          <Route
            path="/storage-info"
            element={<MainLayout component={StorageInfo} />}
          />
          <Route
            path="/storage-used"
            element={<MainLayout component={StorageServiceUsage} />}
          />
        </Route>

        <Route
          element={
            <RoleProtectedRoute roles={['staff', 'customer', 'admin']} />
          }
        >
          <Route
            path="/personal-info"
            element={<MainLayout component={PersonalInfo} />}
          />
        </Route>

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="*">Cook</Route>
      </Routes>
    </>
  )
}

export default AllRoutes
