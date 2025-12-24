import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import { Toaster } from 'sonner'
import UserDashboard from './pages/User/Dashboard'
import DocDashboard from './pages/Doctor/Dashboard'
import MedDashboard from './pages/Medical/Dashboard'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/usr" element={<UserDashboard />} />
        <Route path="/doc" element={<DocDashboard />} />
        <Route path="/med" element={<MedDashboard />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  )
}



export default App
