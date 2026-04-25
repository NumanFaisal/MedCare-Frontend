import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { trackPageView } from './lib/analytics'

import { lazy, Suspense } from 'react'

// Auth & Layouts
const Login = lazy(() => import('./pages/Auth/Login'))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const Register = lazy(() => import('./pages/Auth/Register'))
import DashboardLayout from './components/layouts/DashboardLayout'
const About = lazy(() => import('./pages/about/page'))
const ContactPage = lazy(() => import('./pages/contact/page'))
const Features = lazy(() => import('./components/Features'))
const ContactSubmissions = lazy(() => import('./pages/Admin/ContactSubmissions'))
import ProtectedRoute from './components/ProtectedRoute'
import CookieConsent from './components/Legal/CookieConsent'
import BugReportModal from './components/Feedback/BugReportModal'

// Legal Pages
const PrivacyPolicy = lazy(() => import('./pages/Legal/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/Legal/TermsOfService'))

// Auth Verification
const VerifyEmail = lazy(() => import('./pages/Auth/VerifyEmail'))
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'))

// User Pages
const UserDashboard = lazy(() => import('./pages/User/Dashboard'))
const Prescription = lazy(() => import('./pages/User/Prescriptions/Prescritpion.tsx'))
const UserProfile = lazy(() => import('./pages/User/Profile/UserProfile.tsx'))
const BookNew = lazy(() => import('./pages/User/Appointments/BookNew.tsx'))
const MyAppointments = lazy(() => import('./pages/User/Appointments/MyAppointments.tsx'))
const AnalysisReport = lazy(() => import('./pages/User/AnalysisReport.tsx'))

// Doctor Pages
const DocDashboard = lazy(() => import('./pages/Doctor/Dashboard'))
const CreatePrescription = lazy(() => import('./pages/Doctor/CreatePrescription/CreatePrescription.tsx'))
const PatientsList = lazy(() => import('./pages/Doctor/PatientsList/PatientsList.tsx'))
const DoctorAppointments = lazy(() => import('./pages/Doctor/DoctorAppointments.tsx'))
const DocProfile = lazy(() => import('./pages/Doctor/DocProfile/DocProfile.tsx'))
const DoctorAvailability = lazy(() => import('./pages/DoctorAvailability.tsx'))

// Medical Pages
const MedDashboard = lazy(() => import('./pages/Medical/Dashboard'))
const FetchPrescriptions = lazy(() => import('./pages/Medical/fetch-prescriptions/fetch-prescriptions.tsx'))
const MedProfile = lazy(() => import('./pages/Medical/MedProfile/MedProfile.tsx'))

// AI & Booking (Standalone/Shared)
const BookingDetails = lazy(() => import('./pages/BookingDetails/BookingDetails.tsx'))

// Loading Spinner
const GlobalLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
)

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

import NavbarWrapper from './components/NavbarWrapper'
import FooterWrapper from './components/FooterWrapper'
import Footer from './components/Footer'

function App() {

  return (
    <BrowserRouter>
      <AnalyticsTracker />
      <Suspense fallback={<GlobalLoader />}>
      <NavbarWrapper />
      <Routes>

        <Route path="/about" element={<About />} />
         <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route 
          path="/admin/contacts" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ContactSubmissions />
            </ProtectedRoute>
          } 
        />


        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* LEGAL ROUTES */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />

        {/* AUTH VERIFICATION ROUTES */}
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
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
                  <Route path="appointments" element={<DoctorAppointments />} />
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
      <FooterWrapper />
      </Suspense>
      <Toaster position="top-right" richColors />

      <CookieConsent />
      <BugReportModal />
    </BrowserRouter>
  )
}

export default App