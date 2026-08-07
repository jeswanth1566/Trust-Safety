import { Navigate, useLocation } from 'react-router-dom'

/**
 * Guards routes that require an authenticated user.
 * Redirects to /login (preserving intended destination) when no session exists.
 */
function ProtectedRoute({ children }) {
  const location = useLocation()
  const token = localStorage.getItem('token')
  const authUser = localStorage.getItem('authUser')

  if (!token || !authUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
