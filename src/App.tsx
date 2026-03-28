import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'

// Auth & Layouts
import Login from './pages/Auth/Login'
import LandingPage from './pages/LandingPage'
import Register from './pages/Auth/Register'
import DashboardLayout from './components/layouts/DashboardLayout'
import About from "./pages/about/page";
import ContactPage from './pages/contact/page'
import Features from './components/Features'
import ProtectedRoute from './components/ProtectedRoute'

// User Pages
import UserDashboard from './pages/User/Dashboard'
import Prescription from './pages/User/Prescriptions/Prescritpion.tsx'
import UserProfile from './pages/User/Profile/UserProfile.tsx'
import BookNew from './pages/User/Appointments/BookNew.tsx'
import MyAppointments from './pages/User/Appointments/MyAppointments.tsx'
import AnalysisReport from './pages/User/AnalysisReport.tsx'

// Doctor Pages
import DocDashboard from './pages/Doctor/Dashboard'
import CreatePrescription from './pages/Doctor/CreatePrescription/CreatePrescription.tsx'
import PatientsList from './pages/Doctor/PatientsList/PatientsList.tsx'
import DocProfile from './pages/Doctor/DocProfile/DocProfile.tsx'
import DoctorAvailability from './pages/DoctorAvailability.tsx'

// Medical Pages
import MedDashboard from './pages/Medical/Dashboard'
import FetchPrescriptions from './pages/Medical/fetch-prescriptions/fetch-prescriptions.tsx'
import MedProfile from './pages/Medical/MedProfile/MedProfile.tsx'

// AI & Booking (Standalone/Shared)
import BookingDetails from './pages/BookingDetails/BookingDetails.tsx'
// import BookingDetails from './pages/book/BookingDetails.tsx' // Check this path matches where you saved the new file

function App() {

  return (
    <BrowserRouter>
    
      <Routes>
        <Route path="/about" element={<About />} />
         <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* STANDALONE ROUTES (Accessible outside the Dashboard Layout if needed) */}
        
        
        {/* CRITICAL FIX: 
           This route is placed at the root level so navigate('/book/1') works.
           If you want this inside the sidebar layout, you can move it back into 
           the /user/* section, but you must change navigate() in BookNew.tsx 
           to navigate('/user/book/1').
        */}
        <Route path="/book/:id" element={
          <ProtectedRoute allowedRoles={['USER']}>
            <BookingDetails />
          </ProtectedRoute>
        } />

        {/* USER ROUTES */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <DashboardLayout role="USER">
                <Routes>
                  <Route index element={<UserDashboard />} />
                  <Route path="prescriptions" element={<Prescription />} />
                  <Route path="profile" element={<UserProfile />} />
                  <Route path="appointments" element={<MyAppointments />} />
                  <Route path="appointments/book-new" element={<BookNew />} />
                  <Route path="analysis-report" element={<AnalysisReport />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* DOCTOR ROUTES */}
        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DashboardLayout role="DOCTOR">
                <Routes>
                  <Route index element={<DocDashboard />} />
                  <Route path="create-prescription" element={<CreatePrescription />} />
                  <Route path="patients" element={<PatientsList />} />
                  <Route path="profile" element={<DocProfile />} />
                  <Route path="availability" element={<DoctorAvailability />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* MEDICAL SHOP ROUTES */}
        <Route
          path="/medical/*"
          element={
            <ProtectedRoute allowedRoles={['MEDICAL']}>
              <DashboardLayout role="MEDICAL">
                <Routes>
                  <Route index element={<MedDashboard />} />
                  <Route path='/fetch-prescriptions' element={<FetchPrescriptions />} />
                  <Route path='/profile' element={<MedProfile />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  )
}

export default App