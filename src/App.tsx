import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Auth/Login'
import LandingPage from './pages/LandingPage'
import Register from './pages/Auth/Register'
import { Toaster } from 'sonner'
import UserDashboard from './pages/User/Dashboard'
import DocDashboard from './pages/Doctor/Dashboard'
import MedDashboard from './pages/Medical/Dashboard'
import DashboardLayout from './components/layouts/DashboardLayout'
import About from "./pages/about/page";
import ContactPage from './pages/contact/page'
import Features from './components/Features'


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

        {/* USER ROUTES 
            Matches: /user, /user/profile, /user/prescriptions 
        */}
        <Route 
          path="/user/*" 
          element={
            <DashboardLayout role="USER">
              <Routes>
                <Route index element={<UserDashboard />} />
                {/* You can add more sub-pages here later, e.g.: */}
                {/* <Route path="profile" element={<UserProfile />} /> */}
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
