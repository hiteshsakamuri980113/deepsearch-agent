import { Navigate, useLocation } from "react-router-dom";
import { useSpotifyAuth } from "../context/SpotifyAuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSpotifyAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  if (!isAuthenticated) {
    // Redirect to landing/login page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
