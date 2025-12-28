import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'

// Auth & Layouts
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import DashboardLayout from './components/layouts/DashboardLayout'

// User Pages
import UserDashboard from './pages/User/Dashboard'
import Prescription from './pages/User/Prescriptions/Prescritpion.tsx'
import UserProfile from './pages/User/Profile/UserProfile.tsx'
import BookNew from './pages/User/Appointments/BookNew.tsx' // Ensure this path matches where you saved BookNew

// Doctor Pages
import DocDashboard from './pages/Doctor/Dashboard'
import CreatePrescription from './pages/Doctor/CreatePrescription/CreatePrescription.tsx'
import PatientsList from './pages/Doctor/PatientsList/PatientsList.tsx'
import DocProfile from './pages/Doctor/DocProfile/DocProfile.tsx'

// Medical Pages
import MedDashboard from './pages/Medical/Dashboard'
import FetchPrescriptions from './pages/Medical/fetch-prescriptions/fetch-prescriptions.tsx'
import MedProfile from './pages/Medical/MedProfile/MedProfile.tsx'

// AI & Booking (Standalone/Shared)
import AiDashboard from './pages/AI/AiDashboard.tsx'
import BookingDetails from './pages/BookingDetails/BookingDetails.tsx'
// import BookingDetails from './pages/book/BookingDetails.tsx' // Check this path matches where you saved the new file

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* STANDALONE ROUTES (Accessible outside the Dashboard Layout if needed) */}
        <Route path="/user/ai-health" element={<AiDashboard />} />
        
        {/* CRITICAL FIX: 
           This route is placed at the root level so navigate('/book/1') works.
           If you want this inside the sidebar layout, you can move it back into 
           the /user/* section, but you must change navigate() in BookNew.tsx 
           to navigate('/user/book/1').
        */}
        <Route path="/book/:id" element={<BookingDetails />} />

        {/* USER ROUTES */}
        <Route
          path="/user/*"
          element={
            <DashboardLayout role="USER">
              <Routes>
                <Route index element={<UserDashboard />} />
                <Route path="prescriptions" element={<Prescription />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="appointments/book-new" element={<BookNew />} />
              </Routes>
            </DashboardLayout>
          }
        />

        {/* DOCTOR ROUTES */}
        <Route
          path="/doctor/*"
          element={
            <DashboardLayout role="DOCTOR">
              <Routes>
                <Route index element={<DocDashboard />} />
                <Route path="create-prescription" element={<CreatePrescription />} />
                <Route path="patients" element={<PatientsList />} />
                <Route path="profile" element={<DocProfile />} />
              </Routes>
            </DashboardLayout>
          }
        />

        {/* MEDICAL SHOP ROUTES */}
        <Route
          path="/medical/*"
          element={
            <DashboardLayout role="MEDICAL">
              <Routes>
                <Route index element={<MedDashboard />} />
                <Route path='/fetch-prescriptions' element={<FetchPrescriptions />} />
                <Route path='/profile' element={<MedProfile />} />
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