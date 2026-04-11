import { Navigate, useLocation } from 'react-router-dom';
import useStore from '../../store/useStore';

/**
 * ProtectedRoute - Restricts access based on authentication and roles.
 * @param {Array} allowedRoles - List of roles that can access this route (e.g. ['passenger', 'coolie'])
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useStore();
  const location = useLocation();

  // 1. If not authenticated, send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If authenticated but role isn't in allowedRoles
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect coolies to their dashboard and passengers to theirs
    const defaultPath = user?.role === 'coolie' ? '/coolie-dashboard' : '/dashboard';
    return <Navigate to={defaultPath} replace />;
  }

  // 3. Otherwise, render the child component
  return children;
};

export default ProtectedRoute;
