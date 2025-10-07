import { Navigate } from "react-router-dom";

// Example: user comes from context or app state (could be from Redux, Context, etc.)
export function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
