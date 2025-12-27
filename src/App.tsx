import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import { Toaster } from 'sonner'
import UserDashboard from './pages/User/Dashboard'
import DocDashboard from './pages/Doctor/Dashboard'
import MedDashboard from './pages/Medical/Dashboard'
import DashboardLayout from './components/layouts/DashboardLayout'
import CreatePrescription from './pages/Doctor/CreatePrescription/CreatePrescription.tsx'
import PatientsList from './pages/Doctor/PatientsList/PatientsList.tsx'
import DocProfile from './pages/Doctor/DocProfile/DocProfile.tsx'
import Prescription from './pages/User/Prescriptions/Prescritpion.tsx'
import UserProfile from './pages/User/Profile/UserProfile.tsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER ROUTES 
            Matches: /user, /user/profile, /user/prescriptions 
        */}
        <Route 
          path="/user/*" 
          element={
            <DashboardLayout role="USER">
              <Routes>
                <Route index element={<UserDashboard />} />
                
                <Route path="prescriptions" element={<Prescription />} />
                <Route path="profile" element={<UserProfile />} />
              </Routes>
            </DashboardLayout>
          } 
        />

        {/* DOCTOR ROUTES 
            Matches: /doctor, /doctor/patients, etc.
        */}
        <Route 
          path="/doctor/*" 
          element={
            <DashboardLayout role="DOCTOR">
              <Routes>
                <Route index element={<DocDashboard />} />
                
                {/* This matches /doctor/create-prescription */}
                <Route path="create-prescription" element={<CreatePrescription />} />

                {/* This matches /doctor/patients */}
                <Route path="patients" element={<PatientsList />} />

                <Route path="profile" element={<DocProfile />} />
              </Routes>
            </DashboardLayout>
          } 
        />

        {/* MEDICAL SHOP ROUTES 
            Matches: /medical, /medical/fetch-prescriptions, etc.
        */}
        <Route 
          path="/medical/*" 
          element={
            <DashboardLayout role="MEDICAL">
              <Routes>
                <Route index element={<MedDashboard />} />
              </Routes>
            </DashboardLayout>
          } 
        />

      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  )
}



export default App
