import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { useAuth } from './context/AuthContext.jsx'
import AdminRoute from './component/AdminRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
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
import Chat from './pages/Chat.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import Debug from './pages/Debug.jsx'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        {/* Authentication */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
        <Route path="/reset-password/:token" element={<PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>} />
        
        {/* Main Pages */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/about-us" element={<ProtectedRoute><AboutUsPage /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
        
        {/* Lost & Found Items */}
        <Route path="/report-lost" element={<ProtectedRoute><ReportLostItem /></ProtectedRoute>} />
        <Route path="/report-found" element={<ProtectedRoute><ReportFoundItem /></ProtectedRoute>} />
        <Route path="/lost-items" element={<ProtectedRoute><LostItems /></ProtectedRoute>} />
        <Route path="/found-items" element={<ProtectedRoute><FoundItems /></ProtectedRoute>} />
        <Route path="/item/:id" element={<ProtectedRoute><ItemDetails /></ProtectedRoute>} />
        
        {/* User Pages */}
        <Route path="/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        
        {/* Debug Page */}
        <Route path="/debug" element={<ProtectedRoute><Debug /></ProtectedRoute>} />
        
        {/* Admin Pages */}
        <Route path="/admin-panel" element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
    </AuthProvider>
  )
}

export default App
