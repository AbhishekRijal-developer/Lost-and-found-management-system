import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import AboutUsPage from './pages/AboutUs.jsx'
import Home from './pages/Home.jsx'
import ReportLostItem from './pages/ReportLostItem.jsx'
import ReportFoundItem from './pages/ReportFoundItem.jsx'
import LostItems from './pages/LostItems.jsx'
import FoundItems from './pages/FoundItems.jsx'
import ItemDetails from './pages/ItemDetails.jsx'
import MyReports from './pages/MyReports.jsx'
import Profile from './pages/Profile.jsx'
import ContactUs from './pages/ContactUs.jsx'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        {/* Authentication */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Main Pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUs />} />
        
        {/* Lost & Found Items */}
        <Route path="/report-lost" element={<ReportLostItem />} />
        <Route path="/report-found" element={<ReportFoundItem />} />
        <Route path="/lost-items" element={<LostItems />} />
        <Route path="/found-items" element={<FoundItems />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        
        {/* User Pages */}
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
    </AuthProvider>
  )
}

export default App
