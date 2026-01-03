import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { loading, user } = useAuth();

  // Show loader while auth is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // If user is not authenticated
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};