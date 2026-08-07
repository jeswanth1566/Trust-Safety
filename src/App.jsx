import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Toaster } from 'sonner'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DashboardPage from './pages/DashboardPage'
import AuditLogsPage from './pages/AuditLogsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AdminPanelPage from './pages/AdminPanelPage'
import RiskScoringPage from './pages/RiskScoringPage'
import CounterfeitDetectionPage from './pages/CounterfeitDetectionPage'
import ReviewModerationPage from './pages/ReviewModerationPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/risk-scoring" element={<ProtectedRoute><RiskScoringPage /></ProtectedRoute>} />
          <Route path="/counterfeit-detection" element={<ProtectedRoute><CounterfeitDetectionPage /></ProtectedRoute>} />
          <Route path="/review-moderation" element={<ProtectedRoute><ReviewModerationPage /></ProtectedRoute>} />
          <Route path="/audit-logs" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanelPage /></ProtectedRoute>} />
        </Routes>
      </motion.div>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  )
}

export default App
